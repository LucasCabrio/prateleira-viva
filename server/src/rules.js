export { validateBatch } from "./validation.js";
export const today = () => new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());
export function enrich(batch, date = today()) {
  const days = Math.round(
    (Date.parse(batch.expires + "T12:00:00Z") - Date.parse(date + "T12:00:00Z")) / 86400000,
  );
  let status = "Em dia";
  let discount = 0;
  if (days < 0) status = "Vencido";
  else if (days <= 2) { status = "Urgente"; discount = 30; }
  else if (days <= 7) { status = "Atenção"; discount = 15; }
  return {
    ...batch, days, discount, status,
    suggestedPrice: Math.round(batch.price * (1 - discount / 100) * 100) / 100,
  };
}
export function dashboard(batches) {
  const atRisk = batches.filter(batch => batch.days >= 0 && batch.days <= 7);
  return {
    lots: batches.length,
    units: batches.reduce((sum, batch) => sum + batch.quantity, 0),
    atRisk: atRisk.reduce((sum, batch) => sum + batch.quantity * batch.price, 0),
    expired: batches.filter(batch => batch.days < 0).length,
    urgent: batches.filter(batch => batch.days >= 0 && batch.days <= 2).length,
  };
}
