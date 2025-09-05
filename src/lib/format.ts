// Função para formatar preço
export const formatPrice = (price: number | undefined) => {
  if (!price) return "N/A";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};