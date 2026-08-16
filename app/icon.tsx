import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * App icon: a bone serif "C" on true black — the wordmark reduced to one
 * letterform. No gradient, no rounded badge; the identity is the type.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#F2EFE9",
          fontSize: 26,
          fontFamily: "Georgia, 'Times New Roman', serif",
          letterSpacing: "-0.04em",
        }}
      >
        C
      </div>
    ),
    size,
  );
}
