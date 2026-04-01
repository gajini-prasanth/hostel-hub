import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const weeklyMenu = [
  { day: "Monday", breakfast: "Poha, Tea", lunch: "Dal Rice, Salad", dinner: "Paneer Butter Masala, Roti" },
  { day: "Tuesday", breakfast: "Idli Sambhar", lunch: "Chole Rice, Raita", dinner: "Mix Veg, Roti" },
  { day: "Wednesday", breakfast: "Paratha, Curd", lunch: "Rajma Rice", dinner: "Dal Makhani, Roti" },
  { day: "Thursday", breakfast: "Upma, Tea", lunch: "Kadhi Rice", dinner: "Aloo Gobi, Roti" },
  { day: "Friday", breakfast: "Bread Omelette", lunch: "Dal Fry Rice", dinner: "Malai Kofta, Roti" },
  { day: "Saturday", breakfast: "Dosa, Chutney", lunch: "Biryani, Raita", dinner: "Pav Bhaji" },
  { day: "Sunday", breakfast: "Chole Bhature", lunch: "Special Thali", dinner: "Pulao, Dal" },
];

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function Mess() {
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
          <Card key={m.day} className={`shadow-sm ${m.day === today ? "ring-2 ring-primary" : ""}`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">{m.day}</CardTitle>
              {m.day === today && <Badge>Today</Badge>}
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
