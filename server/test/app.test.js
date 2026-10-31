import { test } from "node:test";
import assert from "node:assert/strict";
import { enrich, dashboard, validateBatch } from "../src/rules.js";
import { lot } from "./helpers.js";
test("limites de validade, descontos e indicadores", () => {
  const batch = { ...lot, price: 10, quantity: 3, expires: "2026-10-27" };
  const cases = [["2026-10-28", 0], ["2026-10-27", 30], ["2026-10-25", 30],
    ["2026-10-24", 15], ["2026-10-20", 15], ["2026-10-19", 0]];
  for (const [date, discount] of cases) assert.equal(enrich(batch, date).discount, discount);
  assert.equal(dashboard([enrich(batch, "2026-10-27")]).atRisk, 30);
  assert.throws(() => validateBatch({ ...batch, expires: "2026-02-30" }));
});
