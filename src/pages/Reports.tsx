import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Users, DoorOpen, IndianRupee, CalendarCheck } from "lucide-react";

const reports = [
  { title: "Student List", description: "Complete list of all hostel students with details", icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { title: "Room Occupancy", description: "Room allocation and occupancy status report", icon: DoorOpen, color: "text-success", bg: "bg-success/10" },
  { title: "Fee Collection", description: "Monthly fee collection and pending dues report", icon: IndianRupee, color: "text-warning", bg: "bg-warning/10" },
  { title: "Attendance Report", description: "Student attendance summary and absentee list", icon: CalendarCheck, color: "text-info", bg: "bg-info/10" },
];

export default function Reports() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-description">Generate and export reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reports.map((r) => (
          <Card key={r.title} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-lg ${r.bg} flex items-center justify-center shrink-0`}>
                  <r.icon className={`h-6 w-6 ${r.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5 mr-1.5" />CSV</Button>
                    <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5 mr-1.5" />PDF</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
