import { test } from "node:test";
import assert from "node:assert/strict";
import { setup, account } from "./helpers.js";
test("cadastro, login, logout e expiração", async t => {
  const { request, register, expire } = await setup(t);
  assert.equal((await request("/batches")).status, 401);
  const token = await register();
  assert.ok(token);
  assert.equal((await request("/auth/login", "POST", { ...account, password: "wrongpass" })).status, 401);
  assert.equal((await request("/auth/login", "POST", account)).status, 200);
  assert.equal((await request("/auth/register", "POST", account)).status, 409);
  assert.equal((await request("/auth/logout", "POST", {}, token)).status, 200);
  assert.equal((await request("/batches", "GET", undefined, token)).status, 401);
  const second = await register("paulo@test.com");
  expire();
  assert.equal((await request("/batches", "GET", undefined, second)).status, 401);
  assert.equal((await request("/auth/login", "POST", null)).status, 400);
});
