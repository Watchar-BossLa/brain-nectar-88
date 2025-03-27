
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getFinancialData } from '../../utils/exportUtils';

interface CashFlowPreviewProps {
  templateId: string;
}

const CashFlowPreview: React.FC<CashFlowPreviewProps> = ({ templateId }) => {
  const data = getFinancialData('cashFlow');
  const companyName = "Sample Company, Inc.";
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (templateId === 'standard-cash-flow') {
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Cash Flow Statement</h2>
          <p className="text-muted-foreground">For the period ending {reportDate}</p>
        </div>
        
        <div className="space-y-6">
          {/* Operating Activities */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Cash Flows from Operating Activities</h3>
            <div className="space-y-1 pl-4">
              {data.cashFlows.operating.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className={item.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Net Cash from Operating Activities</span>
                <span>${data.cashFlows.operating.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Investing Activities */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Cash Flows from Investing Activities</h3>
            <div className="space-y-1 pl-4">
              {data.cashFlows.investing.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className={item.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Net Cash from Investing Activities</span>
                <span>${data.cashFlows.investing.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Financing Activities */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Cash Flows from Financing Activities</h3>
            <div className="space-y-1 pl-4">
              {data.cashFlows.financing.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span className={item.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Net Cash from Financing Activities</span>
                <span>${data.cashFlows.financing.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Net Increase/Decrease in Cash */}
          <div className="pt-4 border-t-2 border-black">
            <div className="flex justify-between font-bold">
              <span>Net Increase/(Decrease) in Cash</span>
              <span>${(
                data.cashFlows.operating.reduce((sum, item) => sum + item.value, 0) +
                data.cashFlows.investing.reduce((sum, item) => sum + item.value, 0) +
                data.cashFlows.financing.reduce((sum, item) => sum + item.value, 0)
              ).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  } else if (templateId === 'indirect-cash-flow') {
    // This would show an indirect method cash flow statement
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Cash Flow Statement (Indirect Method)</h2>
          <p className="text-muted-foreground">For the period ending {reportDate}</p>
        </div>
        
        <div className="text-center py-6">
          <p>Indirect Method Cash Flow Template: {templateId}</p>
          <p className="text-muted-foreground mt-2">
            This preview would show a formatted indirect method cash flow statement.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Sample Company, Inc.</h1>
        <h2 className="text-xl">Cash Flow Statement</h2>
        <p className="text-muted-foreground">For the period ending {reportDate}</p>
      </div>
      
      <div className="text-center py-10">
        <p>Cash Flow Statement Template: {templateId}</p>
        <p className="text-muted-foreground mt-2">
          This preview would show a formatted cash flow statement based on the selected template.
        </p>
      </div>
    </Card>
  );
};

export default CashFlowPreview;
