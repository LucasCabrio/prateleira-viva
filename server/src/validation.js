export function validateBatch(batch) {
  const { name, quantity, price, expires, category, barcode } = batch;
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    throw new Error("Informe um nome de 2 a 100 caracteres.");
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
    throw new Error("Quantidade deve ser um inteiro entre 1 e 100.000.");
  }
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0 || price > 100000) {
    throw new Error("Informe um preço maior que zero, até R$ 100.000.");
  }
  if (typeof expires !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(expires) ||
      !Number.isFinite(Date.parse(expires)) || new Date(expires).toISOString().slice(0, 10) !== expires) {
    throw new Error("Informe uma validade real no formato AAAA-MM-DD.");
  }
  if (!["Laticínios", "Mercearia", "Bebidas", "Hortifruti", "Outros"].includes(category)) {
    throw new Error("Selecione uma categoria válida.");
  }
  if (barcode && !/^\d{8,14}$/.test(barcode)) {
    throw new Error("Código de barras deve ter de 8 a 14 dígitos.");
  }
  return [name.trim(), barcode || "", quantity, Math.round(price * 100) / 100, expires, category];
}
