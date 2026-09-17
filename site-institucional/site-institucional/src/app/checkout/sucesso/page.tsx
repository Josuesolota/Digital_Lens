import type { Metadata } from "next";
import { CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ClearCartOnSuccess } from "@/components/cart/ClearCartOnSuccess";
import { isDatabaseConfigured } from "@/lib/db";
import { findOrderBySession } from "@/lib/db/queries";
import { formatPrice } from "@/lib/products";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.checkoutSuccess.title,
    robots: { index: false, follow: false },
  };
}

// Depende do `session_id` do Stripe — nunca deve ser servida a partir de cache.
export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<{ session_id?: string }> };

export default async function SucessoPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;
  const t = getDictionary(await getLocale());

  // Leitura meramente informativa: a confirmação real do pagamento vem do
  // webhook do Stripe, nunca desta página (que qualquer pessoa pode abrir).
  const order =
    sessionId && isDatabaseConfigured()
      ? await findOrderBySession(sessionId).catch(() => null)
      : null;

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <AuroraBackground />
      <ClearCartOnSuccess />

      <Container className="relative flex justify-center">
        <GlassCard className="flex max-w-lg flex-col items-center gap-6 p-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-400/10">
            <CheckCircle2 size={30} className="text-success-400" />
          </span>

          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl font-semibold text-fog-50">
              {t.pages.checkoutSuccess.heading}
            </h1>
            <p className="text-balance text-sm leading-relaxed text-fog-400">
              {t.pages.checkoutSuccess.description}
            </p>
          </div>

          {order && (
            <div className="w-full border-y border-hairline-1 py-5 text-left">
              <p className="eyebrow mb-3 text-fog-600">
                {t.pages.checkoutSuccess.order(order.id.slice(0, 8).toUpperCase())}
              </p>
              <ul className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <span className="text-fog-200">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-fog-600"> × {item.quantity}</span>
                      )}
                    </span>
                    <span className="shrink-0 font-mono text-fog-50">
                      {formatPrice(item.unitAmount * item.quantity, order.currency.toUpperCase())}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-hairline-1 pt-3">
                <span className="text-sm font-medium text-fog-50">{t.pages.checkoutSuccess.total}</span>
                <span className="font-mono text-base font-semibold text-fog-50">
                  {formatPrice(order.amount_total, order.currency.toUpperCase())}
                </span>
              </div>
            </div>
          )}

          <p className="flex items-center gap-2 text-xs text-fog-600">
            <Mail size={13} />
            {t.pages.checkoutSuccess.receiptNote}
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/conta">{t.pages.checkoutSuccess.myOrders}</Button>
            <Button href="/" variant="secondary">
              {t.pages.checkoutSuccess.backHome}
            </Button>
          </div>
        </GlassCard>
      </Container>
    </section>
  );
}
