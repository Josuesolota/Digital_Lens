-- ---------------------------------------------------------------------------
-- Digital Lens — Candidaturas a parceria de plataforma de negociação
-- financeira (trading, integração Deriv).
--
-- Tabela isolada, na mesma base Neon do site principal. Idempotente.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

create table if not exists trading_partnership_applications (
  id                              uuid primary key default gen_random_uuid(),

  -- Quem candidata
  candidate_type                  text        not null, -- 'individual' | 'empresa'
  full_name                       text        not null,
  company_name                    text,
  company_tax_id                  text,
  email                           text        not null,
  phone                           text        not null,

  -- Perfil
  profile_type                    text        not null, -- 'trader' | 'influenciador' | 'fintech' | 'outro'
  profile_type_other               text,
  trading_experience              text        not null,

  -- Requisito 1: capacidade de representação pública / co-fundador
  public_representative_commitment boolean    not null,
  representative_pitch            text        not null,

  -- Requisito 2: capacidade de atração de audiência
  audience_channels               text        not null,
  audience_proof_url              text        not null,
  audience_track_record           text,

  -- Proposta de parceria
  proposed_split                  text        not null,
  additional_contribution         text,
  availability_commitment         boolean     not null,
  message                         text,

  -- Declaração final
  truthful_declaration            boolean     not null,

  status                          text        not null default 'pending', -- pending | reviewing | accepted | rejected
  created_at                      timestamptz not null default now()
);

create index if not exists trading_partnership_applications_created_at_idx
  on trading_partnership_applications (created_at desc);
