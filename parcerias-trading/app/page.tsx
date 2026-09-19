"use client";

import { useState, type FormEvent } from "react";

type CandidateType = "individual" | "empresa";
type ProfileType = "trader" | "influenciador" | "fintech" | "outro";

export default function ApplyPage() {
  const [candidateType, setCandidateType] = useState<CandidateType>("individual");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyTaxId, setCompanyTaxId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [profileType, setProfileType] = useState<ProfileType>("trader");
  const [profileTypeOther, setProfileTypeOther] = useState("");
  const [tradingExperience, setTradingExperience] = useState("");

  const [publicRepresentativeCommitment, setPublicRepresentativeCommitment] = useState(false);
  const [representativePitch, setRepresentativePitch] = useState("");

  const [audienceChannels, setAudienceChannels] = useState("");
  const [audienceProofUrl, setAudienceProofUrl] = useState("");
  const [audienceTrackRecord, setAudienceTrackRecord] = useState("");

  const [proposedSplit, setProposedSplit] = useState("");
  const [additionalContribution, setAdditionalContribution] = useState("");
  const [availabilityCommitment, setAvailabilityCommitment] = useState(false);
  const [message, setMessage] = useState("");
  const [truthfulDeclaration, setTruthfulDeclaration] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateType,
          fullName,
          companyName,
          companyTaxId,
          email,
          phone,
          profileType,
          profileTypeOther,
          tradingExperience,
          publicRepresentativeCommitment,
          representativePitch,
          audienceChannels,
          audienceProofUrl,
          audienceTrackRecord,
          proposedSplit,
          additionalContribution,
          availabilityCommitment,
          message,
          truthfulDeclaration,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar a candidatura.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Falha de rede. Tente novamente.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="page success">
        <h1>Candidatura recebida.</h1>
        <p className="lede" style={{ margin: "0 auto" }}>
          Obrigado. Vamos analisar o seu perfil e entramos em contacto em breve pelo e-mail
          ou telefone indicados, caso o perfil encaixe na parceria.
        </p>
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Digital Lens · Parcerias</p>
      <h1>Parceria — Plataforma de Negociação Financeira</h1>
      <p className="lede">
        A Digital Lens desenvolve e opera a plataforma (integração com a API da Deriv); o
        parceiro é o representante público / co-fundador da marca e traz a audiência. Os
        lucros das comissões de markup são divididos por percentagem entre as duas partes.
        Este formulário é uma pré-candidatura — não implica compromisso de nenhuma das
        partes até assinatura de acordo.
      </p>

      <form onSubmit={handleSubmit}>
        <section className="card">
          <h2>Quem se candidata</h2>

          <div className="field">
            <label>Tipo de candidato</label>
            <div className="radio-group">
              <label className="radio-pill">
                <input
                  type="radio"
                  name="candidateType"
                  checked={candidateType === "individual"}
                  onChange={() => setCandidateType("individual")}
                />
                Pessoa individual
              </label>
              <label className="radio-pill">
                <input
                  type="radio"
                  name="candidateType"
                  checked={candidateType === "empresa"}
                  onChange={() => setCandidateType("empresa")}
                />
                Empresa
              </label>
            </div>
          </div>

          <div className="field">
            <label htmlFor="fullName">Nome completo</label>
            <input
              id="fullName"
              type="text"
              required
              minLength={3}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {candidateType === "empresa" && (
            <>
              <div className="field">
                <label htmlFor="companyName">Nome da empresa</label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="companyTaxId">NIF da empresa</label>
                <input
                  id="companyTaxId"
                  type="text"
                  value={companyTaxId}
                  onChange={(e) => setCompanyTaxId(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Telefone / WhatsApp</label>
            <input
              id="phone"
              type="tel"
              required
              minLength={6}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </section>

        <section className="card">
          <h2>Perfil e experiência</h2>

          <div className="field">
            <label>Tipo de perfil</label>
            <div className="radio-group">
              {(
                [
                  ["trader", "Trader profissional"],
                  ["influenciador", "Influenciador digital"],
                  ["fintech", "Empresa Fintech / digital"],
                  ["outro", "Outro"],
                ] as [ProfileType, string][]
              ).map(([value, label]) => (
                <label className="radio-pill" key={value}>
                  <input
                    type="radio"
                    name="profileType"
                    checked={profileType === value}
                    onChange={() => setProfileType(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
            {profileType === "outro" && (
              <input
                type="text"
                required
                placeholder="Especifique"
                value={profileTypeOther}
                onChange={(e) => setProfileTypeOther(e.target.value)}
                style={{ marginTop: 10 }}
              />
            )}
          </div>

          <div className="field">
            <label htmlFor="tradingExperience">Experiência com trading / Deriv</label>
            <textarea
              id="tradingExperience"
              required
              minLength={20}
              placeholder="Há quanto tempo negoceia, mercados/instrumentos (forex, opções, índices sintéticos), se já usa a Deriv, resultados relevantes..."
              value={tradingExperience}
              onChange={(e) => setTradingExperience(e.target.value)}
            />
          </div>
        </section>

        <section className="card">
          <h2>Requisito — Representante público / co-fundador</h2>
          <p className="hint" style={{ marginBottom: 16 }}>
            A plataforma precisa de um rosto público que assuma responsabilidade contínua
            perante os utilizadores — não apenas um investidor silencioso.
          </p>

          <div className="field">
            <label htmlFor="representativePitch">
              Como pretende representar a marca publicamente?
            </label>
            <textarea
              id="representativePitch"
              required
              minLength={30}
              placeholder="Descreva o seu papel público pretendido: aparições, comunicação com utilizadores, presença nas redes, responsabilidade perante a comunidade..."
              value={representativePitch}
              onChange={(e) => setRepresentativePitch(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="checkbox-row">
              <input
                type="checkbox"
                required
                checked={publicRepresentativeCommitment}
                onChange={(e) => setPublicRepresentativeCommitment(e.target.checked)}
              />
              <span>
                Comprometo-me a assumir o papel de representante público / co-fundador
                desta plataforma, com responsabilidade contínua perante os utilizadores.
              </span>
            </label>
          </div>
        </section>

        <section className="card">
          <h2>Requisito — Capacidade de atrair utilizadores</h2>

          <div className="field">
            <label htmlFor="audienceChannels">Canais e audiência</label>
            <textarea
              id="audienceChannels"
              required
              minLength={20}
              placeholder="Ex.: Instagram 42k seguidores, canal de Telegram 3k membros, YouTube 15k subscritores, comunidade própria de X pessoas..."
              value={audienceChannels}
              onChange={(e) => setAudienceChannels(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="audienceProofUrl">Link para um perfil/canal público</label>
            <input
              id="audienceProofUrl"
              type="url"
              required
              placeholder="https://..."
              value={audienceProofUrl}
              onChange={(e) => setAudienceProofUrl(e.target.value)}
            />
            <span className="hint">Obrigatório — usado para verificar a audiência real.</span>
          </div>

          <div className="field">
            <label htmlFor="audienceTrackRecord">
              Histórico de sucesso a atrair utilizadores/clientes (opcional)
            </label>
            <textarea
              id="audienceTrackRecord"
              placeholder="Campanhas, lançamentos ou parcerias anteriores onde trouxe utilizadores/clientes de forma comprovada."
              value={audienceTrackRecord}
              onChange={(e) => setAudienceTrackRecord(e.target.value)}
            />
          </div>
        </section>

        <section className="card">
          <h2>Proposta de parceria</h2>

          <div className="field">
            <label htmlFor="proposedSplit">Divisão de lucros proposta</label>
            <input
              id="proposedSplit"
              type="text"
              required
              placeholder="Ex.: 50/50, 60/40 a favor do parceiro..."
              value={proposedSplit}
              onChange={(e) => setProposedSplit(e.target.value)}
            />
            <span className="hint">
              Lucros calculados sobre as comissões de markup da API da Deriv. Valor
              negociável — esta é apenas a sua proposta inicial.
            </span>
          </div>

          <div className="field">
            <label htmlFor="additionalContribution">
              Contribuição adicional além da audiência (opcional)
            </label>
            <textarea
              id="additionalContribution"
              placeholder="Capital, orçamento de marketing, equipa própria, licenças, etc."
              value={additionalContribution}
              onChange={(e) => setAdditionalContribution(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="checkbox-row">
              <input
                type="checkbox"
                required
                checked={availabilityCommitment}
                onChange={(e) => setAvailabilityCommitment(e.target.checked)}
              />
              <span>
                Confirmo disponibilidade para reuniões de alinhamento, aprovação de marca
                e responsabilidade contínua enquanto a parceria estiver ativa.
              </span>
            </label>
          </div>

          <div className="field">
            <label htmlFor="message">Mensagem adicional (opcional)</label>
            <textarea
              id="message"
              placeholder="Qualquer contexto adicional que queira partilhar."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </section>

        <section className="card">
          <label className="checkbox-row">
            <input
              type="checkbox"
              required
              checked={truthfulDeclaration}
              onChange={(e) => setTruthfulDeclaration(e.target.checked)}
            />
            <span>
              Declaro que todas as informações fornecidas são verídicas e autorizo a
              Digital Lens a contactar-me sobre esta candidatura.
            </span>
          </label>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "A enviar…" : "Enviar candidatura"}
          </button>
        </section>
      </form>

      <p className="footer-note">Digital Lens — parcerias@digitallens.ao</p>
    </main>
  );
}
