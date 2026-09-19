import { z } from "zod";

export const applicationSchema = z
  .object({
    candidateType: z.enum(["individual", "empresa"]),
    fullName: z.string().trim().min(3, "Indique o nome completo.").max(200),
    companyName: z.string().trim().max(200).optional().or(z.literal("")),
    companyTaxId: z.string().trim().max(60).optional().or(z.literal("")),
    email: z.string().trim().email("E-mail inválido."),
    phone: z.string().trim().min(6, "Indique um contacto válido.").max(40),

    profileType: z.enum(["trader", "influenciador", "fintech", "outro"]),
    profileTypeOther: z.string().trim().max(120).optional().or(z.literal("")),
    tradingExperience: z
      .string()
      .trim()
      .min(20, "Descreva a sua experiência com trading/Deriv com mais detalhe."),

    publicRepresentativeCommitment: z
      .boolean()
      .refine((v) => v === true, "É obrigatório comprometer-se a ser representante/co-fundador público."),
    representativePitch: z
      .string()
      .trim()
      .min(30, "Explique como pretende representar a marca (mín. 30 caracteres)."),

    audienceChannels: z
      .string()
      .trim()
      .min(20, "Descreva os seus canais e audiência com mais detalhe."),
    audienceProofUrl: z
      .string()
      .trim()
      .url("Indique um URL válido para um perfil/canal público."),
    audienceTrackRecord: z.string().trim().max(2000).optional().or(z.literal("")),

    proposedSplit: z.string().trim().min(2, "Indique a divisão de lucros proposta."),
    additionalContribution: z.string().trim().max(2000).optional().or(z.literal("")),
    availabilityCommitment: z
      .boolean()
      .refine(
        (v) => v === true,
        "É obrigatório confirmar disponibilidade para reuniões e responsabilidade contínua."
      ),
    message: z.string().trim().max(4000).optional().or(z.literal("")),

    truthfulDeclaration: z
      .boolean()
      .refine((v) => v === true, "É obrigatório confirmar a veracidade da informação."),
  })
  .refine(
    (data) => data.candidateType !== "empresa" || data.companyName,
    { message: "Indique o nome da empresa.", path: ["companyName"] }
  )
  .refine(
    (data) => data.profileType !== "outro" || data.profileTypeOther,
    { message: "Especifique o tipo de perfil.", path: ["profileTypeOther"] }
  );

export type ApplicationInput = z.infer<typeof applicationSchema>;
