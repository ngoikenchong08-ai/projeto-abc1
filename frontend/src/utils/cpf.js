// CPF validation & masking utilities

export const onlyDigits = (value) => (value || "").replace(/\D/g, "");

export const maskCPF = (value) => {
  const digits = onlyDigits(value).slice(0, 11);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 9);
  const p4 = digits.slice(9, 11);

  let out = p1;
  if (digits.length > 3) out += "." + p2;
  if (digits.length > 6) out += "." + p3;
  if (digits.length > 9) out += "-" + p4;
  return out;
};

export const isValidCPF = (value) => {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  // Reject sequences like 00000000000, 11111111111, ...
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (baseLen) => {
    let sum = 0;
    for (let i = 0; i < baseLen; i++) {
      sum += parseInt(cpf[i], 10) * (baseLen + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(9);
  const d2 = calcDigit(10);

  return d1 === parseInt(cpf[9], 10) && d2 === parseInt(cpf[10], 10);
};
