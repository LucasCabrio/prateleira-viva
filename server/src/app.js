import { createServer } from "node:http";
import {
  hashPassword,
  verifyPassword,
  createSession,
  authenticate,
  tokenHash,
} from "./auth.js";
import { enrich, validateBatch, dashboard } from "./rules.js";
export function createApp(db, { fetchProduct = fetch } = {}) {
  const attempts = new Map();
  return createServer(async (req, res) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.ALLOWED_ORIGIN || "*",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS",
    );
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    const send = (status, data) => {
      res.writeHead(status);
      res.end(JSON.stringify(data));
    };
    if (req.method === "OPTIONS") return send(204, {});
    try {
      const url = new URL(req.url, "http://localhost");
      const path = url.pathname;
      if (path === "/health") return send(200, { status: "ok" });
      let body = {};
      if (["POST", "PUT"].includes(req.method)) {
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          if (raw.length > 16384)
            return send(413, { message: "Requisição muito grande." });
        }
        try {
          body = JSON.parse(raw || "{}");
        } catch {
          return send(400, { message: "JSON inválido." });
        }
      }
      if (
        ["/auth/register", "/auth/login"].includes(path) &&
        req.method === "POST"
      ) {
        const ip = req.socket.remoteAddress;
        const limit = attempts.get(ip);
        if (limit && limit.until > Date.now() && limit.count >= 30)
          return send(429, {
            message: "Muitas tentativas. Aguarde 15 minutos.",
          });
        if (attempts.size > 10000) attempts.clear();
        attempts.set(ip, {
          count: limit && limit.until > Date.now() ? limit.count + 1 : 1,
          until:
            limit && limit.until > Date.now()
              ? limit.until
              : Date.now() + 900000,
        });
        const email =
          typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          email.length > 254 ||
          typeof body.password !== "string" ||
          body.password.length < 8 ||
          body.password.length > 128
        )
          return send(400, {
            message: "Informe e-mail válido e senha de 8 a 128 caracteres.",
          });
        if (path.endsWith("register")) {
          if (
            typeof body.name !== "string" ||
            body.name.trim().length < 2 ||
            body.name.length > 80
          )
            return send(400, {
              message: "Informe seu nome (2 a 80 caracteres).",
            });
          if (db.prepare("SELECT id FROM users WHERE email=?").get(email))
            return send(409, { message: "E-mail já cadastrado." });
          db.prepare(
            "INSERT INTO users(name,email,password) VALUES(?,?,?)",
          ).run(body.name.trim(), email, hashPassword(body.password));
        }
        const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
        if (!user || !verifyPassword(body.password, user.password))
          return send(401, { message: "E-mail ou senha incorretos." });
        return send(200, {
          token: createSession(db, user.id),
          user: { id: user.id, name: user.name, email: user.email },
        });
      }
      const user = authenticate(db, req.headers.authorization);
      if (!user)
        return send(401, { message: "Sessão expirada. Entre novamente." });
      if (path === "/auth/me" && req.method === "GET") return send(200, user);
      if (path === "/auth/logout" && req.method === "POST") {
        db.prepare("DELETE FROM sessions WHERE token=?").run(
          tokenHash(req.headers.authorization.replace(/^Bearer /, "")),
        );
        return send(200, { message: "Sessão encerrada." });
      }
      if (path === "/products/lookup" && req.method === "GET") {
        const code = url.searchParams.get("barcode") || "";
        if (!/^\d{8,14}$/.test(code))
          return send(400, { message: "Digite um código de 8 a 14 dígitos." });
        try {
          const upstream = await fetchProduct(
            `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,brands`,
            {
              headers: {
                "User-Agent": "PrateleiraViva/1.0 (academic project)",
              },
              signal: AbortSignal.timeout(8000),
            },
          );
          if (!upstream.ok) throw new Error();
          const data = await upstream.json();
          if (data.status !== 1 || !data.product?.product_name)
            return send(404, {
              message: "Produto não encontrado. Preencha o nome manualmente.",
            });
          return send(200, {
            name: data.product.product_name,
            brand: data.product.brands || "",
            source: "Open Food Facts",
          });
        } catch {
          return send(502, {
            message: "Catálogo indisponível. Você pode preencher manualmente.",
          });
        }
      }
      if (["/batches", "/dashboard"].includes(path) && req.method === "GET") {
        const batches = db
          .prepare("SELECT * FROM batches WHERE user_id=? ORDER BY expires,id")
          .all(user.id)
          .map((b) => enrich(b));
        return send(200, path === "/dashboard" ? dashboard(batches) : batches);
      }
      if (path === "/batches" && req.method === "POST") {
        let values;
        try {
          values = validateBatch(body);
        } catch (e) {
          return send(400, { message: e.message });
        }
        const result = db
          .prepare(
            "INSERT INTO batches(name,barcode,quantity,price,expires,category,user_id) VALUES(?,?,?,?,?,?,?)",
          )
          .run(...values, user.id);
        return send(
          201,
          enrich(
            db
              .prepare("SELECT * FROM batches WHERE id=?")
              .get(result.lastInsertRowid),
          ),
        );
      }
      const match = path.match(/^\/batches\/(\d+)$/);
      if (match && ["PUT", "DELETE"].includes(req.method)) {
        const id = Number(match[1]);
        if (
          !db
            .prepare("SELECT id FROM batches WHERE id=? AND user_id=?")
            .get(id, user.id)
        )
          return send(404, { message: "Lote não encontrado." });
        if (req.method === "DELETE") {
          db.prepare("DELETE FROM batches WHERE id=? AND user_id=?").run(
            id,
            user.id,
          );
          return send(200, { message: "Lote excluído." });
        }
        let values;
        try {
          values = validateBatch(body);
        } catch (e) {
          return send(400, { message: e.message });
        }
        db.prepare(
          "UPDATE batches SET name=?,barcode=?,quantity=?,price=?,expires=?,category=? WHERE id=? AND user_id=?",
        ).run(...values, id, user.id);
        return send(
          200,
          enrich(db.prepare("SELECT * FROM batches WHERE id=?").get(id)),
        );
      }
      send(404, { message: "Rota não encontrada." });
    } catch (error) {
      console.error(error);
      send(500, { message: "Erro interno. Tente novamente." });
    }
  });
}
