import { ImageResponse } from "next/og";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { profile } from "@/data/profile";

export const alt = "Yahya Tamda — Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const STARS: Array<{ x: number; y: number; s: number; o: number }> = [
  { x: 90, y: 60, s: 2, o: 0.7 }, { x: 240, y: 140, s: 1.5, o: 0.4 },
  { x: 390, y: 50, s: 2, o: 0.55 }, { x: 520, y: 180, s: 1.5, o: 0.3 },
  { x: 660, y: 80, s: 2.5, o: 0.6 }, { x: 800, y: 150, s: 1.5, o: 0.35 },
  { x: 930, y: 60, s: 2, o: 0.5 }, { x: 1080, y: 120, s: 1.5, o: 0.4 },
  { x: 150, y: 300, s: 1.5, o: 0.3 }, { x: 340, y: 420, s: 2, o: 0.45 },
  { x: 500, y: 520, s: 1.5, o: 0.3 }, { x: 720, y: 470, s: 2, o: 0.4 },
  { x: 880, y: 560, s: 1.5, o: 0.35 }, { x: 1030, y: 480, s: 2, o: 0.5 },
  { x: 1120, y: 300, s: 1.5, o: 0.3 }, { x: 60, y: 520, s: 2, o: 0.4 },
  { x: 460, y: 260, s: 1.5, o: 0.25 }, { x: 980, y: 380, s: 2, o: 0.35 },
];

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  // satori's default font can't shape Arabic — reuse the English copy
  const dict = await getDictionary(locale === "ar" ? "en" : locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse 90% 80% at 78% 30%, #16222f 0%, #0a0f14 55%, #07090c 100%)",
          color: "#e8ecef",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {STARS.map((st, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: st.x,
              top: st.y,
              width: st.s,
              height: st.s,
              borderRadius: 99,
              background: "#fff",
              opacity: st.o,
            }}
          />
        ))}

        {/* the sun — a golden glow top-right */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 90,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 42% 40%, #fff8e2 0%, #ffd98a 34%, #f0a94e 62%, #b96b1e 100%)",
            boxShadow:
              "0 0 60px 18px rgba(255,193,110,.5), 0 0 160px 70px rgba(255,150,60,.22)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 800,
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              color: "#d8b36c",
              textTransform: "uppercase",
            }}
          >
            {dict.hero.availability}
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -2,
            }}
          >
            {profile.name}
          </div>
          <div style={{ fontSize: 34, color: "#9fb0ba", marginTop: 6 }}>
            {dict.hero.role}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 44,
              fontSize: 24,
              color: "#7e939f",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                background: "#d8b36c",
                boxShadow: "0 0 12px #d8b36c",
              }}
            />
            {profile.siteUrl.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
