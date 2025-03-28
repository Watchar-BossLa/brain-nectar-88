
import React from 'react';
import BalanceSheetPreview from './previews/BalanceSheetPreview';
import IncomeStatementPreview from './previews/IncomeStatementPreview';
import CashFlowPreview from './previews/CashFlowPreview';

interface StatementPreviewProps {
  templateId: string;
  statementType: string;
}

const StatementPreview: React.FC<StatementPreviewProps> = ({ templateId, statementType }) => {
  if (statementType === 'balanceSheet') {
    return <BalanceSheetPreview templateId={templateId} />;
  } else if (statementType === 'incomeStatement') {
    return <IncomeStatementPreview templateId={templateId} />;
  } else if (statementType === 'cashFlow') {
    return <CashFlowPreview templateId={templateId} />;
  }
  
  return (
    <div className="text-center p-8 border border-dashed rounded-lg">
      <p>Preview not available for this template type.</p>
    </div>
  );
};

export default StatementPreview;
