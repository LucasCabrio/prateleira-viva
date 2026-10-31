const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const { loginAndBrowse } = require("./browser/login.cjs");
const { exerciseCrud } = require("./browser/crud.cjs");
const { screenshot } = require("./browser/helpers.cjs");
const url = process.env.TEST_APP_URL || "http://127.0.0.1:8083";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  try {
    const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    await loginAndBrowse(page, screenshot);
    await exerciseCrud(page, screenshot);
    await page.getByRole("button", { name: "Sair", exact: true }).click();
    await page.getByText("Bem-vindo de volta").waitFor();
    await page.goto(url + "/inventory");
    await page.getByText("Bem-vindo de volta").waitFor();
    if (errors.length) throw new Error(errors.join("\n"));
    console.log("PASS: login, cadastro, consulta, edição, exclusão, logout e rota protegida.");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
