
import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnsweredQuestion } from '../../types';

interface ConfidencePoint {
  confidence: number;
  accuracy: number;
  count: number;
  topic?: string;
}

export interface ConfidenceAccuracyChartProps {
  data?: ConfidencePoint[] | AnsweredQuestion[];
}

const ConfidenceAccuracyChart: React.FC<ConfidenceAccuracyChartProps> = ({ data = [] }) => {
  // Calculate data from answered questions if needed
  const chartData = useMemo(() => {
    // Check if data is already in the right format
    if (data.length > 0 && 'confidence' in data[0]) {
      return data as ConfidencePoint[];
    }
    
    const answeredQuestions = data as AnsweredQuestion[];
    
    // Process answeredQuestions to create confidence vs accuracy data
    const confidenceMap: Record<string, { correct: number, total: number, topic?: string }> = {};
    
    answeredQuestions.forEach(q => {
      if (!q.confidenceLevel) return;
      
      // Round confidence to the nearest 10 to group similar values
      const confidenceKey = `${Math.round(q.confidenceLevel * 10) * 10}`;
      
      if (!confidenceMap[confidenceKey]) {
        confidenceMap[confidenceKey] = { 
          correct: 0, 
          total: 0, 
          topic: q.topic 
        };
      }
      
      confidenceMap[confidenceKey].total++;
      if (q.isCorrect) {
        confidenceMap[confidenceKey].correct++;
      }
    });
    
    // Convert to chart data format
    return Object.entries(confidenceMap).map(([confidence, data]) => {
      const confidenceValue = parseInt(confidence);
      const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      
      return {
        confidence: confidenceValue,
        accuracy: Math.round(accuracy),
        count: data.total,
        topic: data.topic || 'Unknown'
      };
    });
  }, [data]);

  if (!chartData || chartData.length === 0) {
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
              <Scatter name="Confidence vs Accuracy" data={chartData} fill="#8884d8">
                {chartData.map((entry, index) => (
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
