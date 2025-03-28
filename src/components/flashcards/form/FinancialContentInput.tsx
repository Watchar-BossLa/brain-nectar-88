
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
  const handleFinancialTypeChange = (value: string) => {
    setFinancialType(value as FinancialStatementType);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="financial-type">Financial Statement Type</Label>
        <Select value={financialType} onValueChange={handleFinancialTypeChange}>
          <SelectTrigger id="financial-type">
            <SelectValue placeholder="Select type" />
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
        <label htmlFor="front-content" className="text-sm font-medium">
          Front Side (Question)
        </label>
        <Textarea
          id="front-content"
          value={frontContent}
          onChange={(e) => setFrontContent(e.target.value)}
          placeholder={financialType === 'ratio' 
            ? "What is the Debt-to-Equity ratio of Company X given the following data?"
            : "Create a simple balance sheet based on the following information:"}
          className="min-h-20"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="back-content" className="text-sm font-medium">
          Back Side (Financial Information)
        </label>
        <Textarea
          id="back-content"
          value={backContent}
          onChange={(e) => setBackContent(e.target.value)}
          placeholder={
            financialType === 'balance-sheet' 
              ? "Assets:\n- Cash: $10,000\n- Accounts Receivable: $5,000\n\nLiabilities:\n- Accounts Payable: $3,000\n\nEquity:\n- Common Stock: $12,000"
              : financialType === 'income-statement'
              ? "Revenue: $100,000\nCost of Goods Sold: $60,000\nGross Profit: $40,000\nOperating Expenses: $25,000\nNet Income: $15,000"
              : financialType === 'cash-flow'
              ? "Operating Activities: $25,000\nInvesting Activities: ($15,000)\nFinancing Activities: ($5,000)\nNet Change in Cash: $5,000"
              : "Debt-to-Equity Ratio = Total Liabilities / Shareholders' Equity\nTotal Liabilities: $50,000\nShareholders' Equity: $100,000\nRatio: 0.5"
          }
          className="min-h-20"
        />
      </div>
    </>
  );
};

export default FinancialContentInput;
