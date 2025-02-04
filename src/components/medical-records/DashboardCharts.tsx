import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface ChartData {
  date: string;
  total: number;
  pending: number;
  positive: number;
  negative: number;
}

interface DashboardChartsProps {
  records: any[];
}

export const DashboardCharts = ({ records }: DashboardChartsProps) => {
  const [visibleLines, setVisibleLines] = useState({
    total: true,
    pending: true,
    positive: true,
    negative: true,
  });

  // Process records to get monthly data
  const getMonthlyData = () => {
    const monthlyData: { [key: string]: ChartData } = {};
    
    records?.forEach((record) => {
      const date = new Date(record.investigation_date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          date: monthYear,
          total: 0,
          pending: 0,
          positive: 0,
          negative: 0,
        };
      }
      
      monthlyData[monthYear].total += 1;
      
      if (!record.result) {
        monthlyData[monthYear].pending += 1;
      } else if (record.result === "Positif") {
        monthlyData[monthYear].positive += 1;
      } else if (record.result === "Négatif") {
        monthlyData[monthYear].negative += 1;
      }
    });

    return Object.values(monthlyData);
  };

  const chartData = getMonthlyData();

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({
      ...prev,
      [line]: !prev[line]
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Évolution des cas</h3>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {visibleLines.total && (
                <Line
                  type="monotone"
                  name="Tous les status"
                  dataKey="total"
                  stroke="#9b87f5"
                  strokeWidth={2}
                  dot={{ fill: "#9b87f5" }}
                />
              )}
              {visibleLines.pending && (
                <Line
                  type="monotone"
                  name="En attente"
                  dataKey="pending"
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={{ fill: "#F97316" }}
                />
              )}
              {visibleLines.positive && (
                <Line
                  type="monotone"
                  name="Positif"
                  dataKey="positive"
                  stroke="#ea384c"
                  strokeWidth={2}
                  dot={{ fill: "#ea384c" }}
                />
              )}
              {visibleLines.negative && (
                <Line
                  type="monotone"
                  name="Négatif"
                  dataKey="negative"
                  stroke="#58BB43"
                  strokeWidth={2}
                  dot={{ fill: "#58BB43" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <Toggle 
            pressed={visibleLines.total}
            onPressedChange={() => toggleLine('total')}
            className={cn(
              "h-7 px-2 text-xs",
              "data-[state=on]:bg-[#9b87f5] data-[state=on]:text-white"
            )}
          >
            Tous les status
          </Toggle>
          <Toggle 
            pressed={visibleLines.pending}
            onPressedChange={() => toggleLine('pending')}
            className={cn(
              "h-7 px-2 text-xs",
              "data-[state=on]:bg-[#F97316] data-[state=on]:text-white"
            )}
          >
            En attente
          </Toggle>
          <Toggle 
            pressed={visibleLines.positive}
            onPressedChange={() => toggleLine('positive')}
            className={cn(
              "h-7 px-2 text-xs",
              "data-[state=on]:bg-[#ea384c] data-[state=on]:text-white"
            )}
          >
            Positif
          </Toggle>
          <Toggle 
            pressed={visibleLines.negative}
            onPressedChange={() => toggleLine('negative')}
            className={cn(
              "h-7 px-2 text-xs",
              "data-[state=on]:bg-[#58BB43] data-[state=on]:text-white"
            )}
          >
            Négatif
          </Toggle>
        </div>
      </div>
    </Card>
  );
};
