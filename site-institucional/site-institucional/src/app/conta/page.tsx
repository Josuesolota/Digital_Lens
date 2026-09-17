import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";
import { getSession } from "@/auth";
import { logoutAction } from "@/app/auth-actions";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { isDatabaseConfigured } from "@/lib/db";
import { findOrdersByUser, type OrderRecord } from "@/lib/db/queries";
import { formatPrice } from "@/lib/products";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.account.title,
    robots: { index: false, follow: false },
  };
}

// Depende da sessão do utilizador — nunca estática.
export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const session = await getSession();
  if (!session?.user) redirect("/entrar?redirectTo=/conta");

  const locale = await getLocale();
  const t = getDictionary(locale);

  const STATUS_LABELS: Record<OrderRecord["status"], { label: string; className: string }> = {
    pending: { label: t.pages.account.statusPending, className: "text-fog-400 border-hairline-2" },
    paid: { label: t.pages.account.statusPaid, className: "text-success-400 border-success-400/40" },
    failed: { label: t.pages.account.statusFailed, className: "text-danger-400 border-danger-400/40" },
    refunded: { label: t.pages.account.statusRefunded, className: "text-fog-400 border-hairline-2" },
  };

  const orders = isDatabaseConfigured()
    ? await findOrdersByUser(session.user.id).catch(() => [])
    : [];

  return (
    <section className="py-16 lg:py-20">
      <Container className="flex flex-col gap-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="eyebrow text-lens-violet-400">{t.pages.account.areaLabel}</span>
            <h1 className="font-display text-3xl font-semibold text-fog-50 sm:text-4xl">
              {t.pages.account.hello(session.user.name?.split(" ")[0] ?? t.pages.account.defaultCustomer)}
            </h1>
            <p className="text-sm text-fog-400">{session.user.email}</p>
          </div>

          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              {t.pages.account.logout}
            </Button>
          </form>
        </header>

        <div className="flex flex-col gap-5">
          <h2 className="font-display text-xl font-semibold text-fog-50">
            {t.pages.account.orders}
          </h2>

          {orders.length === 0 ? (
            <GlassCard className="flex flex-col items-center gap-5 p-12 text-center">
              <Package size={36} className="text-fog-600" strokeWidth={1.25} />
              <div className="flex flex-col gap-1.5">
                <p className="font-medium text-fog-50">{t.pages.account.noOrders}</p>
                <p className="text-sm text-fog-400">{t.pages.account.noOrdersDescription}</p>
              </div>
              <Button href="/loja" size="sm">
                <ShoppingBag size={15} />
                {t.pages.account.viewStore}
              </Button>
            </GlassCard>
          ) : (
            <ul className="flex flex-col gap-4">
              {orders.map((order) => {
                const status = STATUS_LABELS[order.status];
                return (
                  <li key={order.id}>
                    <GlassCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-xs text-fog-600">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-fog-200">
                          {order.items.map((item) => item.name).join(", ")}
                        </p>
                        <p className="mt-1 text-xs text-fog-600">
                          {new Date(order.created_at).toLocaleDateString(t.pages.account.dateLocale, {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <span className="shrink-0 font-mono text-lg font-semibold text-fog-50">
                        {formatPrice(order.amount_total, order.currency.toUpperCase())}
                      </span>
                    </GlassCard>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <GlassCard className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <p className="text-sm text-fog-400">{t.pages.account.needHelp}</p>
          <Link
            href="/contacto"
            className="shrink-0 text-sm text-fog-50 underline underline-offset-4 transition-colors hover:text-lens-violet-400"
          >
            {t.pages.account.talkToUs}
          </Link>
        </GlassCard>
      </Container>
    </section>
  );
}
