import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import type { Dictionary, Locale } from "@/lib/i18n";
import { profile } from "@/data/profile";
import { Reveal } from "@/components/Reveal";
import { GravityText } from "@/components/GravityText";
import { SceneSection } from "./SectionShell";
import { ContactForm } from "./ContactForm";

export function ContactSection({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const channels = [
    {
      icon: Mail,
      label: dict.contact.emailLabel,
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: dict.contact.phoneLabel,
      value: profile.phoneDisplay,
      href: profile.whatsapp,
    },
    {
      icon: MapPin,
      label: dict.contact.locationLabel,
      value: profile.location[locale],
      href: undefined,
    },
  ];

  const socials = [
    { icon: GithubIcon, href: profile.github, label: "GitHub" },
    { icon: LinkedinIcon, href: profile.linkedin, label: "LinkedIn" },
    { icon: MessageCircle, href: profile.whatsapp, label: "WhatsApp" },
  ];

  return (
    <SceneSection id="contact" vh={230} innerClassName="justify-center">
      <div className="grid w-full items-center gap-8 pb-16 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <p className="kicker text-halo">{dict.contact.label}</p>
          <h2 className="font-display text-halo mt-3 text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
            <GravityText text={dict.contact.heading} focal={{ x: 0.62, y: 0.42 }} />
          </h2>
          <p className="text-halo mt-4 max-w-md text-[15px] leading-relaxed text-ink/85">
            {dict.contact.intro}
          </p>
          <p className="mt-2 text-sm font-medium text-mint">
            {dict.contact.availability}
          </p>

          <div className="mt-7 space-y-3">
            {channels.map((c) => {
              const Icon = c.icon;
              const inner = (
                <>
                  <Icon className="size-4 shrink-0 text-mineral" aria-hidden />
                  <span className="text-xs uppercase tracking-[0.18em] text-dim">
                    {c.label}
                  </span>
                  <span className="text-sm font-medium text-ink">{c.value}</span>
                </>
              );
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="panel flex items-center gap-3 px-4 py-3 transition-colors hover:border-teal/40"
                >
                  {inner}
                </a>
              ) : (
                <div
                  key={c.label}
                  className="panel flex items-center gap-3 px-4 py-3"
                >
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="chip flex size-10 items-center justify-center !p-0 transition-colors hover:border-teal/60 hover:text-ink"
              >
                <s.icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm dict={dict} />
        </Reveal>
      </div>
    </SceneSection>
  );
}
