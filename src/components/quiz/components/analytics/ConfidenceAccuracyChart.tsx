
import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ConfidencePoint {
  confidence: number;
  accuracy: number;
  count: number;
  topic?: string;
}

interface ConfidenceAccuracyChartProps {
  data: ConfidencePoint[];
}

const ConfidenceAccuracyChart: React.FC<ConfidenceAccuracyChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confidence vs. Accuracy</CardTitle>
          <CardDescription>See how well your confidence matches your actual performance</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No confidence data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence vs. Accuracy</CardTitle>
        <CardDescription>See how well your confidence matches your actual performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                type="number" 
                dataKey="confidence" 
                name="Confidence" 
                unit="%" 
                domain={[0, 100]} 
              />
              <YAxis 
                type="number" 
                dataKey="accuracy" 
                name="Accuracy" 
                unit="%" 
                domain={[0, 100]} 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value, name) => [`${value}%`, name]}
                labelFormatter={() => ''}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded p-2 shadow-sm">
                        <p className="font-medium">{data.topic || 'Topic'}</p>
                        <p className="text-sm">Confidence: {data.confidence}%</p>
                        <p className="text-sm">Accuracy: {data.accuracy}%</p>
                        <p className="text-sm text-muted-foreground">Questions: {data.count}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Confidence vs Accuracy" data={data} fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={0.8}
                  />
                ))}
              </Scatter>
              {/* Ideal line where confidence = accuracy */}
              <Scatter
                name="Ideal"
                data={[{ confidence: 0, accuracy: 0 }, { confidence: 100, accuracy: 100 }]}
                fill="none"
                line={{ stroke: '#ddd', strokeDasharray: '3 3', strokeWidth: 2 }}
                shape={<></>}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceAccuracyChart;
