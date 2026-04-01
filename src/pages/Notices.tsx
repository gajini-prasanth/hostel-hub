import { notices } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";

const priorityConfig: Record<string, { variant: "default" | "secondary" | "destructive"; label: string }> = {
  normal: { variant: "secondary", label: "Normal" },
  important: { variant: "default", label: "Important" },
  urgent: { variant: "destructive", label: "Urgent" },
};

export default function Notices() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notice Board</h1>
          <p className="page-description">Announcements and alerts</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Post Notice</Button>
      </div>

      <div className="space-y-4">
        {notices.map((n) => {
          const config = priorityConfig[n.priority];
          return (
            <Card key={n.id} className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{n.title}</h3>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">Posted by {n.author} · {n.createdAt}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
