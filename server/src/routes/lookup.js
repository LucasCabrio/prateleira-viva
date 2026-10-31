import { HttpError } from "../http.js";
export async function lookup(code, fetchProduct) {
  if (!/^\d{8,14}$/.test(code || "")) {
    throw new HttpError(400, "Digite um código de 8 a 14 dígitos.");
  }
  let data;
  try {
    const url = "https://world.openfoodfacts.org/api/v2/product/";
    const response = await fetchProduct(url + code + ".json?fields=product_name,brands", {
      headers: { "User-Agent": "PrateleiraViva/1.0 (academic project)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Falha no catálogo");
    data = await response.json();
  } catch {
    throw new HttpError(502, "Catálogo indisponível. Você pode preencher manualmente.");
  }
  if (data.status !== 1 || !data.product?.product_name) {
    throw new HttpError(404, "Produto não encontrado. Preencha o nome manualmente.");
  }
  return {
    name: data.product.product_name,
    brand: data.product.brands || "",
    source: "Open Food Facts",
  };
}
