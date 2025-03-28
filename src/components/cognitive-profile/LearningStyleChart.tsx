
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface LearningStyleChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const LearningStyleChart = ({ data }: LearningStyleChartProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Learning Style Preference</CardTitle>
        <CardDescription>How you best absorb and retain information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ChartContainer 
            config={{
              visual: { label: "Visual", theme: { light: "#8b5cf6", dark: "#a78bfa" } },
              auditory: { label: "Auditory", theme: { light: "#ec4899", dark: "#f472b6" } },
              reading: { label: "Reading", theme: { light: "#3b82f6", dark: "#60a5fa" } },
              kinesthetic: { label: "Kinesthetic", theme: { light: "#22c55e", dark: "#4ade80" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Preference']} 
                  labelFormatter={(name) => name}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex justify-center">
            <ChartLegend>
              <ChartLegendContent
                payload={data.map((item) => ({
                  value: item.name,
                  color: item.color,
                  dataKey: item.name.toLowerCase()
                }))}
              />
            </ChartLegend>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningStyleChart;
