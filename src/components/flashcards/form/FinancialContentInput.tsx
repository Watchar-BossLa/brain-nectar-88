
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type FinancialStatementType = 'balance-sheet' | 'income-statement' | 'cash-flow' | 'ratio';

interface FinancialContentInputProps {
  frontContent: string;
  setFrontContent: React.Dispatch<React.SetStateAction<string>>;
  backContent: string;
  setBackContent: React.Dispatch<React.SetStateAction<string>>;
  financialType: FinancialStatementType;
  setFinancialType: React.Dispatch<React.SetStateAction<FinancialStatementType>>;
}

const FinancialContentInput: React.FC<FinancialContentInputProps> = ({
  frontContent,
  setFrontContent,
  backContent,
  setBackContent,
  financialType,
  setFinancialType
}) => {
  // Handle type-safe select change
  const handleFinancialTypeChange = (value: string) => {
    setFinancialType(value as FinancialStatementType);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="financial-type">Financial Statement Type</Label>
        <Select value={financialType} onValueChange={handleFinancialTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select financial statement type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
            <SelectItem value="income-statement">Income Statement</SelectItem>
            <SelectItem value="cash-flow">Cash Flow Statement</SelectItem>
            <SelectItem value="ratio">Financial Ratio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="front-content">Question (Front Side)</Label>
        <Textarea
          id="front-content"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          rows={4}
          placeholder="Enter the question or concept description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="back-content">Answer (Back Side)</Label>
        <Textarea
          id="back-content"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          rows={6}
          placeholder="Enter the financial data or explanation"
        />
        <p className="text-sm text-muted-foreground">
          The appropriate financial chart/visualization will be generated based on your data and the selected statement type.
        </p>
      </div>
    </div>
  );
};

export default FinancialContentInput;
