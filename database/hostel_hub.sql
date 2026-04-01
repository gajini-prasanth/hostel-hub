-- Hostel Hub database schema + seed data
-- Target: MySQL / MariaDB

-- Step 0: create and select database.
CREATE DATABASE IF NOT EXISTS hostel_hub;
USE hostel_hub;

START TRANSACTION;

-- =========================
-- 1) MASTER TABLES
-- =========================

CREATE TABLE IF NOT EXISTS rooms (
  id              VARCHAR(10) PRIMARY KEY,
  room_number     VARCHAR(10) NOT NULL UNIQUE,
  room_type       VARCHAR(10) NOT NULL CHECK (room_type IN ('single', 'double', 'shared')),
  capacity        INTEGER NOT NULL CHECK (capacity > 0),
  occupied        INTEGER NOT NULL CHECK (occupied >= 0 AND occupied <= capacity),
  floor           INTEGER NOT NULL CHECK (floor > 0),
  room_status     VARCHAR(20) NOT NULL CHECK (room_status IN ('available', 'full', 'maintenance')),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id                  VARCHAR(10) PRIMARY KEY,
  full_name           VARCHAR(120) NOT NULL,
  email               VARCHAR(160) NOT NULL UNIQUE,
  phone               VARCHAR(20) NOT NULL,
  course              VARCHAR(120) NOT NULL,
  academic_year       INTEGER NOT NULL CHECK (academic_year BETWEEN 1 AND 8),
  room_number         VARCHAR(10) NOT NULL,
  parent_name         VARCHAR(120) NOT NULL,
  parent_phone        VARCHAR(20) NOT NULL,
  fee_status          VARCHAR(20) NOT NULL CHECK (fee_status IN ('paid', 'pending', 'overdue')),
  photo_url           TEXT,
  join_date           DATE NOT NULL,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_students_room
    FOREIGN KEY (room_number) REFERENCES rooms(room_number)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
);

-- =========================
-- 2) OPERATIONAL TABLES
-- =========================

