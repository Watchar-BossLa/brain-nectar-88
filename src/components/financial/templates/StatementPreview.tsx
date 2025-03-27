
import React from 'react';
import BalanceSheetPreview from './previews/BalanceSheetPreview';
import IncomeStatementPreview from './previews/IncomeStatementPreview';
import CashFlowPreview from './previews/CashFlowPreview';

interface StatementPreviewProps {
  templateId: string;
  statementType: string;
}

const StatementPreview: React.FC<StatementPreviewProps> = ({ 
  templateId, 
  statementType 
}) => {
  // Render the appropriate preview based on statement type
  if (statementType === 'balanceSheet') {
    return <BalanceSheetPreview templateId={templateId} />;
  } else if (statementType === 'incomeStatement') {
    return <IncomeStatementPreview templateId={templateId} />;
  } else if (statementType === 'cashFlow') {
    return <CashFlowPreview templateId={templateId} />;
  }
  
  return <div>Invalid statement type</div>;
};

export default StatementPreview;
