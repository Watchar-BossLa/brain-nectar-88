
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { IncomeStatementItem } from '../types';

interface IncomeStatementTableProps {
  incomeItems: IncomeStatementItem[];
  removeIncomeItem: (id: string) => void;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

const IncomeStatementTable: React.FC<IncomeStatementTableProps> = ({
  incomeItems,
  removeIncomeItem,
  totalRevenue,
  totalExpenses,
  netIncome
}) => {
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Revenue & Expenses</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Revenue Section */}
          <TableRow className="bg-muted/20">
            <TableCell colSpan={5} className="font-medium">Revenue</TableCell>
          </TableRow>
          {incomeItems
            .filter(item => item.category === 'revenue')
            .map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>Revenue</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeIncomeItem(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="font-medium">Total Revenue</TableCell>
            <TableCell className="text-right font-medium">${totalRevenue.toLocaleString()}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Expenses Section */}
          <TableRow className="bg-muted/20">
            <TableCell colSpan={5} className="font-medium">Expenses</TableCell>
          </TableRow>
          {incomeItems
            .filter(item => item.category === 'expense')
            .map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>Expense</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeIncomeItem(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="font-medium">Total Expenses</TableCell>
            <TableCell className="text-right font-medium">${totalExpenses.toLocaleString()}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Net Income */}
          <TableRow className="font-medium">
            <TableCell colSpan={3} className="text-base">Net Income</TableCell>
            <TableCell className={`text-right text-base ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default IncomeStatementTable;
