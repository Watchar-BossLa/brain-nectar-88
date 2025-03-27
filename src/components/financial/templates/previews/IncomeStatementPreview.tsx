
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getFinancialData } from '../../utils/exportUtils';

interface IncomeStatementPreviewProps {
  templateId: string;
}

const IncomeStatementPreview: React.FC<IncomeStatementPreviewProps> = ({ templateId }) => {
  // This is a placeholder component that should be extended similarly to BalanceSheetPreview
  return (
    <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Sample Company, Inc.</h1>
        <h2 className="text-xl">Income Statement</h2>
        <p className="text-muted-foreground">For the period ending {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="text-center py-10">
        <p>Income Statement Template: {templateId}</p>
        <p className="text-muted-foreground mt-2">
          This preview would show a formatted income statement based on the selected template.
        </p>
      </div>
    </Card>
  );
};

export default IncomeStatementPreview;
