
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { CashFlowItem } from '../types';

interface CashFlowTableProps {
  cashFlowItems: CashFlowItem[];
  removeCashFlowItem: (id: string) => void;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
}

const CashFlowTable: React.FC<CashFlowTableProps> = ({
  cashFlowItems,
  removeCashFlowItem,
  operatingCashFlow,
  investingCashFlow,
  financingCashFlow,
  netCashFlow
}) => {
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Cash Flow Activities</h3>
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
          {/* Operating Activities */}
          <TableRow className="bg-muted/20">
            <TableCell colSpan={5} className="font-medium">Operating Activities</TableCell>
          </TableRow>
          {cashFlowItems
            .filter(item => item.category === 'operating')
            .map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>Operating</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${item.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeCashFlowItem(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="font-medium">Net Cash from Operating Activities</TableCell>
            <TableCell className={`text-right font-medium ${operatingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${operatingCashFlow.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Investing Activities */}
          <TableRow className="bg-muted/20">
            <TableCell colSpan={5} className="font-medium">Investing Activities</TableCell>
          </TableRow>
          {cashFlowItems
            .filter(item => item.category === 'investing')
            .map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>Investing</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${item.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeCashFlowItem(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="font-medium">Net Cash from Investing Activities</TableCell>
            <TableCell className={`text-right font-medium ${investingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${investingCashFlow.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Financing Activities */}
          <TableRow className="bg-muted/20">
            <TableCell colSpan={5} className="font-medium">Financing Activities</TableCell>
          </TableRow>
          {cashFlowItems
            .filter(item => item.category === 'financing')
            .map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>Financing</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell className={`text-right ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${item.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeCashFlowItem(item.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell colSpan={3} className="font-medium">Net Cash from Financing Activities</TableCell>
            <TableCell className={`text-right font-medium ${financingCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${financingCashFlow.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          
          {/* Net Cash Flow */}
          <TableRow className="font-medium">
            <TableCell colSpan={3} className="text-base">Net Increase/Decrease in Cash</TableCell>
            <TableCell className={`text-right text-base ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netCashFlow.toLocaleString()}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CashFlowTable;
