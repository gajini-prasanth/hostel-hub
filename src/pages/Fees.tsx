import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, CheckCircle2, Clock, AlertTriangle, Download } from "lucide-react";
import { api } from "@/lib/api";
import type { FeeRecord } from "@/lib/types";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  paid: "secondary",
  pending: "default",
  overdue: "destructive",
};

export default function Fees() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);

  useEffect(() => {
    api.get<FeeRecord[]>("/fees").then(setFeeRecords).catch((e) => console.error(e));
  }, []);

  const totalCollected = feeRecords.filter((f) => f.status === "paid").reduce((a, f) => a + f.amount, 0);
  const totalPending = feeRecords.filter((f) => f.status !== "paid").reduce((a, f) => a + f.amount, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-description">Track hostel fees and payments</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Report</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Collected</p>
              <p className="text-lg font-bold">₹{totalCollected.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Amount</p>
              <p className="text-lg font-bold">₹{totalPending.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overdue</p>
              <p className="text-lg font-bold">{feeRecords.filter((f) => f.status === "overdue").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="hidden sm:table-cell">Room</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Month</TableHead>
                <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeRecords.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.studentName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{f.roomNumber}</TableCell>
                  <TableCell>₹{f.amount.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{f.month}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{f.dueDate}</TableCell>
                  <TableCell><Badge variant={statusVariant[f.status]}>{f.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
