import "server-only";
import { headers } from "next/headers";
import { isDatabaseConfigured, sql } from "@/lib/db";

/**
 * Rate limiting com janela fixa, persistido em Postgres (Neon).
 *
 * PORQUÊ POSTGRES E NÃO MEMÓRIA: em serverless cada invocação pode correr numa
 * instância diferente e as instâncias morrem entre pedidos. Um contador em
 * memória protegeria apenas contra o atacante distraído — daria a sensação de
 * segurança sem a substância. O contador tem de viver fora do processo.
 *
 * PORQUÊ NÃO UPSTASH/REDIS: já temos Postgres para as contas e encomendas. Um
 * segundo fornecedor só se justifica quando o volume o exigir; até lá, uma
 * tabela com um UPSERT atómico faz o mesmo trabalho sem mais uma factura, mais
 * um segredo e mais um ponto de falha.
 *
 * JANELA FIXA, NÃO DESLIZANTE: no pior caso permite até 2× o limite na
 * fronteira entre janelas (ex.: 5 pedidos no último segundo de uma janela e
 * mais 5 no primeiro da seguinte). Para formulários e autenticação é um
 * compromisso aceitável e custa uma única query; uma janela deslizante exigiria
 * guardar cada evento.
 */

export type RateLimitRule = {
  /** Número máximo de pedidos permitidos dentro da janela */
  limit: number;
  /** Duração da janela, em segundos */
  windowSeconds: number;
};

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Segundos até a janela reabrir (0 quando `ok`) */
  retryAfter: number;
};

/**
 * Limites por acção. Deliberadamente generosos para uso humano legítimo e
 * apertados o suficiente para tornar o abuso automatizado pouco atractivo.
 */
