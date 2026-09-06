-- ---------------------------------------------------------------------------
-- Digital Lens — esquema da base de dados (Neon / PostgreSQL)
--
-- Aplicar uma vez, no SQL Editor da consola Neon ou via psql:
--   psql "$DATABASE_URL" -f src/lib/db/schema.sql
--
-- O script é idempotente: pode ser corrido novamente sem destruir dados.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";  -- fornece gen_random_uuid()

-- Contas de utilizador ------------------------------------------------------
create table if not exists users (
  id             uuid primary key default gen_random_uuid(),
  name           text        not null,
  -- Guardado sempre em minúsculas; o índice único abaixo garante que
  -- "Ana@x.pt" e "ana@x.pt" não criam duas contas.
  email          text        not null,
  password_hash  text        not null,
  email_verified timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create unique index if not exists users_email_key on users (lower(email));

-- Encomendas ----------------------------------------------------------------
-- `items` guarda o carrinho tal como estava no momento da compra (snapshot):
-- se o preço do catálogo mudar amanhã, a encomenda antiga mantém-se fiel.
create table if not exists orders (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references users (id) on delete set null,
  email                  text        not null,
  stripe_session_id      text        not null unique,
  stripe_payment_intent  text,
  status                 text        not null default 'pending'
                           check (status in ('pending', 'paid', 'failed', 'refunded')),
  amount_total           integer     not null,
  currency               text        not null default 'eur',
  items                  jsonb       not null,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists orders_user_id_idx on orders (user_id, created_at desc);
create index if not exists orders_email_idx   on orders (lower(email), created_at desc);

-- Mensagens do formulário de contacto ---------------------------------------
-- Persistidas mesmo quando o e-mail é enviado: se o Resend falhar, o pedido
-- do cliente não se perde.
create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text        not null,
  email      text        not null,
  subject    text,
  message    text        not null,
  source     text        not null default 'contacto',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on contact_messages (created_at desc);

-- Lista de espera / newsletter ----------------------------------------------
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text        not null,
  source     text        not null default 'site',
  created_at timestamptz not null default now()
);

create unique index if not exists newsletter_email_key
  on newsletter_subscribers (lower(email));

-- Rate limiting ---------------------------------------------------------------
-- Contador de janela fixa partilhado por todas as instâncias serverless.
-- Ver `src/lib/rate-limit.ts` para a estratégia e os limites aplicados.
create table if not exists rate_limits (
  -- "<accao>:<identificador>[:<scope>]", ex.: "login:203.0.113.7:ana@x.pt"
  bucket       text        primary key,
  window_start timestamptz not null default now(),
  hits         integer     not null default 0
);

-- Suporta a limpeza oportunista das janelas já expiradas.
create index if not exists rate_limits_window_start_idx
  on rate_limits (window_start);
