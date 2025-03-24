
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className
}: StatsCardProps) => {
  return (
    <motion.div
      className={cn(
        "rounded-xl p-5 border border-border bg-card",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          
          {trend && trendValue && (
            <div className="flex items-center mt-3">
              <span className={cn(
                "text-xs font-medium px-1.5 py-0.5 rounded",
                trend === 'up' && "bg-green-100 text-green-700",
                trend === 'down' && "bg-red-100 text-red-700",
                trend === 'neutral' && "bg-yellow-100 text-yellow-700",
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
