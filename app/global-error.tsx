"use client";

/**
 * Last resort: the root layout itself failed, so no chrome, fonts or providers
 * are available. Styles are inline because `globals.css` may be exactly what
 * did not load.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#E8E5DF",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.625rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#726E68",
              margin: 0,
            }}
          >
            CyberLex Global
          </p>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 400,
              letterSpacing: "-0.025em",
              margin: "1rem 0 0",
            }}
          >
            The application failed to start.
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: "#A6A29B",
              margin: "1rem 0 0",
            }}
          >
            This is a fault in the application itself, not in anything you did.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1rem",
              background: "#F2EFE9",
              color: "#000000",
              border: "none",
              borderRadius: 2,
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.625rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {error.digest && (
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: "0.6875rem",
                color: "#46433F",
                marginTop: "1.5rem",
              }}
            >
              Reference {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
