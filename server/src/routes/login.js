import { hashPassword, verifyPassword, createSession } from "../auth.js";
import { HttpError } from "../http.js";
function checkAttempts(ip, attempts) {
  const previous = attempts.get(ip);
  const active = previous && previous.until > Date.now();
  if (active && previous.count >= 30) {
    throw new HttpError(429, "Muitas tentativas. Aguarde 15 minutos.");
  }
  if (attempts.size > 10000) attempts.clear();
  attempts.set(ip, {
    count: active ? previous.count + 1 : 1,
    until: active ? previous.until : Date.now() + 900000,
  });
}
export function login(db, body, path, ip, attempts) {
  checkAttempts(ip, attempts);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = body.password;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      typeof password !== "string" || password.length < 8 || password.length > 128) {
    throw new HttpError(400, "Informe e-mail válido e senha de 8 a 128 caracteres.");
  }
  if (path === "/auth/register") {
    if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.length > 80) {
      throw new HttpError(400, "Informe seu nome (2 a 80 caracteres).");
    }
    if (db.prepare("SELECT id FROM users WHERE email=?").get(email)) {
      throw new HttpError(409, "E-mail já cadastrado.");
    }
    db.prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)")
      .run(body.name.trim(), email, hashPassword(password));
  }
  const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
  if (!user || !verifyPassword(password, user.password)) {
    throw new HttpError(401, "E-mail ou senha incorretos.");
  }
  return {
    token: createSession(db, user.id),
    user: { id: user.id, name: user.name, email: user.email },
  };
}
