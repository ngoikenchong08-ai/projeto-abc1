import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, User, KeyRound, Delete } from "lucide-react";
import { maskCPF, onlyDigits, isValidCPF } from "@/utils/cpf";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_user-access-161/artifacts/byey8gmu_imgi_2_logo.svg";
const MODEL_IMG =
  "https://customer-assets.emergentagent.com/job_user-access-161/artifacts/fhe5yh3c_imgi_1_background-login.jpg";

const PASSWORD_LENGTH = 8;

// Shuffle numbers 0..9 (bank-style random pad)
const shuffleDigits = () => {
  const arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [cpfTouched, setCpfTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadDigits, setKeypadDigits] = useState(() => shuffleDigits());

  const keypadRef = useRef(null);
  const passwordBtnRef = useRef(null);

  const cpfDigits = onlyDigits(cpf);
  const cpfValid = isValidCPF(cpf);
  const cpfError = cpfTouched && cpfDigits.length > 0 && !cpfValid;
  const canSubmit = cpfValid && password.length === PASSWORD_LENGTH;

  // Close keypad when clicking outside (but never on form elements inside this panel)
  useEffect(() => {
    if (!showKeypad) return;
    const handler = (e) => {
      const target = e.target;
      if (
        keypadRef.current &&
        !keypadRef.current.contains(target) &&
        passwordBtnRef.current &&
        !passwordBtnRef.current.contains(target)
      ) {
        // don't close when clicking on the Entrar button or CPF input (same form)
        if (target.closest && target.closest('[data-testid="login-form"]')) return;
        setShowKeypad(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showKeypad]);

  const handleCpfChange = (e) => {
    const masked = maskCPF(e.target.value);
    setCpf(masked);
  };

  const openKeypad = () => {
    if (!cpfValid) {
      setCpfTouched(true);
      return;
    }
    // Re-shuffle every time keypad opens (bank behavior)
    setKeypadDigits(shuffleDigits());
    setShowKeypad(true);
  };

  const pressDigit = (d) => {
    if (password.length >= PASSWORD_LENGTH) return;
    const next = password + d;
    setPassword(next);
  };

  const pressBackspace = () => {
    setPassword((p) => p.slice(0, -1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    navigate("/loading");
  };

  const maskedDots = useMemo(() => {
    return Array.from({ length: PASSWORD_LENGTH }, (_, i) => i < password.length);
  }, [password]);

  return (
    <div
      className="relative min-h-screen w-full bg-[#B5965F] overflow-hidden"
      data-testid="login-page"
      style={{ fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* LAYER 1: Model image (extends slightly past 50% so it sits behind the black panel's rounded corners) */}
      <div
        className="absolute inset-y-0 left-0 w-full md:w-[calc(50%+3rem)] bg-[#B5965F] bg-no-repeat bg-[position:center_left] bg-cover"
        style={{ backgroundImage: `url('${MODEL_IMG}')` }}
        aria-hidden="true"
        data-testid="login-hero-image"
      />

      {/* LAYER 2: Black panel (right half, rounded LEFT corners, flush right) */}
      <div
        className="hidden md:block absolute top-0 bottom-0 right-0 md:w-1/2 bg-[#232222] rounded-l-[2.5rem]"
        data-testid="login-brand-bg"
      />

      {/* LAYER 3: Brand content over the black panel (left portion of the dark area) */}
      <div
        className="hidden md:flex absolute top-0 bottom-0 left-1/2 md:w-[17%] text-white flex-col justify-between px-10 py-10 z-10"
        data-testid="login-brand-panel"
      >
        <div>
          <img
            src={LOGO_URL}
            alt="Banco ABC Brasil"
            className="h-16 w-auto"
            data-testid="abc-logo"
          />
          <h1
            className="mt-14 text-4xl lg:text-5xl leading-[1.05] font-light tracking-tight"
            data-testid="login-title"
          >
            Internet
            <br />
            Banking
          </h1>
        </div>
        <div className="text-sm leading-relaxed text-white/90">
          <p>
            O Banco não solicita informações e dados por telefone, evite golpes e fraudes.
          </p>
          <a
            href="#"
            className="inline-block mt-4 underline underline-offset-4 text-white hover:text-white/80"
            data-testid="saber-mais-link"
          >
            Saber mais
          </a>
        </div>
      </div>

      {/* LAYER 4: White form panel (right third, rounded LEFT corners, flush right) */}
      <div
        className="absolute top-0 bottom-0 right-0 w-full md:w-[26%] bg-white md:rounded-l-[2.5rem] flex flex-col px-8 md:px-10 py-8 z-20 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.25)]"
        data-testid="login-form-panel"
      >
        {/* Ajuda button - top right */}
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#0072b1] hover:bg-[#005f95] text-white text-sm font-medium px-4 py-2 transition-colors"
            data-testid="ajuda-button"
          >
            <HelpCircle className="w-4 h-4" strokeWidth={2} />
            Ajuda
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 flex-1 flex flex-col"
          data-testid="login-form"
        >
          {/* CPF field */}
          <label
            htmlFor="cpf"
            className="text-[15px] font-medium text-[#1a1a1a] mb-2"
          >
            CPF
          </label>
          <div
            className={`flex items-center gap-3 border rounded-lg px-4 h-14 transition-colors ${
              cpfError
                ? "border-red-500"
                : "border-[#0072b1] focus-within:border-[#005f95]"
            }`}
          >
            <User
              className={`w-5 h-5 ${cpfError ? "text-red-500" : "text-[#0072b1]"}`}
              strokeWidth={1.75}
            />
            <input
              id="cpf"
              name="cpf"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={handleCpfChange}
              onBlur={() => setCpfTouched(true)}
              className="flex-1 h-full outline-none bg-transparent text-[15px] text-[#1a1a1a] placeholder:text-[#9aa0a6]"
              data-testid="cpf-input"
            />
          </div>
          {cpfError && (
            <p
              className="mt-2 text-xs text-red-600"
              data-testid="cpf-error-message"
            >
              CPF inválido. Verifique os números digitados.
            </p>
          )}

          {/* Senha field */}
          <label
            htmlFor="senha-btn"
            className="mt-7 text-[15px] font-medium text-[#1a1a1a] mb-2"
          >
            Senha
          </label>
          <button
            id="senha-btn"
            ref={passwordBtnRef}
            type="button"
            onClick={openKeypad}
            className={`flex items-center gap-3 border rounded-lg px-4 h-14 text-left transition-colors ${
              showKeypad
                ? "border-[#005f95]"
                : "border-[#0072b1] hover:border-[#005f95]"
            } ${!cpfValid ? "opacity-95" : ""}`}
            data-testid="password-field"
          >
            <KeyRound
              className="w-5 h-5 text-[#0072b1]"
              strokeWidth={1.75}
            />
            {password.length === 0 ? (
              <span className="text-[15px] text-[#9aa0a6]">
                Insira sua senha de acesso
              </span>
            ) : (
              <span
                className="flex items-center gap-2"
                data-testid="password-dots"
              >
                {maskedDots.map((filled, i) => (
                  <span
                    key={i}
                    className={`block w-2.5 h-2.5 rounded-full ${
                      filled ? "bg-[#1a1a1a]" : "bg-[#d1d5db]"
                    }`}
                  />
                ))}
              </span>
            )}
          </button>

          {/* Virtual keypad */}
          {showKeypad && (
            <div
              ref={keypadRef}
              className="mt-4 rounded-xl border border-gray-200 shadow-lg bg-white p-4"
              data-testid="numeric-keypad"
            >
              <p className="text-xs text-gray-500 mb-3">
                Use o teclado virtual para digitar sua senha ({PASSWORD_LENGTH} dígitos)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {keypadDigits.slice(0, 9).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => pressDigit(d)}
                    className="h-12 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-lg font-semibold text-[#1a1a1a] transition-colors"
                    data-testid={`keypad-digit-${d}`}
                  >
                    {d}
                  </button>
                ))}
                <div />
                <button
                  type="button"
                  onClick={() => pressDigit(keypadDigits[9])}
                  className="h-12 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-lg font-semibold text-[#1a1a1a] transition-colors"
                  data-testid={`keypad-digit-${keypadDigits[9]}`}
                >
                  {keypadDigits[9]}
                </button>
                <button
                  type="button"
                  onClick={pressBackspace}
                  className="h-12 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center text-[#1a1a1a] transition-colors"
                  data-testid="keypad-backspace"
                  aria-label="Apagar"
                >
                  <Delete className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`mt-8 h-14 rounded-lg text-base font-semibold transition-all ${
              canSubmit
                ? "bg-[#0072b1] hover:bg-[#005f95] text-white cursor-pointer shadow-sm"
                : "bg-[#d8dadd] text-[#8a8f97] cursor-not-allowed"
            }`}
            data-testid="entrar-button"
          >
            Entrar
          </button>

          {/* Esqueci minha senha */}
          <a
            href="#"
            className="mt-6 text-center text-[15px] font-semibold text-[#0072b1] hover:text-[#005f95] underline underline-offset-4"
            data-testid="esqueci-senha-link"
          >
            Esqueci minha senha
          </a>

          <div className="mt-auto pt-8">
            <hr className="border-t border-gray-200 mb-5" />
            <p className="text-sm text-[#4b5563]">
              Já abriu sua conta e quer solicitar o acesso?{" "}
              <a
                href="#"
                className="font-semibold text-[#0072b1] hover:text-[#005f95] underline underline-offset-4"
                data-testid="clique-aqui-link"
              >
                Clique aqui
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