export const RATE_LIMITS = {
  /** Formulário de contacto: envia e-mail — o alvo mais óbvio para spam */
  contact: { limit: 5, windowSeconds: 3_600 },
  /** Lista de espera dos cursos */
  newsletter: { limit: 5, windowSeconds: 3_600 },
  /** Criação de conta: trava a criação de contas em massa */
  register: { limit: 5, windowSeconds: 3_600 },
  /** Autenticação: trava força bruta sem incomodar quem erra a password */
  login: { limit: 10, windowSeconds: 900 },
  /** Checkout: cria sessões no Stripe, que tem os seus próprios limites */
  checkout: { limit: 20, windowSeconds: 3_600 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitAction = keyof typeof RATE_LIMITS;

// ── Identificação do cliente ────────────────────────────────────────────────

/**
 * Identificador do cliente para efeitos de contagem.
 *
 * `x-forwarded-for` é enviável pelo cliente em geral, mas na Vercel (e em
 * qualquer proxy bem configurado) o valor é **reescrito** na borda, pelo que a
 * primeira entrada é o IP real. Preferimos ainda assim `x-vercel-forwarded-for`
 * quando existe, por ser definido exclusivamente pela plataforma.
 *
 * Se nada disto existir (execução local, proxy mal configurado) devolvemos
 * "anon": todos os pedidos passam a partilhar o mesmo balde. É restritivo de
 * mais em desenvolvimento, mas nunca permissivo de mais em produção.
 */
async function clientIdentifier(): Promise<string> {
  const headerList = await headers();

  const vercelIp = headerList.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0].trim();

  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  return headerList.get("x-real-ip")?.trim() || "anon";
}

// ── Fallback em memória ─────────────────────────────────────────────────────

/**
 * Usado apenas quando `DATABASE_URL` não está definida (ex.: desenvolvimento
 * local sem base de dados). Não sobrevive entre invocações serverless — não é,
 * nem pretende ser, protecção de produção.
 */
const memoryBuckets = new Map<string, { windowStart: number; hits: number }>();

function checkInMemory(bucket: string, rule: RateLimitRule): RateLimitResult {
  const now = Date.now();
  const windowMs = rule.windowSeconds * 1_000;
  const existing = memoryBuckets.get(bucket);

  if (!existing || now - existing.windowStart >= windowMs) {
    memoryBuckets.set(bucket, { windowStart: now, hits: 1 });
    return { ok: true, remaining: rule.limit - 1, retryAfter: 0 };
  }

  existing.hits += 1;
  const retryAfter = Math.ceil((existing.windowStart + windowMs - now) / 1_000);

  return existing.hits > rule.limit
    ? { ok: false, remaining: 0, retryAfter }
    : { ok: true, remaining: rule.limit - existing.hits, retryAfter: 0 };
}

// ── Implementação em Postgres ───────────────────────────────────────────────

type BucketRow = { hits: number; reset_in: number };

/**
 * Incrementa o contador e devolve o estado do balde numa única instrução.
 *
 * O UPSERT resolve a corrida entre pedidos concorrentes: o Postgres serializa
 * as escritas sobre a mesma chave primária, pelo que dois pedidos simultâneos
 * nunca lêem o mesmo valor antes de incrementar.
 */
async function checkInDatabase(
  bucket: string,
  rule: RateLimitRule
): Promise<RateLimitResult> {
  const rows = (await sql()`
    insert into rate_limits (bucket, window_start, hits)
    values (${bucket}, now(), 1)
    on conflict (bucket) do update
      set hits = case
            when rate_limits.window_start + make_interval(secs => ${rule.windowSeconds}) <= now()
            then 1
            else rate_limits.hits + 1
          end,
          window_start = case
            when rate_limits.window_start + make_interval(secs => ${rule.windowSeconds}) <= now()
            then now()
            else rate_limits.window_start
          end
    returning
      hits,
      greatest(
        0,
        ceil(extract(epoch from (
          rate_limits.window_start + make_interval(secs => ${rule.windowSeconds}) - now()
        )))
      )::int as reset_in
  `) as BucketRow[];

  const row = rows[0];
  if (!row) return { ok: true, remaining: rule.limit - 1, retryAfter: 0 };

  return row.hits > rule.limit
    ? { ok: false, remaining: 0, retryAfter: row.reset_in }
    : { ok: true, remaining: rule.limit - row.hits, retryAfter: 0 };
}

/**
 * Limpeza oportunista das linhas expiradas.
 *
 * Corre em ~2% das verificações, sem bloquear a resposta. Evita ter de manter
 * um cron só para isto e mantém a tabela pequena — o que importa, porque a
 * chave primária é lida a cada pedido.
 */
function sweepExpired() {
  if (Math.random() > 0.02) return;
  void sql()`
    delete from rate_limits where window_start < now() - interval '1 day'
  `.catch(() => undefined);
}

// ── API pública ─────────────────────────────────────────────────────────────

/**
 * Verifica (e consome) uma unidade do limite para a acção indicada.
 *
 * @param action  Acção protegida — a chave define o limite aplicado.
 * @param scope   Discriminador adicional dentro da acção (ex.: o e-mail no
 *                login, para que um atacante não esgote o balde de um IP
 *                partilhado e bloqueie utilizadores legítimos).
 *
 * FALHA ABERTA por desenho: se a base de dados estiver indisponível, deixamos
 * passar. A alternativa — bloquear todos os formulários do site durante uma
 * falha da base de dados — causaria mais prejuízo do que o abuso que evita.
 */
export async function rateLimit(
  action: RateLimitAction,
  scope?: string
): Promise<RateLimitResult> {
  const rule = RATE_LIMITS[action];
  const identifier = await clientIdentifier();
  const bucket = `${action}:${identifier}${scope ? `:${scope.toLowerCase()}` : ""}`;

  if (!isDatabaseConfigured()) {
    return checkInMemory(bucket, rule);
  }

  try {
    const result = await checkInDatabase(bucket, rule);
    sweepExpired();
    return result;
  } catch (error) {
    console.error("[rate-limit] falha ao consultar o contador:", error);
    return { ok: true, remaining: rule.limit, retryAfter: 0 };
  }
}

/** Mensagem para o utilizador, com o tempo de espera em linguagem natural. */
export function rateLimitMessage(retryAfter: number): string {
  if (retryAfter < 60) {
    return "Demasiados pedidos. Aguarde alguns segundos e tente novamente.";
  }

  const minutes = Math.ceil(retryAfter / 60);
  if (minutes < 60) {
    return `Demasiados pedidos. Tente novamente dentro de ${minutes} ${minutes === 1 ? "minuto" : "minutos"}.`;
  }

  // Arredondamos aos minutos antes de converter: 3586s são 60 minutos, que se
  // lê melhor como "1 hora" do que como "60 minutos".
  const hours = Math.ceil(minutes / 60);
  return `Demasiados pedidos. Tente novamente dentro de ${hours} ${hours === 1 ? "hora" : "horas"}.`;
}
