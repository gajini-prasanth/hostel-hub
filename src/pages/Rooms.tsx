import { rooms } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, DoorOpen, Users, Wrench } from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  available: { label: "Available", variant: "secondary" },
  full: { label: "Full", variant: "default" },
  maintenance: { label: "Maintenance", variant: "destructive" },
};

const typeIcons: Record<string, string> = {
  single: "👤",
  double: "👥",
  shared: "👨‍👩‍👧‍👦",
};

export default function Rooms() {
  const totalBeds = rooms.reduce((a, r) => a + r.capacity, 0);
  const occupiedBeds = rooms.reduce((a, r) => a + r.occupied, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Rooms</h1>
          <p className="page-description">Manage hostel rooms and bed allocation</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Add Room</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DoorOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Rooms</p>
              <p className="text-lg font-bold">{rooms.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Beds Occupied</p>
              <p className="text-lg font-bold">{occupiedBeds} / {totalBeds}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Under Maintenance</p>
              <p className="text-lg font-bold">{rooms.filter((r) => r.status === "maintenance").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const config = statusConfig[room.status];
          return (
            <Card key={room.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Room {room.number}</CardTitle>
                <Badge variant={config.variant}>{config.label}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">{typeIcons[room.type]} {room.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Floor</span>
                    <span>{room.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Occupancy</span>
                    <span>{room.occupied}/{room.capacity}</span>
                  </div>
                  {/* Occupancy bar */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full transition-all bg-primary"
                      style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                    />
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
