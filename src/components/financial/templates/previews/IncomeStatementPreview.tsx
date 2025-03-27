import React from 'react';
import { Card } from '@/components/ui/card';
import { getFinancialData, formatCurrency } from '../../utils/exportUtils';

interface IncomeStatementPreviewProps {
  templateId: string;
}

const IncomeStatementPreview: React.FC<IncomeStatementPreviewProps> = ({ templateId }) => {
  const data = getFinancialData(templateId);
  const companyName = data.companyName;
  const reportDate = new Date(data.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (templateId === 'standard-income-statement') {
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Income Statement</h2>
          <p className="text-muted-foreground">For the period ending {reportDate}</p>
        </div>
        
        <div className="space-y-6">
          {/* Revenues */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Revenues</h3>
            <div className="space-y-1 pl-4">
              {data.revenues.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-green-600">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total Revenues</span>
                <span>{formatCurrency(data.revenues.reduce((sum, item) => sum + item.value, 0))}</span>
              </div>
            </div>
          </div>
          
          {/* Expenses */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Expenses</h3>
            <div className="space-y-1 pl-4">
              {data.expenses.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-red-600">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total Expenses</span>
                <span>{formatCurrency(data.expenses.reduce((sum, item) => sum + item.value, 0))}</span>
              </div>
            </div>
          </div>
          
          {/* Net Income */}
          <div className="pt-4 border-t-2 border-black">
            <div className="flex justify-between font-bold">
              <span>Net Income</span>
              <span className={data.revenues.reduce((sum, item) => sum + item.value, 0) - 
                     data.expenses.reduce((sum, item) => sum + item.value, 0) >= 0 ? 
                     'text-green-600' : 'text-red-600'}>
                {formatCurrency(
                  data.revenues.reduce((sum, item) => sum + item.value, 0) - 
                  data.expenses.reduce((sum, item) => sum + item.value, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  } else if (templateId === 'multi-step-income-statement') {
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Multi-Step Income Statement</h2>
          <p className="text-muted-foreground">For the period ending {reportDate}</p>
        </div>
        
        <div className="space-y-6">
          {/* Sales Revenue and COGS */}
          <div>
            <div className="flex justify-between">
              <span>Sales Revenue</span>
              <span>{formatCurrency(data.revenues[0].value)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Less: Cost of Goods Sold</span>
              <span>{formatCurrency(data.expenses[0].value)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Gross Profit</span>
              <span>{formatCurrency(data.revenues[0].value - data.expenses[0].value)}</span>
            </div>
          </div>
          
          {/* Operating Expenses */}
          <div>
            <h3 className="text-lg font-medium mb-2">Operating Expenses</h3>
            <div className="space-y-1 pl-4">
              <div className="flex justify-between text-red-600">
                <span>Operating Expenses</span>
                <span>{formatCurrency(data.expenses[1].value)}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Operating Income</span>
              <span>{formatCurrency(data.revenues[0].value - data.expenses[0].value - data.expenses[1].value)}</span>
            </div>
          </div>
          
          {/* Other Income/Expenses */}
          <div>
            <h3 className="text-lg font-medium mb-2">Other Income/Expenses</h3>
            <div className="space-y-1 pl-4">
              <div className="flex justify-between">
                <span>Other Revenue</span>
                <span>{formatCurrency(data.revenues[1].value)}</span>
              </div>
            </div>
          </div>
          
          {/* Income Before Tax */}
          <div className="flex justify-between font-medium border-t pt-2 mt-2">
            <span>Income Before Tax</span>
            <span>{formatCurrency(
              data.revenues.reduce((sum, item) => sum + item.value, 0) - 
              data.expenses.slice(0, 2).reduce((sum, item) => sum + item.value, 0)
            )}</span>
          </div>
          
          {/* Tax Expense */}
          <div className="flex justify-between text-red-600">
            <span>Tax Expense</span>
            <span>{formatCurrency(data.expenses[2].value)}</span>
          </div>
          
          {/* Net Income */}
          <div className="flex justify-between font-bold border-t-2 border-black pt-2 mt-2">
            <span>Net Income</span>
            <span className="text-green-600">{formatCurrency(
              data.revenues.reduce((sum, item) => sum + item.value, 0) - 
              data.expenses.reduce((sum, item) => sum + item.value, 0)
            )}</span>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{companyName}</h1>
        <h2 className="text-xl">Income Statement</h2>
        <p className="text-muted-foreground">For the period ending {reportDate}</p>
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
