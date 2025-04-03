import React from 'react';
import { FinancialContentInputProps } from '@/types/components';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FinancialStatementType = 'balance-sheet' | 'income-statement' | 'cash-flow' | 'ratio';

interface FinancialContentInputProps {
  frontContent: string;
  setFrontContent: (value: string) => void;
  backContent: string;
  setBackContent: (value: string) => void;
  financialType: FinancialStatementType;
  setFinancialType: (value: FinancialStatementType) => void;
}

const FinancialContentInput: React.FC<FinancialContentInputProps> = ({
  frontContent,
  setFrontContent,
  backContent,
  setBackContent,
  financialType,
  setFinancialType
}) => {
  return (
    <>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="front-content">Financial Concept Question</Label>
        <Textarea 
          id="front-content"
          placeholder="Enter a question about the financial statement"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="grid w-full gap-3 mt-4">
        <Label htmlFor="financial-type">Financial Statement Type</Label>
        <Select 
          value={financialType} 
          onValueChange={(value: FinancialStatementType) => setFinancialType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select statement type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
            <SelectItem value="income-statement">Income Statement</SelectItem>
            <SelectItem value="cash-flow">Cash Flow Statement</SelectItem>
            <SelectItem value="ratio">Financial Ratios</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid w-full gap-1.5 mt-4">
        <Label htmlFor="back-content">Explanation</Label>
        <Textarea 
          id="back-content"
          placeholder="Enter explanation about the financial concept"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          className="min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground mt-1">
          A {financialType.replace('-', ' ')} visualization will be automatically added
        </p>
      </div>
    </>
  );
};

export default FinancialContentInput;
