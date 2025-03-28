
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
