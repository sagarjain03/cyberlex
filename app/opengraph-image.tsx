import { ImageResponse } from "next/og";

import { getDirectoryStats } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CyberLex Global — Global Cyber Law Intelligence";

/**
 * Social card. Carries the product's actual thesis and live counts rather than
 * a logo on a gradient — and states the verification status, because a shared
 * card is exactly where an unverified dataset could be mistaken for settled.
 */
export default async function OpengraphImage() {
  const stats = await getDirectoryStats();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#E8E5DF",
          padding: "72px 80px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span
            style={{
              fontSize: 34,
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#F2EFE9",
              letterSpacing: "-0.02em",
            }}
          >
            CyberLex
          </span>
          <span
            style={{
              fontSize: 15,
              letterSpacing: "0.18em",
              color: "#726E68",
            }}
          >
            GLOBAL
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 96,
              lineHeight: 1,
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#F2EFE9",
              letterSpacing: "-0.035em",
            }}
          >
            Passed is not in force.
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 26,
              lineHeight: 1.45,
              color: "#A6A29B",
              maxWidth: 820,
            }}
          >
            {stats.jurisdictions} jurisdictions tracked from statute to
            commencement — including the laws that exist on paper and bind no
            one yet.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 56,
            borderTop: "1px solid #1E1E21",
            paddingTop: 26,
            fontSize: 17,
            color: "#726E68",
            letterSpacing: "0.1em",
          }}
        >
          <span>{stats.jurisdictions} JURISDICTIONS</span>
          <span>{stats.unnotified} UNNOTIFIED</span>
          <span>{stats.aiCrimeTechniques} AI TECHNIQUES</span>
          <span style={{ color: "#E3B23C" }}>
            {stats.needsReview} PENDING VERIFICATION
          </span>
        </div>
      </div>
    ),
    size,
  );
}
