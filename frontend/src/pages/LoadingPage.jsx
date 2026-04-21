const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_user-access-161/artifacts/byey8gmu_imgi_2_logo.svg";

export default function LoadingPage() {
  return (
    <div
      className="min-h-screen w-full bg-[#232222] text-white flex flex-col items-center justify-center px-6 select-none pointer-events-none"
      data-testid="loading-page"
      style={{
        fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
        cursor: "not-allowed",
      }}
    >
      <img
        src={LOGO_URL}
        alt="Banco ABC Brasil"
        className="h-24 w-auto mb-10"
        data-testid="loading-logo"
      />

      {/* Animated spinner */}
      <div
        className="relative w-16 h-16"
        role="status"
        aria-live="polite"
        data-testid="loading-spinner"
      >
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#cba862] animate-spin" />
      </div>

      <p
        className="mt-8 text-lg font-light tracking-wide text-white/90"
        data-testid="loading-text"
      >
        Carregando...
      </p>
      <p className="mt-2 text-sm text-white/60">
        Estamos validando seu acesso com segurança
      </p>
    </div>
  );
}
