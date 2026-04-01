import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Download } from "lucide-react";
import { api } from "@/lib/api";
import type { AttendanceRow } from "@/lib/types";

type AttendanceStatus = "present" | "absent" | "leave";

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  const fetchAttendance = useCallback(async () => {
    const data = await api.get<{ date: string; records: AttendanceRow[] }>(`/attendance?date=${today}`);
    setRows(data.records);
    setAttendance(Object.fromEntries(data.records.map((s) => [s.id, s.status])));
  }, [today]);

  useEffect(() => {
    fetchAttendance().catch((e) => console.error(e));
  }, [fetchAttendance]);

  const toggleStatus = (studentId: string) => {
    setAttendance((prev) => {
      const order: AttendanceStatus[] = ["present", "absent", "leave"];
      const current = order.indexOf(prev[studentId]);
      return { ...prev, [studentId]: order[(current + 1) % 3] };
    });
  };

  const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
    present: "secondary",
    absent: "destructive",
    leave: "default",
  };

  const counts = {
    present: rows.filter((r) => attendance[r.id] === "present").length,
    absent: rows.filter((r) => attendance[r.id] === "absent").length,
    leave: rows.filter((r) => attendance[r.id] === "leave").length,
  };

  const saveAttendance = async () => {
    await api.post("/attendance", {
      date: today,
      records: rows.map((r) => ({
        studentId: r.id,
        studentName: r.studentName,
        roomNumber: r.roomNumber,
        status: attendance[r.id] || "present",
      })),
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-description">Mark daily attendance — {today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button onClick={saveAttendance}><CalendarCheck className="h-4 w-4 mr-2" />Save Attendance</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Present</p><p className="text-2xl font-bold text-success">{counts.present}</p></CardContent></Card>
        <Card className="shadow-sm"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Absent</p><p className="text-2xl font-bold text-destructive">{counts.absent}</p></CardContent></Card>
        <Card className="shadow-sm"><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">On Leave</p><p className="text-2xl font-bold text-warning">{counts.leave}</p></CardContent></Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Room</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.studentName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{s.roomNumber}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{s.course}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariant[attendance[s.id]]}
                      className="cursor-pointer select-none"
                      onClick={() => toggleStatus(s.id)}
                    >
                      {attendance[s.id]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
