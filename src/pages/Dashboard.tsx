import { Users, DoorOpen, IndianRupee, MessageSquareWarning, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, monthlyFeeData, complaints, notices, students } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";

const statCards = [
  { label: "Total Students", value: dashboardStats.totalStudents, icon: Users, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Rooms", value: dashboardStats.totalRooms, icon: DoorOpen, color: "text-success", bg: "bg-success/10" },
  { label: "Occupancy Rate", value: `${dashboardStats.occupancyRate}%`, icon: TrendingUp, color: "text-info", bg: "bg-info/10" },
  { label: "Pending Fees", value: `₹${dashboardStats.pendingFees.toLocaleString()}`, icon: IndianRupee, color: "text-warning", bg: "bg-warning/10" },
  { label: "Open Complaints", value: dashboardStats.openComplaints, icon: MessageSquareWarning, color: "text-destructive", bg: "bg-destructive/10" },
  { label: "Active Notices", value: dashboardStats.totalNotices, icon: AlertTriangle, color: "text-primary", bg: "bg-primary/10" },
];

const occupancyPieData = [
  { name: "Occupied", value: 10, color: "hsl(217, 91%, 50%)" },
  { name: "Available", value: 5, color: "hsl(142, 72%, 40%)" },
  { name: "Maintenance", value: 1, color: "hsl(38, 92%, 50%)" },
];

const priorityVariant: Record<string, "default" | "secondary" | "destructive"> = {
  low: "secondary",
  medium: "default",
  high: "destructive",
};

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Overview of hostel management system</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Fee Collection Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyFeeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="pending" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Room Occupancy</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={occupancyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {occupancyPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="px-6 pb-4 flex gap-4 justify-center">
            {occupancyPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Complaints */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {complaints.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium">{c.subject}</p>
                  <p className="text-xs text-muted-foreground">{c.studentName} · Room {c.roomNumber}</p>
                </div>
                <Badge variant={priorityVariant[c.priority]}>{c.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Latest Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notices.slice(0, 3).map((n) => (
              <div key={n.id} className="p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  {n.priority === "urgent" && <Badge variant="destructive">Urgent</Badge>}
                  {n.priority === "important" && <Badge>Important</Badge>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{n.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.createdAt} · {n.author}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
