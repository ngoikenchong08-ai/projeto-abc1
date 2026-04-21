import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_user-access-161/artifacts/byey8gmu_imgi_2_logo.svg";

export default function LoadingPage() {
  const navigate = useNavigate();

  // Allow user to go back after 15s (simulation only)
  useEffect(() => {
    const t = setTimeout(() => {
      // keep loading visible; user can manually navigate back
    }, 15000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-[#1a1a1a] text-white flex flex-col items-center justify-center px-6"
      data-testid="loading-page"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
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

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-14 text-sm text-white/60 hover:text-white underline underline-offset-4"
        data-testid="back-to-login"
      >
        Voltar ao login
      </button>
    </div>
  );
}
