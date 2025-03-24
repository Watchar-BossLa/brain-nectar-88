
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { BalanceSheetItem } from '../types';

interface BalanceSheetTableProps {
  balanceSheetItems: BalanceSheetItem[];
  removeBalanceSheetItem: (id: string) => void;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

const BalanceSheetTable: React.FC<BalanceSheetTableProps> = ({
  balanceSheetItems,
  removeBalanceSheetItem,
  totalAssets,
  totalLiabilities,
  totalEquity
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-medium mb-2">Assets</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balanceSheetItems
              .filter(item => item.category === 'assets')
              .map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBalanceSheetItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell colSpan={2} className="font-medium">Total Assets</TableCell>
              <TableCell className="text-right font-medium">${totalAssets.toLocaleString()}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Liabilities & Equity</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balanceSheetItems
              .filter(item => item.category === 'liabilities')
              .map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBalanceSheetItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell colSpan={2} className="font-medium">Total Liabilities</TableCell>
              <TableCell className="text-right font-medium">${totalLiabilities.toLocaleString()}</TableCell>
              <TableCell></TableCell>
            </TableRow>
            
            {balanceSheetItems
              .filter(item => item.category === 'equity')
              .map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">${item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeBalanceSheetItem(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell colSpan={2} className="font-medium">Total Equity</TableCell>
              <TableCell className="text-right font-medium">${totalEquity.toLocaleString()}</TableCell>
              <TableCell></TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell colSpan={2} className="font-medium">Total Liabilities & Equity</TableCell>
              <TableCell className="text-right font-medium">${(totalLiabilities + totalEquity).toLocaleString()}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BalanceSheetTable;
