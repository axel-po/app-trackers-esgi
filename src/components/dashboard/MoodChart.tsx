import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { MoodSummary } from "@/lib/reflection-utils";

interface MoodChartProps {
  moodSummary: MoodSummary[];
}

export function MoodChart({ moodSummary }: MoodChartProps) {
  const totalMoods = moodSummary.reduce((total, mood) => total + mood.value, 0);

  return (
    <Card className="shadow-none border relative" style={{ zIndex: 0 }}>
      <CardHeader>
        <CardTitle>Évolution des Humeurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] mt-4 mx-auto w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={moodSummary}
                cx={160}
                cy={160}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="label"
                isAnimationActive={true}
                label={false}
                labelLine={false}
                className="focus:outline-none"
                style={{ outline: "none" }}
              >
                {moodSummary.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={entry.value === 0 ? 0 : 1}
                    opacity={entry.value === 0 ? 0.3 : 1}
                    style={{ outline: "none" }}
                    className="focus:outline-none"
                  />
                ))}
              </Pie>
              {moodSummary.map((entry, index) => {
                if (entry.value === 0) return null;

                const RADIAN = Math.PI / 180;
                const total = moodSummary.reduce(
                  (sum, item) => sum + item.value,
                  0
                );
                if (total === 0) return null;

                let startAngle = 0;
                let endAngle = 0;
                let currentSum = 0;

                for (let i = 0; i < index; i++) {
                  currentSum += moodSummary[i].value;
                }
                startAngle = (currentSum / total) * 360;
                endAngle = ((currentSum + entry.value) / total) * 360;

                const midAngle = startAngle + (endAngle - startAngle) / 2;

                const cx = 160;
                const cy = 160;

                const radius = 70;

                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    key={`emoji-${index}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-4xl focus:outline-none"
                    style={{
                      outline: "none",
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                  >
                    {entry.emoji}
                  </text>
                );
              })}
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value} entrée${value > 1 ? "s" : ""}`,
                  name,
                ]}
                labelFormatter={() => null}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                position={{ y: 0 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Statistiques sur le dernier mois
          </p>
          <p className="text-sm font-medium mt-1">
            {totalMoods} réflexions enregistrées
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
