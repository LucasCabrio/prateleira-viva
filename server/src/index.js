import { openDatabase } from "./database.js";
import { createApp } from "./app.js";
const app = createApp(openDatabase());
const port = Number(process.env.PORT || 3001);
app.listen(port, "0.0.0.0", () =>
  console.log(`BFF Prateleira Viva em http://localhost:${port}`),
);
