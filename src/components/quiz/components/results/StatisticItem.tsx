
import React, { ReactNode } from 'react';

interface StatisticItemProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

const StatisticItem: React.FC<StatisticItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex flex-col bg-muted/30 rounded-md p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
};

export default StatisticItem;
