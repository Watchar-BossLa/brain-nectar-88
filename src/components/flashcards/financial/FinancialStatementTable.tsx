
import React from 'react';

interface FinancialStatementTableProps {
  type: string;
}

export const FinancialStatementTable: React.FC<FinancialStatementTableProps> = ({ type }) => {
  switch (type) {
    case 'balance-sheet':
      return (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Assets</th>
              <th className="text-right py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1">Cash</td><td className="text-right">$10,000</td></tr>
            <tr><td className="py-1">Accounts Receivable</td><td className="text-right">$5,000</td></tr>
            <tr><td className="py-1">Inventory</td><td className="text-right">$15,000</td></tr>
            <tr className="border-t font-medium">
              <td className="py-1">Total Assets</td>
              <td className="text-right">$30,000</td>
            </tr>
          </tbody>
          <thead>
            <tr className="border-b border-t">
              <th className="text-left py-1">Liabilities & Equity</th>
              <th className="text-right py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1">Accounts Payable</td><td className="text-right">$8,000</td></tr>
            <tr><td className="py-1">Notes Payable</td><td className="text-right">$7,000</td></tr>
            <tr><td className="py-1">Owner's Equity</td><td className="text-right">$15,000</td></tr>
            <tr className="border-t font-medium">
              <td className="py-1">Total Liabilities & Equity</td>
              <td className="text-right">$30,000</td>
            </tr>
          </tbody>
        </table>
      );
    case 'income-statement':
      return (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Item</th>
              <th className="text-right py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1">Revenue</td><td className="text-right">$50,000</td></tr>
            <tr><td className="py-1">Cost of Goods Sold</td><td className="text-right">($30,000)</td></tr>
            <tr className="border-t">
              <td className="py-1">Gross Profit</td>
              <td className="text-right">$20,000</td>
            </tr>
            <tr><td className="py-1">Operating Expenses</td><td className="text-right">($12,000)</td></tr>
            <tr className="border-t font-medium">
              <td className="py-1">Net Income</td>
              <td className="text-right">$8,000</td>
            </tr>
          </tbody>
        </table>
      );
    case 'cash-flow':
      return (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Category</th>
              <th className="text-right py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-medium"><td className="py-1">Operating Activities</td><td></td></tr>
            <tr><td className="pl-2 py-1">Net Income</td><td className="text-right">$8,000</td></tr>
            <tr><td className="pl-2 py-1">Depreciation</td><td className="text-right">$2,000</td></tr>
            <tr className="border-t">
              <td className="py-1">Net Cash from Operations</td>
              <td className="text-right">$10,000</td>
            </tr>
            <tr className="font-medium"><td className="py-1">Investing Activities</td><td className="text-right">($5,000)</td></tr>
            <tr className="font-medium"><td className="py-1">Financing Activities</td><td className="text-right">($2,000)</td></tr>
            <tr className="border-t font-medium">
              <td className="py-1">Net Change in Cash</td>
              <td className="text-right">$3,000</td>
            </tr>
          </tbody>
        </table>
      );
    case 'ratio':
      return (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Ratio</th>
              <th className="text-right py-1">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="py-1">Current Ratio</td><td className="text-right">1.5</td></tr>
            <tr><td className="py-1">Debt-to-Equity</td><td className="text-right">0.8</td></tr>
            <tr><td className="py-1">Return on Assets (ROA)</td><td className="text-right">12%</td></tr>
            <tr><td className="py-1">Return on Equity (ROE)</td><td className="text-right">18%</td></tr>
            <tr><td className="py-1">Profit Margin</td><td className="text-right">16%</td></tr>
          </tbody>
        </table>
      );
    default:
      return <div>No visualization available</div>;
  }
};
