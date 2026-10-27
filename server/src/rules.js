export const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
export function enrich(batch, date = today()) {
  const days = Math.round(
    (Date.parse(batch.expires + "T12:00:00Z") -
      Date.parse(date + "T12:00:00Z")) /
      86400000,
  );
  const discount = days < 0 ? 0 : days <= 2 ? 30 : days <= 7 ? 15 : 0;
  return {
    ...batch,
    days,
    discount,
    status:
      days < 0
        ? "Vencido"
        : days <= 2
          ? "Urgente"
          : days <= 7
            ? "Atenção"
            : "Em dia",
    suggestedPrice: Math.round(batch.price * (1 - discount / 100) * 100) / 100,
  };
}
export function validateBatch(b) {
  if (
    typeof b.name !== "string" ||
    b.name.trim().length < 2 ||
    b.name.length > 100
  )
    throw new Error("Informe um nome de 2 a 100 caracteres.");
  if (!Number.isInteger(b.quantity) || b.quantity < 1 || b.quantity > 100000)
    throw new Error("Quantidade deve ser um inteiro entre 1 e 100.000.");
  if (
    typeof b.price !== "number" ||
    !Number.isFinite(b.price) ||
    b.price <= 0 ||
    b.price > 100000
  )
    throw new Error("Informe um preço maior que zero, até R$ 100.000.");
  if (
    typeof b.expires !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(b.expires) ||
    !Number.isFinite(Date.parse(b.expires)) ||
    new Date(b.expires).toISOString().slice(0, 10) !== b.expires
  )
    throw new Error("Informe uma validade real no formato AAAA-MM-DD.");
  if (
    !["Laticínios", "Mercearia", "Bebidas", "Hortifruti", "Outros"].includes(
      b.category,
    )
  )
    throw new Error("Selecione uma categoria válida.");
  if (b.barcode && !/^\d{8,14}$/.test(b.barcode))
    throw new Error("Código de barras deve ter de 8 a 14 dígitos.");
  return [
    b.name.trim(),
    b.barcode || "",
    b.quantity,
    Math.round(b.price * 100) / 100,
    b.expires,
    b.category,
  ];
}
export function dashboard(batches) {
  return {
    lots: batches.length,
    units: batches.reduce((s, b) => s + b.quantity, 0),
    atRisk: batches
      .filter((b) => b.days >= 0 && b.days <= 7)
      .reduce((s, b) => s + b.quantity * b.price, 0),
    expired: batches.filter((b) => b.days < 0).length,
    urgent: batches.filter((b) => b.days >= 0 && b.days <= 2).length,
  };
}
