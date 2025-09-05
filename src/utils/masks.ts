// Utilitários para aplicação de máscaras em campos de input

export type MaskType = 
  | 'phone' 
  | 'cellphone' 
  | 'cpf' 
  | 'cnpj' 
  | 'cep' 
  | 'rg' 
  | 'currency' 
  | 'percentage' 
  | 'date' 
  | 'time' 
  | 'datetime' 
  | 'credit-card' 
  | 'pis' 
  | 'renavam' 
  | 'chassi' 
  | 'placa-veiculo' 
  | 'titulo-eleitor' 
  | 'numero-processo'
  | 'login'
  | 'uppercase';

/**
 * Remove todos os caracteres não numéricos de uma string
 */
export const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Remove todos os caracteres não alfanuméricos de uma string
 */
export const removeNonAlphaNumeric = (value: string): string => {
  return value.replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Aplica máscara de telefone fixo (XX) XXXX-XXXX
 */
export const applyPhoneMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Aplica máscara de celular (XX) 9XXXX-XXXX
 */
export const applyCellphoneMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Aplica máscara de CPF XXX.XXX.XXX-XX
 */
export const applyCpfMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 3) {
    return numbers;
  }
  
  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  }
  
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  }
  
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

/**
 * Aplica máscara de CNPJ XX.XXX.XXX/XXXX-XX
 */
export const applyCnpjMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  }
  
  if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  }
  
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
};

/**
 * Aplica máscara de CEP XXXXX-XXX
 */
export const applyCepMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 5) {
    return numbers;
  }
  
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

/**
 * Aplica máscara de RG XX.XXX.XXX-X
 */
export const applyRgMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  }

  if (numbers.length <= 9) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}-${numbers.slice(8, 9)}`;
  }
  
  return value;
};

/**
 * Aplica máscara de moeda R$ X.XXX.XXX,XX
 */
export const applyCurrencyMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (!numbers) return '';
  
  const numberValue = parseInt(numbers) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(numberValue);
};

/**
 * Aplica máscara de porcentagem XX,XX%
 */
export const applyPercentageMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (!numbers) return '';
  
  if (numbers.length === 1) {
    return `${numbers}%`;
  }
  
  if (numbers.length === 2) {
    return `${numbers}%`;
  }
  
  const integerPart = numbers.slice(0, -2) || '0';
  const decimalPart = numbers.slice(-2);
  
  return `${integerPart},${decimalPart}%`;
};

/**
 * Aplica máscara de data DD/MM/AAAA
 */
export const applyDateMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }
  
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

/**
 * Aplica máscara de hora HH:MM
 */
export const applyTimeMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
};

/**
 * Aplica máscara de data e hora DD/MM/AAAA HH:MM
 */
export const applyDateTimeMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
  }
  
  if (numbers.length <= 10) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)} ${numbers.slice(8)}`;
  }
  
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)} ${numbers.slice(8, 10)}:${numbers.slice(10, 12)}`;
};

/**
 * Aplica máscara de cartão de crédito XXXX XXXX XXXX XXXX
 */
export const applyCreditCardMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

/**
 * Aplica máscara de PIS XXX.XXXXX.XX-X
 */
export const applyPisMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 3) {
    return numbers;
  }
  
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  }
  
  if (numbers.length <= 10) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 8)}.${numbers.slice(8)}`;
  }
  
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 8)}.${numbers.slice(8, 10)}-${numbers.slice(10, 11)}`;
};

/**
 * Aplica máscara de RENAVAM XXXXXXXXXX
 */
export const applyRenavamMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  return numbers.slice(0, 11);
};

/**
 * Aplica máscara de chassi XXXXXXXXXXXXXXXXX
 */
export const applyChassiMask = (value: string): string => {
  const alphaNumeric = removeNonAlphaNumeric(value.toUpperCase());
  return alphaNumeric.slice(0, 17);
};

/**
 * Aplica máscara de placa de veículo XXX-XXXX ou XXX1X23 (Mercosul)
 */
export const applyPlacaVeiculoMask = (value: string): string => {
  const alphaNumeric = removeNonAlphaNumeric(value.toUpperCase());
  
  if (alphaNumeric.length <= 3) {
    return alphaNumeric;
  }
  
  // Verifica se é placa Mercosul (4º caractere é número)
  const fourthChar = alphaNumeric[3];
  if (fourthChar && /\d/.test(fourthChar)) {
    // Placa Mercosul: XXX1X23
    return alphaNumeric.slice(0, 7);
  } else {
    // Placa antiga: XXX-1234
    return `${alphaNumeric.slice(0, 3)}-${alphaNumeric.slice(3, 7)}`;
  }
};

/**
 * Aplica máscara de título de eleitor XXXX.XXXX.XXXX
 */
export const applyTituloEleitorMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 4) {
    return numbers;
  }
  
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 4)}.${numbers.slice(4)}`;
  }
  
  return `${numbers.slice(0, 4)}.${numbers.slice(4, 8)}.${numbers.slice(8, 12)}`;
};

