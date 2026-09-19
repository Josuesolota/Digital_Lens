import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Reembolso",
  description: `Condições de cancelamento e reembolso dos serviços da ${siteConfig.name}.`,
  alternates: { canonical: "/reembolsos" },
  robots: { index: true, follow: true },
};

export default function ReembolsosPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de Reembolso"
      updatedAt="Última atualização: 19 de setembro de 2026"
    >
      <h2>1. Quem processa os reembolsos</h2>
      <p>
        Todos os pagamentos no nosso site são processados pela{" "}
        <strong>Paddle.com Market Ltd</strong> (“Paddle”), que atua como revendedor autorizado e{" "}
        <strong>Merchant of Record</strong> das nossas vendas. Isto significa que a Paddle é a
        entidade que efetivamente cobra o pagamento e que processa qualquer reembolso aprovado —
        não nós diretamente. A Paddle trata também de todo o apoio relacionado com faturação e
        devoluções.
      </p>

      <h2>2. Prazo para pedir um reembolso</h2>
      <p>
        Pode pedir o cancelamento e reembolso de uma encomenda até <strong>14 dias</strong> após a
        data de compra, desde que o trabalho ainda não tenha começado (ver secção 3). Passado esse
        prazo, ou depois de o trabalho ter começado, o reembolso passa a ser avaliado caso a caso.
      </p>

      <h2>3. Serviços já iniciados ou entregues</h2>
      <p>
        Os nossos serviços são personalizados para cada cliente (desenvolvimento web, produção de
        conteúdo, locução, etc.), pelo que, uma vez iniciado o trabalho:
      </p>
      <ul>
        <li>
          Se cancelar depois de o trabalho ter começado mas antes da entrega final, pode ter
          direito a um reembolso parcial, proporcional ao trabalho ainda não realizado;
        </li>
        <li>
          Se o serviço já tiver sido entregue e aprovado pelo cliente, não é elegível para
          reembolso, salvo em caso de incumprimento comprovado do que foi acordado;
        </li>
        <li>
          Serviços de subscrição mensal (ex.: manutenção, gestão de tráfego pago) podem ser
          cancelados a qualquer momento para deixarem de renovar no mês seguinte — o mês já
          iniciado não é reembolsado.
        </li>
      </ul>

      <h2>4. Como pedir um reembolso</h2>
      <p>
        Contacte-nos primeiro em{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="underline underline-offset-2 hover:text-fog-50"
        >
          {siteConfig.email}
        </a>{" "}
        ou pela{" "}
        <Link href="/contacto" className="underline underline-offset-2 hover:text-fog-50">
          página de contacto
        </Link>
        , indicando o número da encomenda (disponível na sua{" "}
        <Link href="/conta" className="underline underline-offset-2 hover:text-fog-50">
          área de cliente
        </Link>
        ) e o motivo do pedido. Depois de confirmarmos a elegibilidade, a Paddle processa o
        reembolso diretamente através do método de pagamento original.
      </p>

      <h2>5. Prazo de processamento</h2>
      <p>
        Depois de aprovado, o reembolso é normalmente processado pela Paddle em{" "}
        <strong>5 a 10 dias úteis</strong>, dependendo do seu banco ou emissor do cartão.
      </p>

      <h2>6. Encomendas com erro nosso</h2>
      <p>
        Se identificarmos um erro da nossa parte — cobrança duplicada, valor incorreto, ou serviço
        não entregue conforme acordado — reembolsamos integralmente, independentemente do prazo
        indicado na secção 2.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Para qualquer dúvida sobre esta política, escreva-nos para{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="underline underline-offset-2 hover:text-fog-50"
        >
          {siteConfig.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
