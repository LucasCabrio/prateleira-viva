// Recebe requisições HTTP, verifica a autenticação, encaminha as rotas e devolve respostas ou erros.
import { createServer } from "node:http";
import { authenticate, tokenHash } from "./auth.js";
import { readBody, reply, HttpError } from "./http.js";
import { login } from "./routes/login.js";
import { lookup } from "./routes/lookup.js";
import { batches } from "./routes/batches.js";
export function createApp(db, { fetchProduct = fetch } = {}) {
  const attempts = new Map();
  return createServer(async (req, res) => {
    const send = reply(res);
    try {
      const url = new URL(req.url, "http://localhost");
      const path = url.pathname;
      if (req.method === "OPTIONS") return send(204, {});
      if (path === "/health") return send(200, { status: "ok" });
      const body = await readBody(req);
      if (req.method === "POST" && ["/auth/login", "/auth/register"].includes(path)) {
        return send(200, login(db, body, path, req.socket.remoteAddress, attempts));
      }
      const user = authenticate(db, req.headers.authorization);
      if (!user) throw new HttpError(401, "Sessão expirada. Entre novamente.");
      if (path === "/auth/me" && req.method === "GET") return send(200, user);
      if (path === "/auth/logout" && req.method === "POST") {
        const token = req.headers.authorization.replace(/^Bearer /, "");
        db.prepare("DELETE FROM sessions WHERE token=?").run(tokenHash(token));
        return send(200, { message: "Sessão encerrada." });
      }
      if (path === "/products/lookup" && req.method === "GET") {
        return send(200, await lookup(url.searchParams.get("barcode"), fetchProduct));
      }
      const result = batches(db, user.id, path, req.method, body);
      if (result) return send(result.status, result.data);
      throw new HttpError(404, "Rota não encontrada.");
    } catch (error) {
      if (!error.status) console.error(error);
      send(error.status || 500, { message: error.status ? error.message : "Erro interno. Tente novamente." });
    }
  });
}
