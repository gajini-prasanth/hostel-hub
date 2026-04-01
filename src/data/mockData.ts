export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  roomNumber: string;
  parentName: string;
  parentPhone: string;
  feeStatus: "paid" | "pending" | "overdue";
  photo?: string;
  joinDate: string;
}

export interface Room {
  id: string;
  number: string;
  type: "single" | "double" | "shared";
  capacity: number;
  occupied: number;
  floor: number;
  status: "available" | "full" | "maintenance";
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "important" | "urgent";
  author: string;
  createdAt: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
  month: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  date: string;
  status: "present" | "absent" | "leave";
}

export const students: Student[] = [
  { id: "S001", name: "Aarav Sharma", email: "aarav@univ.edu", phone: "9876543210", course: "B.Tech CS", year: 2, roomNumber: "101", parentName: "Raj Sharma", parentPhone: "9876543211", feeStatus: "paid", joinDate: "2024-08-15" },
  { id: "S002", name: "Priya Patel", email: "priya@univ.edu", phone: "9876543220", course: "B.Tech ECE", year: 3, roomNumber: "102", parentName: "Suresh Patel", parentPhone: "9876543221", feeStatus: "pending", joinDate: "2023-08-10" },
  { id: "S003", name: "Rohan Gupta", email: "rohan@univ.edu", phone: "9876543230", course: "BBA", year: 1, roomNumber: "103", parentName: "Anand Gupta", parentPhone: "9876543231", feeStatus: "paid", joinDate: "2025-08-01" },
  { id: "S004", name: "Sneha Reddy", email: "sneha@univ.edu", phone: "9876543240", course: "B.Tech IT", year: 2, roomNumber: "201", parentName: "Vikram Reddy", parentPhone: "9876543241", feeStatus: "overdue", joinDate: "2024-08-15" },
  { id: "S005", name: "Karan Singh", email: "karan@univ.edu", phone: "9876543250", course: "B.Sc Physics", year: 4, roomNumber: "202", parentName: "Harpreet Singh", parentPhone: "9876543251", feeStatus: "paid", joinDate: "2022-08-12" },
  { id: "S006", name: "Ananya Joshi", email: "ananya@univ.edu", phone: "9876543260", course: "B.Tech CS", year: 1, roomNumber: "203", parentName: "Deepak Joshi", parentPhone: "9876543261", feeStatus: "pending", joinDate: "2025-08-01" },
  { id: "S007", name: "Vikash Kumar", email: "vikash@univ.edu", phone: "9876543270", course: "MBA", year: 2, roomNumber: "301", parentName: "Ramesh Kumar", parentPhone: "9876543271", feeStatus: "paid", joinDate: "2024-08-15" },
  { id: "S008", name: "Meera Nair", email: "meera@univ.edu", phone: "9876543280", course: "B.Tech ME", year: 3, roomNumber: "302", parentName: "Sunil Nair", parentPhone: "9876543281", feeStatus: "paid", joinDate: "2023-08-10" },
];

export const rooms: Room[] = [
  { id: "R001", number: "101", type: "double", capacity: 2, occupied: 1, floor: 1, status: "available" },
  { id: "R002", number: "102", type: "double", capacity: 2, occupied: 2, floor: 1, status: "full" },
  { id: "R003", number: "103", type: "single", capacity: 1, occupied: 1, floor: 1, status: "full" },
  { id: "R004", number: "201", type: "shared", capacity: 4, occupied: 2, floor: 2, status: "available" },
  { id: "R005", number: "202", type: "double", capacity: 2, occupied: 1, floor: 2, status: "available" },
  { id: "R006", number: "203", type: "single", capacity: 1, occupied: 1, floor: 2, status: "full" },
  { id: "R007", number: "301", type: "shared", capacity: 4, occupied: 1, floor: 3, status: "available" },
  { id: "R008", number: "302", type: "double", capacity: 2, occupied: 1, floor: 3, status: "available" },
  { id: "R009", number: "303", type: "single", capacity: 1, occupied: 0, floor: 3, status: "available" },
  { id: "R010", number: "304", type: "double", capacity: 2, occupied: 0, floor: 3, status: "maintenance" },
];

