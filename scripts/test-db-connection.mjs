import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

function loadDbEnv() {
  const filePath = path.resolve(process.cwd(), ".env.db");
  if (!fs.existsSync(filePath)) {
    throw new Error("Missing .env.db file. Copy .env.db.example to .env.db and fill credentials.");
  }

  const content = fs.readFileSync(filePath, "utf8");
  const vars = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    vars[key] = value;
  }

  return vars;
}

async function main() {
  const env = loadDbEnv();
  const conn = await mysql.createConnection({
    host: env.DB_HOST || "127.0.0.1",
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USER,
    password: env.DB_PASSWORD || "",
    database: env.DB_NAME || "hostel_hub",
  });

  const [rows] = await conn.query("SELECT DATABASE() AS db, NOW() AS server_time");
  console.log("Connected successfully:", rows[0]);

  const [tables] = await conn.query("SHOW TABLES");
  console.log(`Tables found: ${tables.length}`);

  await conn.end();
}

main().catch((err) => {
  console.error("DB connection failed:", err.message);
  process.exit(1);
});