CREATE TABLE IF NOT EXISTS complaints (
  id                      VARCHAR(10) PRIMARY KEY,
  student_id              VARCHAR(10) NOT NULL,
  student_name_snapshot   VARCHAR(120),
  room_number_snapshot    VARCHAR(10),
  category                VARCHAR(80) NOT NULL,
  subject                 VARCHAR(200) NOT NULL,
  description             TEXT NOT NULL,
  priority                VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  complaint_status        VARCHAR(20) NOT NULL CHECK (complaint_status IN ('open', 'in-progress', 'resolved')),
  created_at              DATE NOT NULL,
  updated_at              DATE NOT NULL,
  CONSTRAINT fk_complaints_student
    FOREIGN KEY (student_id) REFERENCES students(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT fk_complaints_room_snapshot
    FOREIGN KEY (room_number_snapshot) REFERENCES rooms(room_number)
      ON UPDATE CASCADE
      ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notices (
  id                  VARCHAR(10) PRIMARY KEY,
  title               VARCHAR(200) NOT NULL,
  content             TEXT NOT NULL,
  priority            VARCHAR(20) NOT NULL CHECK (priority IN ('normal', 'important', 'urgent')),
  author              VARCHAR(120) NOT NULL,
  created_at          DATE NOT NULL,
  created_ts          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_records (
  id                      VARCHAR(10) PRIMARY KEY,
  student_id              VARCHAR(10) NOT NULL,
  student_name_snapshot   VARCHAR(120),
  room_number_snapshot    VARCHAR(10),
  amount                  NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  due_date                DATE NOT NULL,
  paid_date               DATE,
  fee_status              VARCHAR(20) NOT NULL CHECK (fee_status IN ('paid', 'pending', 'overdue')),
  fee_month_label         VARCHAR(30) NOT NULL,
  created_at              TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_fees_student
    FOREIGN KEY (student_id) REFERENCES students(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT fk_fees_room_snapshot
    FOREIGN KEY (room_number_snapshot) REFERENCES rooms(room_number)
      ON UPDATE CASCADE
      ON DELETE SET NULL,
  CONSTRAINT ck_fee_paid_date
    CHECK ((fee_status = 'paid' AND paid_date IS NOT NULL) OR (fee_status <> 'paid'))
);

CREATE TABLE IF NOT EXISTS attendance_records (
  id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id              VARCHAR(10) NOT NULL,
  student_name_snapshot   VARCHAR(120),
  room_number_snapshot    VARCHAR(10),
  attendance_date         DATE NOT NULL,
  attendance_status       VARCHAR(10) NOT NULL CHECK (attendance_status IN ('present', 'absent', 'leave')),
  marked_at               TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attendance_student
    FOREIGN KEY (student_id) REFERENCES students(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  CONSTRAINT fk_attendance_room_snapshot
    FOREIGN KEY (room_number_snapshot) REFERENCES rooms(room_number)
      ON UPDATE CASCADE
      ON DELETE SET NULL,
  CONSTRAINT uq_attendance_student_date UNIQUE (student_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS mess_menu (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  day_of_week     VARCHAR(10) NOT NULL UNIQUE CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  breakfast       VARCHAR(255) NOT NULL,
  lunch           VARCHAR(255) NOT NULL,
  dinner          VARCHAR(255) NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Dashboard chart persistence (optional, based on current mock chart data).
CREATE TABLE IF NOT EXISTS monthly_fee_summary (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  month_label     VARCHAR(10) NOT NULL UNIQUE,
  collected       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  pending         NUMERIC(12, 2) NOT NULL DEFAULT 0,
  display_order   INTEGER NOT NULL UNIQUE CHECK (display_order > 0)
);

-- =========================
-- 3) INDEXES
-- =========================

CREATE INDEX IF NOT EXISTS idx_students_room_number ON students(room_number);
CREATE INDEX IF NOT EXISTS idx_students_fee_status ON students(fee_status);
CREATE INDEX IF NOT EXISTS idx_complaints_student_id ON complaints(student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(complaint_status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_fee_records_student_id ON fee_records(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_records_status ON fee_records(fee_status);
CREATE INDEX IF NOT EXISTS idx_fee_records_due_date ON fee_records(due_date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(attendance_date);

-- =========================
-- 4) SEED DATA (from src/data/mockData.ts + src/pages/Mess.tsx)
-- =========================

INSERT IGNORE INTO rooms (id, room_number, room_type, capacity, occupied, floor, room_status)
VALUES
  ('R001', '101', 'double', 2, 1, 1, 'available'),
  ('R002', '102', 'double', 2, 2, 1, 'full'),
  ('R003', '103', 'single', 1, 1, 1, 'full'),
  ('R004', '201', 'shared', 4, 2, 2, 'available'),
  ('R005', '202', 'double', 2, 1, 2, 'available'),
  ('R006', '203', 'single', 1, 1, 2, 'full'),
  ('R007', '301', 'shared', 4, 1, 3, 'available'),
  ('R008', '302', 'double', 2, 1, 3, 'available'),
  ('R009', '303', 'single', 1, 0, 3, 'available'),
  ('R010', '304', 'double', 2, 0, 3, 'maintenance')
;

INSERT IGNORE INTO students (
  id, full_name, email, phone, course, academic_year, room_number,
  parent_name, parent_phone, fee_status, photo_url, join_date
)
VALUES
  ('S001', 'Aarav Sharma', 'aarav@univ.edu', '9876543210', 'B.Tech CS', 2, '101', 'Raj Sharma', '9876543211', 'paid', NULL, '2024-08-15'),
  ('S002', 'Priya Patel', 'priya@univ.edu', '9876543220', 'B.Tech ECE', 3, '102', 'Suresh Patel', '9876543221', 'pending', NULL, '2023-08-10'),
  ('S003', 'Rohan Gupta', 'rohan@univ.edu', '9876543230', 'BBA', 1, '103', 'Anand Gupta', '9876543231', 'paid', NULL, '2025-08-01'),
  ('S004', 'Sneha Reddy', 'sneha@univ.edu', '9876543240', 'B.Tech IT', 2, '201', 'Vikram Reddy', '9876543241', 'overdue', NULL, '2024-08-15'),
  ('S005', 'Karan Singh', 'karan@univ.edu', '9876543250', 'B.Sc Physics', 4, '202', 'Harpreet Singh', '9876543251', 'paid', NULL, '2022-08-12'),
  ('S006', 'Ananya Joshi', 'ananya@univ.edu', '9876543260', 'B.Tech CS', 1, '203', 'Deepak Joshi', '9876543261', 'pending', NULL, '2025-08-01'),
  ('S007', 'Vikash Kumar', 'vikash@univ.edu', '9876543270', 'MBA', 2, '301', 'Ramesh Kumar', '9876543271', 'paid', NULL, '2024-08-15'),
  ('S008', 'Meera Nair', 'meera@univ.edu', '9876543280', 'B.Tech ME', 3, '302', 'Sunil Nair', '9876543281', 'paid', NULL, '2023-08-10')
;

INSERT IGNORE INTO complaints (
  id, student_id, student_name_snapshot, room_number_snapshot, category, subject, description,
  priority, complaint_status, created_at, updated_at
)
VALUES
  ('C001', 'S001', 'Aarav Sharma', '101', 'Plumbing', 'Leaking tap', 'Bathroom tap is leaking constantly', 'high', 'open', '2026-03-28', '2026-03-28'),
  ('C002', 'S004', 'Sneha Reddy', '201', 'Electrical', 'Fan not working', 'Ceiling fan stopped working yesterday', 'medium', 'in-progress', '2026-03-25', '2026-03-29'),
  ('C003', 'S006', 'Ananya Joshi', '203', 'Furniture', 'Broken chair', 'Study chair arm rest is broken', 'low', 'resolved', '2026-03-20', '2026-03-22'),
  ('C004', 'S002', 'Priya Patel', '102', 'Internet', 'Slow WiFi', 'WiFi speed extremely slow in room', 'medium', 'open', '2026-03-30', '2026-03-30')
;

INSERT IGNORE INTO notices (id, title, content, priority, author, created_at)
VALUES
  ('N001', 'Hostel Fee Due Date Extended', 'The last date for hostel fee payment has been extended to April 15, 2026. Students are requested to clear their dues before the deadline.', 'important', 'Admin', '2026-03-28'),
  ('N002', 'Water Supply Maintenance', 'Water supply will be interrupted on April 5, 2026 from 10 AM to 2 PM due to tank cleaning. Please store water accordingly.', 'urgent', 'Warden', '2026-03-30'),
  ('N003', 'Sports Tournament Registration', 'Inter-hostel sports tournament registrations are now open. Interested students can register at the warden office.', 'normal', 'Admin', '2026-03-25'),
  ('N004', 'New Mess Menu', 'The revised mess menu for April 2026 is now available. Check the mess notice board for details.', 'normal', 'Mess Committee', '2026-03-29')
;

INSERT IGNORE INTO fee_records (
  id, student_id, student_name_snapshot, room_number_snapshot, amount, due_date, paid_date, fee_status, fee_month_label
)
VALUES
  ('F001', 'S001', 'Aarav Sharma', '101', 5000, '2026-03-31', '2026-03-20', 'paid', 'March 2026'),
  ('F002', 'S002', 'Priya Patel', '102', 5000, '2026-03-31', NULL, 'pending', 'March 2026'),
  ('F003', 'S003', 'Rohan Gupta', '103', 6000, '2026-03-31', '2026-03-15', 'paid', 'March 2026'),
  ('F004', 'S004', 'Sneha Reddy', '201', 4000, '2026-02-28', NULL, 'overdue', 'February 2026'),
  ('F005', 'S005', 'Karan Singh', '202', 5000, '2026-03-31', '2026-03-25', 'paid', 'March 2026'),
  ('F006', 'S006', 'Ananya Joshi', '203', 6000, '2026-03-31', NULL, 'pending', 'March 2026'),
  ('F007', 'S007', 'Vikash Kumar', '301', 4000, '2026-03-31', '2026-03-28', 'paid', 'March 2026'),
  ('F008', 'S008', 'Meera Nair', '302', 5000, '2026-03-31', '2026-03-30', 'paid', 'March 2026')
;

-- Attendance sample records generated for 2026-04-01.
INSERT IGNORE INTO attendance_records (student_id, student_name_snapshot, room_number_snapshot, attendance_date, attendance_status)
VALUES
  ('S001', 'Aarav Sharma', '101', '2026-04-01', 'present'),
  ('S002', 'Priya Patel', '102', '2026-04-01', 'present'),
  ('S003', 'Rohan Gupta', '103', '2026-04-01', 'present'),
  ('S004', 'Sneha Reddy', '201', '2026-04-01', 'present'),
  ('S005', 'Karan Singh', '202', '2026-04-01', 'present'),
  ('S006', 'Ananya Joshi', '203', '2026-04-01', 'present'),
  ('S007', 'Vikash Kumar', '301', '2026-04-01', 'present'),
  ('S008', 'Meera Nair', '302', '2026-04-01', 'present')
;

INSERT IGNORE INTO mess_menu (day_of_week, breakfast, lunch, dinner)
VALUES
  ('Monday', 'Poha, Tea', 'Dal Rice, Salad', 'Paneer Butter Masala, Roti'),
  ('Tuesday', 'Idli Sambhar', 'Chole Rice, Raita', 'Mix Veg, Roti'),
  ('Wednesday', 'Paratha, Curd', 'Rajma Rice', 'Dal Makhani, Roti'),
  ('Thursday', 'Upma, Tea', 'Kadhi Rice', 'Aloo Gobi, Roti'),
  ('Friday', 'Bread Omelette', 'Dal Fry Rice', 'Malai Kofta, Roti'),
  ('Saturday', 'Dosa, Chutney', 'Biryani, Raita', 'Pav Bhaji'),
  ('Sunday', 'Chole Bhature', 'Special Thali', 'Pulao, Dal')
;

INSERT IGNORE INTO monthly_fee_summary (month_label, collected, pending, display_order)
VALUES
  ('Oct', 35000, 5000, 1),
  ('Nov', 38000, 2000, 2),
  ('Dec', 32000, 8000, 3),
  ('Jan', 40000, 0, 4),
  ('Feb', 36000, 4000, 5),
  ('Mar', 30000, 10000, 6)
;

COMMIT;
