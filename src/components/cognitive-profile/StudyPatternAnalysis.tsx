
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";

interface StudyPatternAnalysisProps {
  data: Array<{
    time: string;
    effectiveness: number;
    retention: number;
  }>;
}

const StudyPatternAnalysis = ({ data }: StudyPatternAnalysisProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Study Pattern Analysis</CardTitle>
        <CardDescription>Optimal study times based on your learning patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ChartContainer
            config={{
              effectiveness: { label: "Effectiveness", theme: { light: "#3b82f6", dark: "#60a5fa" } },
              retention: { label: "Retention", theme: { light: "#8b5cf6", dark: "#a78bfa" } }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="effectiveness" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }}
                  name="Effectiveness"
                />
                <Line 
                  type="monotone" 
                  dataKey="retention" 
                  stroke="#8b5cf6" 
                  name="Retention"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyPatternAnalysis;
