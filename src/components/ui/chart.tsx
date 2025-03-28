
import * as React from "react"
import { ChartConfig } from "@/types";

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig;
  children: React.ReactNode;
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChartLegend({
  className,
  children,
  ...props
}: ChartLegendProps) {
  return (
    <div className="flex flex-wrap items-center justify-center mt-4 gap-4" {...props}>
      {children}
    </div>
  )
}

interface ChartLegendContentProps {
  payload?: Array<{
    value: string;
    color: string;
    dataKey: string;
  }>;
}

export function ChartLegendContent({ payload }: ChartLegendContentProps) {
  if (!payload || payload.length === 0) return null;
  
  return (
    <>
      {payload.map((entry, index) => (
        <div key={`legend-item-${index}`} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }} 
          />
          <span className="text-sm">{entry.value}</span>
        </div>
      ))}
    </>
  )
}
