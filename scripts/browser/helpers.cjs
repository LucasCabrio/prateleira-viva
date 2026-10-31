const fs = require("node:fs");
const path = require("node:path");
exports.button = (page, name) => page.getByRole("button", { name, exact: true });
exports.field = (page, label) => page.getByLabel(label, { exact: true });
exports.screenshot = async (page, filename) => {
  const directory = process.env.TEST_SCREENSHOT_DIR || "docs/screenshots";
  fs.mkdirSync(directory, { recursive: true });
  await page.screenshot({ path: path.join(directory, filename) });
};
