import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase } from "../src/database.js";
import { createApp } from "../src/app.js";
import { enrich, dashboard, validateBatch } from "../src/rules.js";
test("limites de validade, descontos e indicadores", () => {
  const b = { price: 10, quantity: 3, expires: "2026-10-27" };
  assert.equal(enrich(b, "2026-10-28").discount, 0);
  assert.equal(enrich(b, "2026-10-27").discount, 30);
  assert.equal(enrich(b, "2026-10-25").discount, 30);
  assert.equal(enrich(b, "2026-10-24").discount, 15);
  assert.equal(enrich(b, "2026-10-20").discount, 15);
  assert.equal(enrich(b, "2026-10-19").discount, 0);
  assert.equal(dashboard([enrich(b, "2026-10-27")]).atRisk, 30);
  assert.throws(() =>
    validateBatch({
      ...b,
      name: "Leite",
      barcode: "",
      category: "Laticínios",
      expires: "2026-02-30",
    }),
  );
});
test("HTTP: autenticação, CRUD, isolamento, catálogo, expiração e persistência", async () => {
  const dir = mkdtempSync(join(tmpdir(), "pv-test-"));
  const file = join(dir, "test.db");
  let db = openDatabase(file);
  let external = "ok";
  const app = createApp(db, {
    fetchProduct: async () => {
      if (external === "fail") throw new Error("offline");
      return {
        ok: true,
        json: async () =>
          external === "missing"
            ? { status: 0 }
            : {
                status: 1,
                product: { product_name: "Produto externo", brands: "Marca" },
              },
      };
    },
  });
  await new Promise((resolve) => app.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + app.address().port;
  const req = async (path, method = "GET", body, token) => {
    const r = await fetch(base + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: r.status, data: await r.json() };
  };
  try {
    assert.equal((await req("/batches")).status, 401);
    const a = await req("/auth/register", "POST", {
      name: "Lucas",
      email: "lucas@test.com",
      password: "Teste@123",
    });
    assert.equal(a.status, 200);
    const token = a.data.token;
    assert.equal(
      (
        await req("/auth/login", "POST", {
          email: "lucas@test.com",
          password: "wrongpass",
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await req("/auth/login", "POST", {
          email: "lucas@test.com",
          password: "Teste@123",
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await req("/auth/register", "POST", {
          name: "Lucas",
          email: "lucas@test.com",
          password: "Teste@123",
        })
      ).status,
      409,
    );
    const b = await req("/auth/register", "POST", {
      name: "Paulo",
      email: "paulo@test.com",
      password: "Teste@123",
    });
    const lot = {
      name: "Iogurte",
      barcode: "",
      quantity: 4,
      price: 5.9,
      expires: "2026-12-31",
      category: "Laticínios",
    };
    assert.equal(
      (await req("/batches", "POST", { ...lot, quantity: -1 }, token)).status,
      400,
    );
    const created = await req("/batches", "POST", lot, token);
    assert.equal(created.status, 201);
    const id = created.data.id;
    assert.equal(
      (await req("/batches", "GET", undefined, b.data.token)).data.length,
      0,
    );
    assert.equal(
      (await req("/batches/" + id, "DELETE", undefined, b.data.token)).status,
      404,
    );
    assert.equal(
      (await req("/batches/" + id, "PUT", lot, b.data.token)).status,
      404,
    );
    assert.equal(
      (await req("/batches/" + id, "PUT", { ...lot, quantity: 8 }, token)).data
        .quantity,
      8,
    );
    assert.equal(
      (await req("/dashboard", "GET", undefined, token)).data.units,
      8,
    );
    assert.equal(
      (
        await req(
          "/products/lookup?barcode=3017620422003",
          "GET",
          undefined,
          token,
        )
      ).data.name,
      "Produto externo",
    );
    external = "missing";
    assert.equal(
      (
        await req(
          "/products/lookup?barcode=3017620422003",
          "GET",
          undefined,
          token,
        )
      ).status,
      404,
    );
    external = "fail";
    assert.equal(
      (
        await req(
          "/products/lookup?barcode=3017620422003",
          "GET",
          undefined,
          token,
        )
      ).status,
      502,
    );
    assert.equal(
      (await req("/products/lookup?barcode=abc", "GET", undefined, token))
        .status,
      400,
    );
    assert.equal((await req("/auth/logout", "POST", {}, token)).status, 200);
    assert.equal((await req("/batches", "GET", undefined, token)).status, 401);
    db.prepare("UPDATE sessions SET expires=0").run();
    assert.equal(
      (await req("/batches", "GET", undefined, b.data.token)).status,
      401,
    );
    await new Promise((resolve) => app.close(resolve));
    db.close();
    db = openDatabase(file);
    assert.equal(
      db.prepare("SELECT quantity FROM batches WHERE id=?").get(id).quantity,
      8,
    );
    const restarted = createApp(db);
    await new Promise((resolve) => restarted.listen(0, "127.0.0.1", resolve));
    try {
      const url = "http://127.0.0.1:" + restarted.address().port;
      const auth = await fetch(url + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "lucas@test.com",
          password: "Teste@123",
        }),
      }).then((r) => r.json());
      const headers = { Authorization: "Bearer " + auth.token };
      assert.equal(
        (await fetch(url + "/batches", { headers }).then((r) => r.json()))
          .length,
        1,
      );
      assert.equal(
        (await fetch(url + "/batches/" + id, { method: "DELETE", headers }))
          .status,
        200,
      );
      assert.equal(
        (await fetch(url + "/batches", { headers }).then((r) => r.json()))
          .length,
        0,
      );
    } finally {
      await new Promise((resolve) => restarted.close(resolve));
    }
  } finally {
    if (app.listening) await new Promise((resolve) => app.close(resolve));
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
