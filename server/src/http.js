export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export function reply(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return (status, data) => {
    res.writeHead(status);
    res.end(JSON.stringify(data));
  };
}
export async function readBody(req) {
  if (!["POST", "PUT"].includes(req.method)) return {};
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 16384) throw new HttpError(413, "Requisição muito grande.");
  }
  let body;
  try {
    body = JSON.parse(raw || "{}");
  } catch {
    throw new HttpError(400, "JSON inválido.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Envie um objeto JSON.");
  }
  return body;
}
