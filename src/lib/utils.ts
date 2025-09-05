import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToUrl(url: string) {
  if (url.includes("http")) {
    return url;
  }
  return `https://${url}`;
}

export const objectToBooleanArray = (obj: Record<string, boolean>): boolean[] => {
  // Se o objeto estiver vazio, retorna array vazio
  if (!obj || Object.keys(obj).length === 0) {
    return [];
  }

  // Converte as chaves para números e encontra o maior índice
  const indices = Object.keys(obj).map(key => parseInt(key, 10));
  const maxIndex = Math.max(...indices);

  // Cria array preenchido com false
  const result = new Array(maxIndex + 1).fill(false);

  // Define true nas posições especificadas n  o objeto
  Object.entries(obj).forEach(([key, value]) => {
    const index = parseInt(key, 10);
    if (value && index >= 0) {
      result[index] = true;
    }
  });

  return result;
};

objectToBooleanArray({
  11: true,
});