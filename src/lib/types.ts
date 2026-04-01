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

export interface AttendanceRow {
  id: string;
  studentName: string;
  roomNumber: string;
  course: string;
  status: "present" | "absent" | "leave";
}

export interface MessMenu {
  id: number;
  day_of_week: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}
