import { test } from "node:test";
import assert from "node:assert/strict";
import { setup } from "./helpers.js";
test("catálogo externo: sucesso, inexistente, falha e código inválido", async t => {
  let mode = "ok";
  const fetchProduct = async () => {
    if (mode === "fail") throw new Error("offline");
    return { ok: true, json: async () => mode === "missing" ? { status: 0 } :
      { status: 1, product: { product_name: "Produto externo", brands: "Marca" } } };
  };
  const { request, register } = await setup(t, { fetchProduct });
  const token = await register();
  const lookup = code => request("/products/lookup?barcode=" + code, "GET", undefined, token);
  assert.equal((await lookup("3017620422003")).data.name, "Produto externo");
  mode = "missing";
  assert.equal((await lookup("3017620422003")).status, 404);
  mode = "fail";
  assert.equal((await lookup("3017620422003")).status, 502);
  assert.equal((await lookup("abc")).status, 400);
});
