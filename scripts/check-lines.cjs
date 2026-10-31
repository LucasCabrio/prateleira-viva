const fs = require("node:fs");
const path = require("node:path");
const roots = ["mobile/src", "server/src", "server/test", "scripts"];
const extensions = new Set([".ts", ".tsx", ".js", ".cjs", ".py"]);
let count = 0;
let failed = false;
function check(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { check(file); continue; }
    if (!extensions.has(path.extname(file))) continue;
    const source = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const lines = source.replace(/\n$/, "").split("\n").length;
    count++;
    if (lines > 50) { console.error(file + ": " + lines + " linhas"); failed = true; }
  }
}
roots.forEach(check);
console.log(count + " arquivos de código verificados (limite: 50 linhas).");
process.exitCode = failed ? 1 : 0;
