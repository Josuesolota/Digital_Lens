import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termos de Serviço",
  description: `Termos e condições de utilização dos serviços da ${siteConfig.name}.`,
  alternates: { canonical: "/termos" },
  robots: { index: true, follow: true },
};

export default function TermosPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Termos de Serviço"
      updatedAt="Última atualização: 19 de setembro de 2026"
    >
      <p>
        Estes Termos de Serviço (“Termos”) regulam a utilização do site{" "}
        {siteConfig.url.replace("https://", "")} e a contratação de serviços junto da{" "}
        {siteConfig.legalName} (“nós”, “a Digital Lens”), agência digital sediada em{" "}
        {siteConfig.address.locality}, Angola. Ao encomendar um serviço ou utilizar o site,
        aceita estes Termos na íntegra.
      </p>

      <h2>1. Os nossos serviços</h2>
      <p>
        Prestamos serviços de desenvolvimento web, inteligência artificial, marketing digital e
        locução/narração, descritos em detalhe nas páginas de{" "}
        <Link href="/servicos" className="underline underline-offset-2 hover:text-fog-50">
          Serviços
        </Link>{" "}
        e{" "}
        <Link href="/loja" className="underline underline-offset-2 hover:text-fog-50">
          Loja
        </Link>
        . O âmbito exato de cada encomenda é o descrito na página do produto no momento da
        compra, incluindo as opções de configuração selecionadas.
      </p>

      <h2>2. Encomendas e preços</h2>
      <p>
        Os preços apresentados na loja são calculados com base nas opções que escolhe e
        confirmados antes do pagamento. Os preços estão expressos em euros (EUR) e podem incluir
        impostos aplicáveis, cobrados de acordo com a legislação do país de faturação do cliente.
        Reservamo-nos o direito de corrigir erros manifestos de preço antes da confirmação da
        encomenda.
      </p>

      <h2>3. Pagamento</h2>
      <p>
        Os pagamentos são processados pela <strong>Paddle.com Market Ltd</strong> (“Paddle”), que
        atua como o nosso revendedor autorizado e <strong>Merchant of Record</strong> — ou seja, a
        Paddle é a entidade legalmente responsável pela venda, pela cobrança dos impostos
        aplicáveis e pelo processamento de pagamentos e reembolsos. Ao concluir uma compra, está
        também a aceitar os termos de utilização da Paddle, disponíveis em{" "}
        <a
          href="https://www.paddle.com/legal/checkout-buyer-terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-fog-50"
        >
          paddle.com/legal/checkout-buyer-terms
        </a>
        .
      </p>

      <h2>4. Prazos de entrega</h2>
      <p>
        O prazo estimado de cada serviço está indicado na respetiva página do produto e conta a
        partir da confirmação do pagamento e da receção de todos os materiais/informações que
        solicitarmos (textos, imagens, acessos, etc.). Atrasos na entrega desses materiais pelo
        cliente têm impacto direto no prazo final.
      </p>

      <h2>5. Propriedade intelectual</h2>
      <p>
        Salvo acordo por escrito em contrário, os direitos de propriedade intelectual sobre o
        trabalho final (código-fonte, design, conteúdo produzido especificamente para a
        encomenda) transferem-se para o cliente após a confirmação do pagamento integral.
        Ferramentas, bibliotecas, templates de terceiros ou metodologias internas usadas na
        produção continuam a pertencer aos respetivos titulares ou à Digital Lens.
      </p>

      <h2>6. Cancelamentos e reembolsos</h2>
      <p>
        As condições de cancelamento e reembolso estão descritas em detalhe na nossa{" "}
        <Link href="/reembolsos" className="underline underline-offset-2 hover:text-fog-50">
          Política de Reembolso
        </Link>
        , que faz parte integrante destes Termos.
      </p>

      <h2>7. Limitação de responsabilidade</h2>
      <p>
        Na máxima medida permitida por lei, a nossa responsabilidade por qualquer reclamação
        relacionada com um serviço está limitada ao valor efetivamente pago por esse serviço. Não
        somos responsáveis por danos indiretos, perda de receita ou de dados resultantes de
        fatores fora do nosso controlo razoável.
      </p>

      <h2>8. Alterações a estes Termos</h2>
      <p>
        Podemos atualizar estes Termos periodicamente. A versão em vigor é sempre a publicada
        nesta página, com a data de atualização indicada no topo. Alterações materiais serão
        comunicadas por e-mail a clientes com encomendas em curso.
      </p>

      <h2>9. Lei aplicável</h2>
      <p>
        Estes Termos regem-se pela lei angolana, sem prejuízo dos direitos de proteção ao
        consumidor que lhe assistam ao abrigo da lei do seu país de residência.
      </p>

      <h2>10. Contacto</h2>
      <p>
        Para qualquer questão sobre estes Termos, contacte-nos em{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="underline underline-offset-2 hover:text-fog-50"
        >
          {siteConfig.email}
        </a>{" "}
        ou através da{" "}
        <Link href="/contacto" className="underline underline-offset-2 hover:text-fog-50">
          página de contacto
        </Link>
        .
      </p>
    </LegalPage>
  );
}
