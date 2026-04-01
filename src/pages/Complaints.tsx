import { complaints } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const priorityColors: Record<string, string> = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const statusIcons: Record<string, React.ReactNode> = {
  open: <AlertCircle className="h-4 w-4 text-destructive" />,
  "in-progress": <Clock className="h-4 w-4 text-warning" />,
  resolved: <CheckCircle2 className="h-4 w-4 text-success" />,
};

export default function Complaints() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Complaints</h1>
          <p className="page-description">Track and manage student complaints</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />New Complaint</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {(["open", "in-progress", "resolved"] as const).map((status) => (
          <Card key={status} className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              {statusIcons[status]}
              <div>
                <p className="text-xs text-muted-foreground capitalize">{status.replace("-", " ")}</p>
                <p className="text-lg font-bold">{complaints.filter((c) => c.status === status).length}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {complaints.map((c) => (
          <Card key={c.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {statusIcons[c.status]}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm">{c.subject}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[c.priority]}`}>{c.priority}</span>
                      <Badge variant="outline" className="text-xs">{c.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{c.studentName} · Room {c.roomNumber} · {c.createdAt}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">Update</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
