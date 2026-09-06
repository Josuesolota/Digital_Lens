import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findUserByEmail, findUserById } from "@/lib/db/queries";
import { isDatabaseConfigured } from "@/lib/db";

/**
 * Autenticação — NextAuth v5 (Auth.js) com provider de credenciais sobre Neon.
 *
 * Sessão em JWT (obrigatório com o provider Credentials, que não suporta
 * sessões em base de dados). O `id` do utilizador é propagado do token para a
 * sessão, para que as Server Components consigam ligar encomendas ao dono.
 */

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * As contas só funcionam com `AUTH_SECRET` **e** `DATABASE_URL` definidos.
 * Sem elas o site continua a servir a vertente institucional e a vitrine — só
 * a área de cliente fica indisponível.
 */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // A Vercel expõe o host correcto por header; sem isto o Auth.js recusa
  // pedidos vindos de domínios de preview.
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: {
    signIn: "/entrar",
    error: "/entrar",
  },
  providers: [
    Credentials({
      name: "E-mail e palavra-passe",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Palavra-passe", type: "password" },
      },
      async authorize(raw) {
        if (!isDatabaseConfigured()) return null;

        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await findUserByEmail(parsed.data.email);
        if (!user) {
          // Compara mesmo assim contra um hash descartável: mantém o tempo de
          // resposta constante e evita revelar que o e-mail não existe.
          await bcrypt.compare(parsed.data.password, "$2a$10$invalidsaltinvalidsaltinvalidsaltinvalidsaltinvalidsa");
          return null;
        }

        const valid = await bcrypt.compare(parsed.data.password, user.password_hash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        // Mantém nome/e-mail alinhados com a base de dados sem obrigar o
        // utilizador a voltar a autenticar-se após uma alteração de perfil.
        if (isDatabaseConfigured()) {
          const fresh = await findUserById(token.sub).catch(() => null);
          if (fresh) {
            session.user.name = fresh.name;
            session.user.email = fresh.email;
          }
        }
      }
      return session;
    },
  },
});

/**
 * Leitura de sessão tolerante a ambiente incompleto.
 *
 * `auth()` lança (e polui os logs) quando falta o `AUTH_SECRET`. Como o site
 * tem de continuar a servir as páginas públicas nesse cenário, encapsulamos a
 * chamada: sem configuração, não há sessão — e nada rebenta.
 */
export async function getSession() {
  if (!isAuthConfigured() || !isDatabaseConfigured()) return null;
  try {
    return await auth();
  } catch (error) {
    console.error("[auth] falha ao ler a sessão:", error);
    return null;
  }
}
