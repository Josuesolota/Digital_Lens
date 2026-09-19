import { sql, isDatabaseConfigured } from "./db";

export const APPLICATION_STATUSES = [
  "pending",
  "reviewing",
  "accepted",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type Application = {
  id: string;
  candidateType: string;
  fullName: string;
  companyName: string | null;
  companyTaxId: string | null;
  email: string;
  phone: string;
  profileType: string;
  profileTypeOther: string | null;
  tradingExperience: string;
  representativePitch: string;
  audienceChannels: string;
  audienceProofUrl: string;
  audienceTrackRecord: string | null;
  proposedSplit: string;
  additionalContribution: string | null;
  message: string | null;
  status: ApplicationStatus;
  createdAt: string;
};

type ApplicationRow = {
  id: string;
  candidate_type: string;
  full_name: string;
  company_name: string | null;
  company_tax_id: string | null;
  email: string;
  phone: string;
  profile_type: string;
  profile_type_other: string | null;
  trading_experience: string;
  representative_pitch: string;
  audience_channels: string;
  audience_proof_url: string;
  audience_track_record: string | null;
  proposed_split: string;
  additional_contribution: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

function toApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    candidateType: row.candidate_type,
    fullName: row.full_name,
    companyName: row.company_name,
    companyTaxId: row.company_tax_id,
    email: row.email,
    phone: row.phone,
    profileType: row.profile_type,
    profileTypeOther: row.profile_type_other,
    tradingExperience: row.trading_experience,
    representativePitch: row.representative_pitch,
    audienceChannels: row.audience_channels,
    audienceProofUrl: row.audience_proof_url,
    audienceTrackRecord: row.audience_track_record,
    proposedSplit: row.proposed_split,
    additionalContribution: row.additional_contribution,
    message: row.message,
    status: row.status as ApplicationStatus,
    createdAt: row.created_at,
  };
}

export async function listApplications(): Promise<Application[]> {
  if (!isDatabaseConfigured()) return [];
  const db = sql();
  const rows = (await db`
    select
      id, candidate_type, full_name, company_name, company_tax_id, email, phone,
      profile_type, profile_type_other, trading_experience, representative_pitch,
      audience_channels, audience_proof_url, audience_track_record,
      proposed_split, additional_contribution, message, status, created_at
    from trading_partnership_applications
    order by created_at desc
  `) as unknown as ApplicationRow[];
  return rows.map(toApplication);
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<void> {
  const db = sql();
  await db`
    update trading_partnership_applications
    set status = ${status}
    where id = ${id}
  `;
}
