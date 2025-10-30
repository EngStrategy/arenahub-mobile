export const validarCNPJ = (cnpj: string): string => {
  const cnpjTrimmed = cnpj.replace(/[^\d]+/g, '');
  if (cnpjTrimmed.length !== 14) {
    return 'CNPJ inválido.';
  }
  // rejeita sequências repetidas (ex: '00000000000000', '11111111111111', ...)
  if (/^(\d)\1{13}$/.test(cnpjTrimmed)) {
    return 'CNPJ inválido.';
  }

  const toDigits = (s: string) => s.split('').map(d => parseInt(d, 10));
  const digits = toDigits(cnpjTrimmed);

  const calcVerifier = (nums: number[], weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += nums[i] * weights[i];
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
};

const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

const v1 = calcVerifier(digits, weights1);
if (v1 !== digits[12]) {
    return 'CNPJ inválido.';
}

const v2 = calcVerifier(digits, weights2);
if (v2 !== digits[13]) {
    return 'CNPJ inválido.';
}
  return '';
};
