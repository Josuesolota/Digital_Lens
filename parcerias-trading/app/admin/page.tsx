import type { Metadata } from "next";
import {
  listApplications,
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/applications";
import { ApplicationCard } from "./ApplicationCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Candidaturas de Parceria | Digital Lens",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: "Pendente",
  reviewing: "Em análise",
  accepted: "Aceite",
  rejected: "Rejeitada",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filter } = await searchParams;
  const applications = await listApplications();

  const isValidFilter = (value: string | undefined): value is ApplicationStatus =>
    Boolean(value) && (APPLICATION_STATUSES as readonly string[]).includes(value!);

  const filtered = isValidFilter(filter)
    ? applications.filter((application) => application.status === filter)
    : applications;

  return (
    <main className="page admin-page">
      <p className="eyebrow">Digital Lens · Admin</p>
      <h1>Candidaturas de parceria</h1>
      <p className="lede">
        {applications.length} candidatura{applications.length === 1 ? "" : "s"} no total.
      </p>

      <nav className="admin-tabs">
        <a href="/admin" className={!filter ? "active" : ""}>
          Todas ({applications.length})
        </a>
        {APPLICATION_STATUSES.map((status) => (
          <a
            key={status}
            href={`/admin?status=${status}`}
            className={filter === status ? "active" : ""}
          >
            {STATUS_LABELS[status]} (
            {applications.filter((application) => application.status === status).length})
          </a>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <p className="lede">Sem candidaturas nesta categoria.</p>
      ) : (
        <div className="admin-list">
          {filtered.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </main>
  );
}
