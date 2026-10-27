const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => console.error("PAGE ERROR:", e.message));
  await page.goto("http://127.0.0.1:8083", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.getByText("Bem-vindo de volta").waitFor();
  await page.screenshot({ path: "docs/screenshots/01-login.png" });
  await page
    .getByLabel("E-mail", { exact: true })
    .fill("demo@prateleiraviva.com");
  await page.getByLabel("Senha", { exact: true }).fill("Demo@12345");
  await page.getByRole("button", { name: "Entrar no mercado" }).click();
  await page.getByText("Cada produto conta.").waitFor();
  await page.screenshot({ path: "docs/screenshots/02-dashboard.png" });
  await page.getByRole("button", { name: "▤  Prateleira" }).click();
  await page.getByText("Sua prateleira", { exact: true }).waitFor();
  await page.screenshot({ path: "docs/screenshots/03-prateleira.png" });
  await page
    .getByRole("button", { name: "Editar Iogurte natural", exact: true })
    .click();
  await page.getByText("Detalhes do lote").waitFor();
  await page.screenshot({ path: "docs/screenshots/04-edicao.png" });
  await page.getByRole("button", { name: "+  Novo lote", exact: true }).click();
  await page
    .getByLabel("Nome do produto", { exact: true })
    .fill("Produto teste de interface");
  await page.getByLabel("Quantidade", { exact: true }).fill("3");
  await page.getByLabel("Preço unitário (R$)", { exact: true }).fill("7,50");
  await page
    .getByLabel("Validade (DD/MM/AAAA)", { exact: true })
    .fill("31/12/2026");
  await page.screenshot({ path: "docs/screenshots/05-cadastro.png" });
  await page.getByRole("button", { name: "Salvar lote", exact: true }).click();
  await page.getByText("Lote cadastrado com sucesso.").waitFor();
  await page
    .getByLabel("Buscar produto", { exact: true })
    .fill("Produto teste de interface");
  await page
    .getByRole("button", {
      name: "Editar Produto teste de interface",
      exact: true,
    })
    .click();
  await page.getByLabel("Quantidade", { exact: true }).fill("5");
  await page.getByRole("button", { name: "Salvar lote", exact: true }).click();
  await page.getByText("Lote atualizado com sucesso.").waitFor();
  await page
    .getByLabel("Buscar produto", { exact: true })
    .fill("Produto teste de interface");
  await page
    .getByRole("button", {
      name: "Editar Produto teste de interface",
      exact: true,
    })
    .click();
  assert.equal(
    await page.getByLabel("Quantidade", { exact: true }).inputValue(),
    "5",
  );
  await page.getByRole("button", { name: "Excluir lote", exact: true }).click();
  await page.getByText("Excluir este lote?").waitFor();
  await page
    .getByRole("button", { name: "Sim, excluir definitivamente", exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: "docs/screenshots/06-exclusao.png" });
  await page
    .getByRole("button", { name: "Sim, excluir definitivamente", exact: true })
    .click();
  await page.getByText("Lote excluído com sucesso.").waitFor();
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await page.getByText("Bem-vindo de volta").waitFor();
  await page.goto("http://127.0.0.1:8083/inventory");
  await page.getByText("Bem-vindo de volta").waitFor();
  console.log(
    "PASS: login, cadastro, consulta, edição, exclusão, logout e rota protegida.",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
