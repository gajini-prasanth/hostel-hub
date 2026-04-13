import mysql from "mysql2/promise";

const DB_CONFIG = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "hostel_hub",
};

async function main() {
  const conn = await mysql.createConnection({
    ...DB_CONFIG,
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
