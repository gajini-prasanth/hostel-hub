import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.db") });

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hostel_hub",
  waitForConnections: true,
  connectionLimit: 10,
});

const mapStudent = (r) => ({
  id: r.id,
  name: r.full_name,
  email: r.email,
  phone: r.phone,
  course: r.course,
  year: r.academic_year,
  roomNumber: r.room_number,
  parentName: r.parent_name,
  parentPhone: r.parent_phone,
  feeStatus: r.fee_status,
  photo: r.photo_url || undefined,
  joinDate: r.join_date,
});

app.get("/api/health", async (_req, res) => {
  const [rows] = await pool.query("SELECT DATABASE() AS db");
  res.json({ ok: true, db: rows[0]?.db });
});

app.get("/api/students", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM students ORDER BY id");
  res.json(rows.map(mapStudent));
});

app.post("/api/students", async (req, res) => {
  const body = req.body;
  await pool.query(
    `INSERT INTO students (
      id, full_name, email, phone, course, academic_year, room_number,
      parent_name, parent_phone, fee_status, photo_url, join_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.id,
      body.name,
      body.email,
      body.phone,
      body.course,
      body.year,
      body.roomNumber,
      body.parentName,
      body.parentPhone,
      body.feeStatus || "pending",
      body.photo || null,
      body.joinDate,
    ]
  );
  res.status(201).json({ ok: true });
});

app.delete("/api/students/:id", async (req, res) => {
  await pool.query("DELETE FROM students WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/api/rooms", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM rooms ORDER BY room_number");
  res.json(
    rows.map((r) => ({
      id: r.id,
      number: r.room_number,
      type: r.room_type,
      capacity: r.capacity,
      occupied: r.occupied,
      floor: r.floor,
      status: r.room_status,
    }))
  );
});

app.post("/api/rooms", async (req, res) => {
  const b = req.body;
  await pool.query(
    "INSERT INTO rooms (id, room_number, room_type, capacity, occupied, floor, room_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [b.id, b.number, b.type, b.capacity, b.occupied ?? 0, b.floor, b.status || "available"]
  );
  res.status(201).json({ ok: true });
});

app.get("/api/complaints", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM complaints ORDER BY created_at DESC");
  res.json(
    rows.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      studentName: r.student_name_snapshot,
      roomNumber: r.room_number_snapshot,
      category: r.category,
      subject: r.subject,
      description: r.description,
      priority: r.priority,
      status: r.complaint_status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }))
  );
});

app.post("/api/complaints", async (req, res) => {
  const b = req.body;
  await pool.query(
    `INSERT INTO complaints (
      id, student_id, student_name_snapshot, room_number_snapshot,
      category, subject, description, priority, complaint_status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', CURDATE(), CURDATE())`,
    [b.id, b.studentId, b.studentName, b.roomNumber, b.category, b.subject, b.description, b.priority || "medium"]
  );
  res.status(201).json({ ok: true });
});

app.patch("/api/complaints/:id/status", async (req, res) => {
  await pool.query("UPDATE complaints SET complaint_status = ?, updated_at = CURDATE() WHERE id = ?", [req.body.status, req.params.id]);
  res.json({ ok: true });
});

app.get("/api/notices", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM notices ORDER BY created_at DESC");
  res.json(rows.map((r) => ({ ...r, createdAt: r.created_at })));
});

app.post("/api/notices", async (req, res) => {
  const b = req.body;
  await pool.query(
    "INSERT INTO notices (id, title, content, priority, author, created_at) VALUES (?, ?, ?, ?, ?, CURDATE())",
    [b.id, b.title, b.content, b.priority || "normal", b.author || "Admin"]
  );
  res.status(201).json({ ok: true });
});

app.get("/api/fees", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM fee_records ORDER BY due_date DESC");
  res.json(
    rows.map((r) => ({
      id: r.id,
      studentId: r.student_id,
      studentName: r.student_name_snapshot,
      roomNumber: r.room_number_snapshot,
      amount: Number(r.amount),
      dueDate: r.due_date,
      paidDate: r.paid_date,
      status: r.fee_status,
      month: r.fee_month_label,
    }))
  );
});

app.get("/api/attendance", async (req, res) => {
  const date = req.query.date || new Date().toISOString().split("T")[0];
  const [rows] = await pool.query(
    `SELECT s.id, s.full_name AS studentName, s.room_number AS roomNumber, s.course,
            COALESCE(a.attendance_status, 'present') AS status
     FROM students s
     LEFT JOIN attendance_records a ON a.student_id = s.id AND a.attendance_date = ?
     ORDER BY s.id`,
    [date]
  );
  res.json({ date, records: rows });
});

app.post("/api/attendance", async (req, res) => {
  const { date, records } = req.body;
  for (const row of records) {
    await pool.query(
      `INSERT INTO attendance_records (student_id, student_name_snapshot, room_number_snapshot, attendance_date, attendance_status)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE attendance_status = VALUES(attendance_status), marked_at = CURRENT_TIMESTAMP`,
      [row.studentId, row.studentName, row.roomNumber, date, row.status]
    );
  }
  res.json({ ok: true });
});

app.get("/api/mess", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM mess_menu ORDER BY FIELD(day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')");
  res.json(rows);
});

app.get("/api/dashboard", async (_req, res) => {
  const [[studentCount]] = await pool.query("SELECT COUNT(*) AS c FROM students");
  const [[roomCount]] = await pool.query("SELECT COUNT(*) AS c FROM rooms");
  const [[beds]] = await pool.query("SELECT SUM(capacity) AS cap, SUM(occupied) AS occ FROM rooms");
  const [[pendingFees]] = await pool.query("SELECT IFNULL(SUM(amount), 0) AS total FROM fee_records WHERE fee_status IN ('pending','overdue')");
  const [[openComplaints]] = await pool.query("SELECT COUNT(*) AS c FROM complaints WHERE complaint_status IN ('open','in-progress')");
  const [[noticeCount]] = await pool.query("SELECT COUNT(*) AS c FROM notices");
  const [monthly] = await pool.query("SELECT month_label AS month, collected, pending FROM monthly_fee_summary ORDER BY display_order");

  res.json({
    stats: {
      totalStudents: studentCount.c,
      totalRooms: roomCount.c,
      occupancyRate: beds.cap ? Math.round((beds.occ / beds.cap) * 100) : 0,
      pendingFees: Number(pendingFees.total),
      openComplaints: openComplaints.c,
      totalNotices: noticeCount.c,
    },
    monthlyFeeData: monthly,
    occupancyData: [
      { name: "Occupied", value: Number(beds.occ || 0), fill: "hsl(var(--chart-1))" },
      { name: "Available", value: Number((beds.cap || 0) - (beds.occ || 0)), fill: "hsl(var(--chart-2))" },
      { name: "Maintenance", value: 0, fill: "hsl(var(--chart-3))" },
    ],
  });
});

app.get("/api/reports/:type", async (req, res) => {
  const map = {
    students: "SELECT * FROM students ORDER BY id",
    rooms: "SELECT * FROM rooms ORDER BY room_number",
    fees: "SELECT * FROM fee_records ORDER BY due_date DESC",
    attendance: "SELECT * FROM attendance_records ORDER BY attendance_date DESC",
  };
  const q = map[req.params.type];
  if (!q) return res.status(404).json({ message: "Unknown report type" });
  const [rows] = await pool.query(q);
  res.json(rows);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
