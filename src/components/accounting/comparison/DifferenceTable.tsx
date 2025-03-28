
import React from 'react';
import { AccountingStandard } from '../types/standards';

interface DifferenceTableProps {
  standards: AccountingStandard[];
}

export const DifferenceTable: React.FC<DifferenceTableProps> = ({ standards }) => {
  return (
    <div className="border rounded-lg p-4 bg-muted/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-2">Aspect</th>
            {standards.map(standard => (
              <th key={standard.id} className="text-left pb-2">{standard.id}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-medium">Framework</td>
            {standards.map(standard => (
              <td key={standard.id} className="py-2">{standard.framework}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium">Category</td>
            {standards.map(standard => (
              <td key={standard.id} className="py-2">{standard.category || 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium">Last Updated</td>
            {standards.map(standard => (
              <td key={standard.id} className="py-2">{standard.lastUpdated || 'N/A'}</td>
            ))}
          </tr>
          <tr>
            <td className="py-2 font-medium">Related Standards</td>
            {standards.map(standard => (
              <td key={standard.id} className="py-2">
                {standard.relatedStandards?.join(', ') || 'None'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
