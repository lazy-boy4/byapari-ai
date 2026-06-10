export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.35] mix-blend-multiply"
      style={{
        backgroundImage:
          "radial-gradient(oklch(0 0 0 / 0.045) 1px, transparent 1px), radial-gradient(oklch(0 0 0 / 0.03) 1px, transparent 1px)",
        backgroundSize: "4px 4px, 9px 9px",
        backgroundPosition: "0 0, 2px 3px",
      }}
    />
  );
}
