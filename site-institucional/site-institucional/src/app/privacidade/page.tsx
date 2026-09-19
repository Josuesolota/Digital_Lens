import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Como a ${siteConfig.name} recolhe, usa e protege os seus dados pessoais.`,
  alternates: { canonical: "/privacidade" },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de Privacidade"
      updatedAt="Última atualização: 19 de setembro de 2026"
    >
      <p>
        Esta Política de Privacidade explica que dados pessoais a {siteConfig.legalName} recolhe
        quando visita o nosso site ou contrata os nossos serviços, para que os usamos, e quais os
        seus direitos sobre eles.
      </p>

      <h2>1. Que dados recolhemos</h2>
      <ul>
        <li>
          <strong>Conta de cliente:</strong> nome, e-mail e palavra-passe (guardada de forma
          encriptada, nunca em texto simples), quando cria uma conta em{" "}
          <Link href="/registar" className="underline underline-offset-2 hover:text-fog-50">
            /registar
          </Link>
          .
        </li>
        <li>
          <strong>Encomendas:</strong> os serviços escolhidos, o valor pago e o e-mail associado à
          compra, para podermos confirmar o pagamento e enviar o recibo.
        </li>
        <li>
          <strong>Formulário de contacto e newsletter:</strong> nome, e-mail e a mensagem que nos
          envia.
        </li>
        <li>
          <strong>Dados técnicos:</strong> endereço IP e identificadores de sessão, usados apenas
          para segurança (prevenção de abuso/rate limiting) e para manter a sua sessão iniciada.
        </li>
        <li>
          <strong>Preferências locais:</strong> idioma e tema (claro/escuro) escolhidos, guardados
          no seu próprio dispositivo (cookie/armazenamento local), nunca enviados para nós.
        </li>
      </ul>
      <p>
        <strong>Não recolhemos nem guardamos dados de cartões de pagamento.</strong> Esses dados
        são introduzidos diretamente no sistema seguro da Paddle, o nosso processador de
        pagamentos — nunca passam pelos nossos servidores.
      </p>

      <h2>2. Para que usamos os seus dados</h2>
      <ul>
        <li>Processar e entregar as encomendas que faz;</li>
        <li>Responder a pedidos de contacto e orçamento;</li>
        <li>Enviar recibos, confirmações e notificações relacionadas com a sua encomenda;</li>
        <li>Manter a segurança da sua conta e do site;</li>
        <li>Enviar a newsletter, apenas se subscrever voluntariamente essa lista.</li>
      </ul>

      <h2>3. Com quem partilhamos dados</h2>
      <p>
        Partilhamos apenas o estritamente necessário, com prestadores de serviços que nos ajudam a
        operar o site, cada um sujeito às suas próprias políticas de privacidade:
      </p>
      <ul>
        <li>
          <strong>Paddle.com Market Ltd</strong> — processamento de pagamentos (Merchant of
          Record);
        </li>
        <li>
          <strong>Resend</strong> — envio de e-mails transacionais (confirmações, recibos,
          respostas ao formulário de contacto);
        </li>
        <li>
          <strong>Neon</strong> — armazenamento da base de dados (contas, encomendas, mensagens);
        </li>
        <li>
          <strong>Vercel</strong> — alojamento do site;
        </li>
        <li>
          <strong>Sanity</strong> — gestão do conteúdo do blog.
        </li>
      </ul>
      <p>Nunca vendemos os seus dados a terceiros para fins de marketing.</p>

      <h2>4. Quanto tempo guardamos os dados</h2>
      <p>
        Guardamos os dados de conta e de encomendas enquanto a conta estiver ativa, e depois
        disso pelo período exigido por obrigações fiscais e contabilísticas aplicáveis. Pode
        pedir a eliminação da sua conta a qualquer momento — ver secção 6.
      </p>

      <h2>5. Segurança</h2>
      <p>
        As palavras-passe são guardadas de forma encriptada (nunca em texto simples), as ligações
        ao site são sempre feitas por HTTPS, e o acesso aos dados internos é limitado ao
        estritamente necessário para operar o serviço.
      </p>

      <h2>6. Os seus direitos</h2>
      <p>Tem o direito de, a qualquer momento:</p>
      <ul>
        <li>Aceder aos dados que temos sobre si;</li>
        <li>Pedir a correção de dados incorretos;</li>
        <li>Pedir a eliminação da sua conta e dados associados;</li>
        <li>Retirar o consentimento para a newsletter (link de anulação de subscrição em cada e-mail);</li>
      </ul>
      <p>
        Para exercer qualquer um destes direitos, contacte-nos em{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="underline underline-offset-2 hover:text-fog-50"
        >
          {siteConfig.email}
        </a>
        .
      </p>

      <h2>7. Alterações a esta política</h2>
      <p>
        Podemos atualizar esta política periodicamente. A versão em vigor é sempre a publicada
        nesta página, com a data de atualização indicada no topo.
      </p>

      <h2>8. Contacto</h2>
      <p>
        {siteConfig.legalName}, {siteConfig.address.locality}, Angola —{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="underline underline-offset-2 hover:text-fog-50"
        >
          {siteConfig.email}
        </a>
      </p>
    </LegalPage>
  );
}