/**
 * Aplica máscara de número de processo XXXXXXX-XX.XXXX.X.XX.XXXX
 */
export const applyNumeroProcessoMask = (value: string): string => {
  const numbers = removeNonNumeric(value);
  
  if (numbers.length <= 7) {
    return numbers;
  }
  
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 7)}-${numbers.slice(7)}`;
  }
  
  if (numbers.length <= 13) {
    return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9)}`;
  }
  
  if (numbers.length <= 14) {
    return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13)}`;
  }
  
  if (numbers.length <= 16) {
    return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13, 14)}.${numbers.slice(14)}`;
  }
  
  return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13, 14)}.${numbers.slice(14, 16)}.${numbers.slice(16, 20)}`;
};

/**
 * Função principal que aplica a máscara baseada no tipo
 */
export const applyMask = (value: string, maskType: MaskType): string => {
  if (!value) return '';
  
  switch (maskType) {
    case 'phone':
      return applyPhoneMask(value);
    case 'cellphone':
      return applyCellphoneMask(value);
    case 'cpf':
      return applyCpfMask(value);
    case 'cnpj':
      return applyCnpjMask(value);
    case 'cep':
      return applyCepMask(value);
    case 'rg':
      return applyRgMask(value);
    case 'currency':
      return applyCurrencyMask(value);
    case 'percentage':
      return applyPercentageMask(value);
    case 'date':
      return applyDateMask(value);
    case 'time':
      return applyTimeMask(value);
    case 'datetime':
      return applyDateTimeMask(value);
    case 'credit-card':
      return applyCreditCardMask(value);
    case 'pis':
      return applyPisMask(value);
    case 'renavam':
      return applyRenavamMask(value);
    case 'chassi':
      return applyChassiMask(value);
    case 'placa-veiculo':
      return applyPlacaVeiculoMask(value);
    case 'titulo-eleitor':
      return applyTituloEleitorMask(value);
    case 'numero-processo':
      return applyNumeroProcessoMask(value);
    case 'uppercase':
      return value.toUpperCase();
    case 'login':
      return value.toLowerCase().replace(/\s+/g, '');
    default:
      return value;
  }
};

/**
 * Remove a máscara de um valor, retornando apenas os caracteres relevantes
 */
export const removeMask = (value: string, maskType: MaskType): string => {
  if (!value) return '';
  
  switch (maskType) {
    case 'phone':
    case 'cellphone':
    case 'cpf':
    case 'cnpj':
    case 'cep':
    case 'rg':
    case 'currency':
    case 'percentage':
    case 'date':
    case 'time':
    case 'datetime':
    case 'credit-card':
    case 'pis':
    case 'renavam':
    case 'titulo-eleitor':
    case 'numero-processo':
      return removeNonNumeric(value);
    case 'chassi':
    case 'placa-veiculo':
      return removeNonAlphaNumeric(value);
    default:
      return value;
  }
};

/**
 * Valida se um valor com máscara está completo
 */
export const isValidMask = (value: string, maskType: MaskType): boolean => {
  const cleanValue = removeMask(value, maskType);
  
  switch (maskType) {
    case 'phone':
      return cleanValue.length === 10;
    case 'cellphone':
      return cleanValue.length === 11;
    case 'cpf':
      return cleanValue.length === 11;
    case 'cnpj':
      return cleanValue.length === 14;
    case 'cep':
      return cleanValue.length === 8;
    case 'rg':
      return cleanValue.length >= 7 && cleanValue.length <= 9;
    case 'date':
      return cleanValue.length === 8;
    case 'time':
      return cleanValue.length === 4;
    case 'datetime':
      return cleanValue.length === 12;
    case 'credit-card':
      return cleanValue.length >= 13 && cleanValue.length <= 19;
    case 'pis':
      return cleanValue.length === 11;
    case 'renavam':
      return cleanValue.length === 11;
    case 'chassi':
      return cleanValue.length === 17;
    case 'placa-veiculo':
      return cleanValue.length === 7;
    case 'titulo-eleitor':
      return cleanValue.length === 12;
    case 'numero-processo':
      return cleanValue.length === 20;
    case 'currency':
    case 'percentage':
      return cleanValue.length > 0;
    default:
      return true;
  }
}; 