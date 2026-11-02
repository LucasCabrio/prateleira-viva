// Calcula e verifica hashes de senhas, gera tokens de sessão e autentica usuários com sessões válidas por 24 horas.
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  return timingSafeEqual(
    Buffer.from(hash, "hex"),
    scryptSync(password, salt, 64),
  );
}
export const tokenHash = (token) =>
  createHash("sha256").update(token).digest("hex");
export function createSession(db, userId) {
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
    tokenHash(token),
    userId,
    Date.now() + 86400000,
  );
  return token;
}
export function authenticate(db, header = "") {
  return db
    .prepare(
      "SELECT users.id,users.name,users.email FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=? AND expires>?",
    )
    .get(tokenHash(header.replace(/^Bearer /, "")), Date.now());
}
