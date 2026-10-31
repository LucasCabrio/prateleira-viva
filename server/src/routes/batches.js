import { enrich, dashboard, validateBatch } from "../rules.js";
import { HttpError } from "../http.js";
export function batches(db, userId, path, method, body) {
  if (method === "GET" && ["/batches", "/dashboard"].includes(path)) {
    const list = db.prepare("SELECT * FROM batches WHERE user_id=? ORDER BY expires,id")
      .all(userId).map(batch => enrich(batch));
    return { status: 200, data: path === "/dashboard" ? dashboard(list) : list };
  }
  const match = path.match(/^\/batches\/(\d+)$/);
  const creating = path === "/batches" && method === "POST";
  if (!creating && !(match && ["PUT", "DELETE"].includes(method))) return null;
  let id = match ? Number(match[1]) : null;
  if (!creating && !db.prepare("SELECT id FROM batches WHERE id=? AND user_id=?").get(id, userId)) {
    throw new HttpError(404, "Lote não encontrado.");
  }
  if (method === "DELETE") {
    db.prepare("DELETE FROM batches WHERE id=? AND user_id=?").run(id, userId);
    return { status: 200, data: { message: "Lote excluído." } };
  }
  let values;
  try {
    values = validateBatch(body);
  } catch (error) {
    throw new HttpError(400, error.message);
  }
  if (creating) {
    const sql = "INSERT INTO batches(name,barcode,quantity,price,expires,category,user_id) VALUES(?,?,?,?,?,?,?)";
    id = db.prepare(sql).run(...values, userId).lastInsertRowid;
  } else {
    const sql = "UPDATE batches SET name=?,barcode=?,quantity=?,price=?,expires=?,category=? WHERE id=? AND user_id=?";
    db.prepare(sql).run(...values, id, userId);
  }
  const data = enrich(db.prepare("SELECT * FROM batches WHERE id=?").get(id));
  return { status: creating ? 201 : 200, data };
}
