import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type { MessMenu } from "@/lib/types";

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function Mess() {
  const [weeklyMenu, setWeeklyMenu] = useState<MessMenu[]>([]);

  useEffect(() => {
    api.get<MessMenu[]>("/mess").then(setWeeklyMenu).catch((e) => console.error(e));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mess Management</h1>
          <p className="page-description">Weekly menu and meal tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {weeklyMenu.map((m) => (
          <Card key={m.id} className={`shadow-sm ${m.day_of_week === today ? "ring-2 ring-primary" : ""}`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">{m.day_of_week}</CardTitle>
              {m.day_of_week === today && <Badge>Today</Badge>}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">🌅 Breakfast</p>
                <p>{m.breakfast}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">☀️ Lunch</p>
                <p>{m.lunch}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">🌙 Dinner</p>
                <p>{m.dinner}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
