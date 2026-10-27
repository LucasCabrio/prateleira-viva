import { openDatabase } from "./database.js";
import { hashPassword } from "./auth.js";
import { today } from "./rules.js";
const db = openDatabase();
const email = "demo@prateleiraviva.com";
if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) {
  console.log("Demonstração já existe. Dados preservados.");
  process.exit(0);
}
const user = db
  .prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)")
  .run("Mercado do Bairro", email, hashPassword("Demo@12345"));
const date = (offset) => {
  const d = new Date(today() + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
};
const insert = db.prepare(
  "INSERT INTO batches(user_id,name,barcode,quantity,price,expires,category) VALUES(?,?,?,?,?,?,?)",
);
for (const [name, qty, price, days, cat] of [
  ["Iogurte natural", 18, 5.9, 1, "Laticínios"],
  ["Queijo minas frescal", 8, 18.5, 2, "Laticínios"],
  ["Suco de uva integral", 12, 14.9, 5, "Bebidas"],
  ["Granola artesanal", 15, 22.9, 20, "Mercearia"],
  ["Leite integral", 24, 5.49, 6, "Laticínios"],
  ["Molho de tomate", 6, 4.9, -1, "Mercearia"],
])
  insert.run(user.lastInsertRowid, name, "", qty, price, date(days), cat);
console.log("Conta demo criada: demo@prateleiraviva.com / Demo@12345");
db.close();
