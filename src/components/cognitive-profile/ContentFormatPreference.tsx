
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";

interface ContentFormatPreferenceProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const ContentFormatPreference = ({ data }: ContentFormatPreferenceProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Content Format Preference</CardTitle>
        <CardDescription>Which content types lead to better learning outcomes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ChartContainer
            config={{
              video: { label: "Video", theme: { light: "#f97316", dark: "#fb923c" } },
              interactive: { label: "Interactive", theme: { light: "#8b5cf6", dark: "#a78bfa" } },
              text: { label: "Text", theme: { light: "#3b82f6", dark: "#60a5fa" } },
              audio: { label: "Audio", theme: { light: "#22c55e", dark: "#4ade80" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Effectiveness']} 
                  labelFormatter={(name) => name}
                />
                <Bar 
                  dataKey="value" 
                  fill="#8884d8" 
                  barSize={20}
                  radius={[0, 4, 4, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentFormatPreference;
