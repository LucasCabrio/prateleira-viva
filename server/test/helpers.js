import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase } from "../src/database.js";
import { createApp } from "../src/app.js";
export const account = { name: "Lucas", email: "lucas@test.com", password: "Teste@123" };
export const lot = { name: "Iogurte", barcode: "", quantity: 4, price: 5.9,
  expires: "2026-12-31", category: "Laticínios" };
export async function setup(t, options = {}) {
  const directory = mkdtempSync(join(tmpdir(), "pv-test-"));
  const file = join(directory, "test.db");
  let db, app, base;
  const start = async () => {
    db = openDatabase(file);
    app = createApp(db, options);
    await new Promise(resolve => app.listen(0, "127.0.0.1", resolve));
    base = "http://127.0.0.1:" + app.address().port;
  };
  const stop = async () => {
    await new Promise(resolve => app.close(resolve));
    db.close();
  };
  t.after(async () => {
    await stop();
    rmSync(directory, { recursive: true, force: true });
  });
  await start();
  const request = async (path, method = "GET", body, token) => {
    const response = await fetch(base + path, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: response.status, data: await response.json() };
  };
  const register = async (email = account.email) =>
    (await request("/auth/register", "POST", { ...account, email })).data.token;
  return { request, register,
    expire: () => db.prepare("UPDATE sessions SET expires=0").run(),
    restart: async () => { await stop(); await start(); },
  };
}
