import type { Dictionary } from "@/lib/i18n";
import { profile } from "@/data/profile";

export async function SiteFooter({ dict }: { dict: Dictionary }) {
  "use cache";

  return (
    <footer className="relative z-10 border-t border-white/8 px-5 py-8 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start">
        <p className="font-display text-sm font-semibold text-ink">
          {profile.name}
          <span className="ms-2 text-xs font-normal text-dim">
            {dict.footer.tagline}
          </span>
        </p>
        <p className="text-xs text-dim">
          © {new Date().getFullYear()} {profile.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