export const complaints: Complaint[] = [
  { id: "C001", studentId: "S001", studentName: "Aarav Sharma", roomNumber: "101", category: "Plumbing", subject: "Leaking tap", description: "Bathroom tap is leaking constantly", priority: "high", status: "open", createdAt: "2026-03-28", updatedAt: "2026-03-28" },
  { id: "C002", studentId: "S004", studentName: "Sneha Reddy", roomNumber: "201", category: "Electrical", subject: "Fan not working", description: "Ceiling fan stopped working yesterday", priority: "medium", status: "in-progress", createdAt: "2026-03-25", updatedAt: "2026-03-29" },
  { id: "C003", studentId: "S006", studentName: "Ananya Joshi", roomNumber: "203", category: "Furniture", subject: "Broken chair", description: "Study chair arm rest is broken", priority: "low", status: "resolved", createdAt: "2026-03-20", updatedAt: "2026-03-22" },
  { id: "C004", studentId: "S002", studentName: "Priya Patel", roomNumber: "102", category: "Internet", subject: "Slow WiFi", description: "WiFi speed extremely slow in room", priority: "medium", status: "open", createdAt: "2026-03-30", updatedAt: "2026-03-30" },
];

export const notices: Notice[] = [
  { id: "N001", title: "Hostel Fee Due Date Extended", content: "The last date for hostel fee payment has been extended to April 15, 2026. Students are requested to clear their dues before the deadline.", priority: "important", author: "Admin", createdAt: "2026-03-28" },
  { id: "N002", title: "Water Supply Maintenance", content: "Water supply will be interrupted on April 5, 2026 from 10 AM to 2 PM due to tank cleaning. Please store water accordingly.", priority: "urgent", author: "Warden", createdAt: "2026-03-30" },
  { id: "N003", title: "Sports Tournament Registration", content: "Inter-hostel sports tournament registrations are now open. Interested students can register at the warden office.", priority: "normal", author: "Admin", createdAt: "2026-03-25" },
  { id: "N004", title: "New Mess Menu", content: "The revised mess menu for April 2026 is now available. Check the mess notice board for details.", priority: "normal", author: "Mess Committee", createdAt: "2026-03-29" },
];

export const feeRecords: FeeRecord[] = [
  { id: "F001", studentId: "S001", studentName: "Aarav Sharma", roomNumber: "101", amount: 5000, dueDate: "2026-03-31", paidDate: "2026-03-20", status: "paid", month: "March 2026" },
  { id: "F002", studentId: "S002", studentName: "Priya Patel", roomNumber: "102", amount: 5000, dueDate: "2026-03-31", status: "pending", month: "March 2026" },
  { id: "F003", studentId: "S003", studentName: "Rohan Gupta", roomNumber: "103", amount: 6000, dueDate: "2026-03-31", paidDate: "2026-03-15", status: "paid", month: "March 2026" },
  { id: "F004", studentId: "S004", studentName: "Sneha Reddy", roomNumber: "201", amount: 4000, dueDate: "2026-02-28", status: "overdue", month: "February 2026" },
  { id: "F005", studentId: "S005", studentName: "Karan Singh", roomNumber: "202", amount: 5000, dueDate: "2026-03-31", paidDate: "2026-03-25", status: "paid", month: "March 2026" },
  { id: "F006", studentId: "S006", studentName: "Ananya Joshi", roomNumber: "203", amount: 6000, dueDate: "2026-03-31", status: "pending", month: "March 2026" },
  { id: "F007", studentId: "S007", studentName: "Vikash Kumar", roomNumber: "301", amount: 4000, dueDate: "2026-03-31", paidDate: "2026-03-28", status: "paid", month: "March 2026" },
  { id: "F008", studentId: "S008", studentName: "Meera Nair", roomNumber: "302", amount: 5000, dueDate: "2026-03-31", paidDate: "2026-03-30", status: "paid", month: "March 2026" },
];

export const dashboardStats = {
  totalStudents: 8,
  totalRooms: 10,
  occupancyRate: 75,
  pendingFees: 15000,
  openComplaints: 2,
  totalNotices: 4,
};

export const monthlyFeeData = [
  { month: "Oct", collected: 35000, pending: 5000 },
  { month: "Nov", collected: 38000, pending: 2000 },
  { month: "Dec", collected: 32000, pending: 8000 },
  { month: "Jan", collected: 40000, pending: 0 },
  { month: "Feb", collected: 36000, pending: 4000 },
  { month: "Mar", collected: 30000, pending: 10000 },
];

export const occupancyData = [
  { name: "Occupied", value: 10, fill: "hsl(var(--chart-1))" },
  { name: "Available", value: 5, fill: "hsl(var(--chart-2))" },
  { name: "Maintenance", value: 1, fill: "hsl(var(--chart-3))" },
];
