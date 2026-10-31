const { button, field } = require("./helpers.cjs");
exports.loginAndBrowse = async (page, screenshot) => {
  await page.getByText("Bem-vindo de volta").waitFor();
  await screenshot(page, "01-login.png");
  await field(page, "E-mail").fill("demo@prateleiraviva.com");
  await field(page, "Senha").fill("Demo@12345");
  await button(page, "Entrar no mercado").click();
  await page.getByText("Resumo dos lotes").waitFor();
  await screenshot(page, "02-dashboard.png");
  await button(page, "▤  Prateleira").click();
  await page.getByText("Sua prateleira", { exact: true }).waitFor();
  await screenshot(page, "03-prateleira.png");
  await button(page, "Editar Iogurte natural").click();
  await page.getByText("Detalhes do lote").waitFor();
  await screenshot(page, "04-edicao.png");
};
