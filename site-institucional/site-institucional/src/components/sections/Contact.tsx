import { Clock, Mail, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function Contact({ defaultSubject }: { defaultSubject?: string }) {
  const locale = await getLocale();
  const t = getDictionary(locale);

  const HIGHLIGHTS = [
    { icon: Clock, text: t.contactSection.highlightResponse },
    { icon: MessageSquare, text: t.contactSection.highlightDiagnosis },
    { icon: Mail, text: siteConfig.email },
  ];

  return (
    <section id="contacto" className="relative py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)]"
      />

      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow={t.contactSection.eyebrow}
            title={
              <>
                {t.contactSection.titleStart}{" "}
                <span className="text-gradient">{t.contactSection.titleHighlight}</span>
              </>
            }
            description={t.contactSection.description}
          />

          <ul className="flex flex-col gap-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-fog-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline-1 bg-surface-1">
                  <item.icon size={14} className="text-lens-violet-400" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <ContactForm defaultSubject={defaultSubject} />
      </Container>
    </section>
  );
}
