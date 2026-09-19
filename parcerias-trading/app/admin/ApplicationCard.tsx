"use client";

import { useState, type CSSProperties } from "react";
import type { Application, ApplicationStatus } from "@/lib/applications";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pendente",
  reviewing: "Em análise",
  accepted: "Aceite",
  rejected: "Rejeitada",
};

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: "#f59e0b",
  reviewing: "#4d8dff",
  accepted: "#22c55e",
  rejected: "#fb7185",
};

export function ApplicationCard({ application }: { application: Application }) {
  const [status, setStatus] = useState<ApplicationStatus>(application.status);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(next: ApplicationStatus) {
    if (next === status || updating) return;
    const previous = status;
    setStatus(next);
    setUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/applications/${application.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setStatus(previous);
      setError("Falha ao atualizar. Tente novamente.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <section className="admin-card">
      <header className="admin-card-header">
        <div>
          <h3>
            {application.fullName}
            {application.companyName ? ` · ${application.companyName}` : ""}
          </h3>
          <p className="admin-meta">
            {application.email} · {application.phone} ·{" "}
            {new Date(application.createdAt).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className="status-badge"
          style={{ "--status-color": STATUS_COLORS[status] } as CSSProperties}
        >
          {STATUS_LABELS[status]}
        </span>
      </header>

      <dl className="admin-fields">
        <div>
          <dt>Tipo</dt>
          <dd>
            {application.candidateType === "empresa" ? "Empresa" : "Pessoa individual"}
            {application.companyTaxId ? ` · NIF ${application.companyTaxId}` : ""}
          </dd>
        </div>
        <div>
          <dt>Perfil</dt>
          <dd>
            {application.profileType === "outro"
              ? application.profileTypeOther
              : application.profileType}
          </dd>
        </div>
        <div>
          <dt>Experiência com trading / Deriv</dt>
          <dd>{application.tradingExperience}</dd>
        </div>
        <div>
          <dt>Compromisso como representante público</dt>
          <dd>{application.representativePitch}</dd>
        </div>
        <div>
          <dt>Canais / audiência</dt>
          <dd>{application.audienceChannels}</dd>
        </div>
        <div>
          <dt>Prova de audiência</dt>
          <dd>
            <a href={application.audienceProofUrl} target="_blank" rel="noopener noreferrer">
              {application.audienceProofUrl}
            </a>
          </dd>
        </div>
        {application.audienceTrackRecord && (
          <div>
            <dt>Histórico de sucesso</dt>
            <dd>{application.audienceTrackRecord}</dd>
          </div>
        )}
        <div>
          <dt>Divisão de lucros proposta</dt>
          <dd>{application.proposedSplit}</dd>
        </div>
        {application.additionalContribution && (
          <div>
            <dt>Contribuição adicional</dt>
            <dd>{application.additionalContribution}</dd>
          </div>
        )}
        {application.message && (
          <div>
            <dt>Mensagem</dt>
            <dd>{application.message}</dd>
          </div>
        )}
      </dl>

      <div className="status-actions">
        {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            className={`status-btn${status === s ? " active" : ""}`}
            disabled={updating}
            onClick={() => changeStatus(s)}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </section>
  );
}
