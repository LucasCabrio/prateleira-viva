import { Batch } from "../types";
import { dateLabel } from "../theme";
export type BatchValues = {
  name: string; barcode: string; quantity: string;
  price: string; expires: string; category: string;
};
export function initialValues(batch: Batch | null): BatchValues {
  return {
    name: batch?.name || "", barcode: batch?.barcode || "",
    quantity: batch ? String(batch.quantity) : "",
    price: batch ? String(batch.price).replace(".", ",") : "",
    expires: batch ? dateLabel(batch.expires) : "", category: batch?.category || "Mercearia",
  };
}
export function parseValues(values: BatchValues) {
  const price = Number(values.price.replace(",", "."));
  if (values.name.trim().length < 2 || !/^\d+$/.test(values.quantity) ||
      Number(values.quantity) < 1 || !Number.isFinite(price) || price <= 0 ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(values.expires)) {
    throw new Error("Confira nome, quantidade, preço e validade (DD/MM/AAAA).");
  }
  return {
    ...values, price, quantity: Number(values.quantity),
    expires: values.expires.split("/").reverse().join("-"),
  };
}
