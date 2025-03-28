
import React from 'react';
import { Card } from '@/components/ui/card';
import { getFinancialData, formatCurrency } from '../../utils/exportUtils';

interface BalanceSheetPreviewProps {
  templateId: string;
}

const BalanceSheetPreview: React.FC<BalanceSheetPreviewProps> = ({ templateId }) => {
  const data = getFinancialData(templateId);
  const companyName = data.companyName;
  const reportDate = new Date(data.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (templateId === 'standard-balance-sheet') {
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Balance Sheet</h2>
          <p className="text-muted-foreground">As of {reportDate}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Assets */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Assets</h3>
            <div className="space-y-1 pl-4">
              {data.assets.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total Assets</span>
                <span>{formatCurrency(data.assets.reduce((sum: number, item: any) => sum + item.value, 0))}</span>
              </div>
            </div>
          </div>
          
          {/* Liabilities & Equity */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Liabilities & Equity</h3>
            <div className="space-y-1 pl-4">
              {/* Liabilities */}
              <h4 className="font-medium">Liabilities</h4>
              {data.liabilities.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium border-t pt-2 mt-2">
                <span>Total Liabilities</span>
                <span>{formatCurrency(data.liabilities.reduce((sum: number, item: any) => sum + item.value, 0))}</span>
              </div>
              
              {/* Equity */}
              <h4 className="font-medium mt-4">Equity</h4>
              {data.equity.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium border-t pt-2 mt-2">
                <span>Total Equity</span>
                <span>{formatCurrency(data.equity.reduce((sum: number, item: any) => sum + item.value, 0))}</span>
              </div>
              
              {/* Total */}
              <div className="flex justify-between font-bold border-t-2 border-black pt-2 mt-4">
                <span>Total Liabilities & Equity</span>
                <span>{formatCurrency(
                  data.liabilities.reduce((sum: number, item: any) => sum + item.value, 0) + 
                  data.equity.reduce((sum: number, item: any) => sum + item.value, 0)
                )}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  } else if (templateId === 'classified-balance-sheet') {
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Classified Balance Sheet</h2>
          <p className="text-muted-foreground">As of {reportDate}</p>
        </div>
        
        <div className="space-y-6">
          {/* Assets */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Assets</h3>
            <div>
              {/* Current Assets */}
              <h4 className="font-medium">Current Assets</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between">
                  <span>Cash and Cash Equivalents</span>
                  <span>{formatCurrency(data.assets[0].value)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accounts Receivable</span>
                  <span>{formatCurrency(data.assets[1].value)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inventory</span>
                  <span>{formatCurrency(data.assets[2].value)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Current Assets</span>
                  <span>{formatCurrency(data.assets.slice(0, 3).reduce((sum: number, item: any) => sum + item.value, 0))}</span>
                </div>
              </div>
              
              {/* Non-Current Assets */}
              <h4 className="font-medium mt-4">Non-Current Assets</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between">
                  <span>Property, Plant, and Equipment</span>
                  <span>{formatCurrency(data.assets[3].value)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Non-Current Assets</span>
                  <span>{formatCurrency(data.assets.slice(3).reduce((sum: number, item: any) => sum + item.value, 0))}</span>
                </div>
              </div>
              
              {/* Total Assets */}
              <div className="flex justify-between font-bold border-t-2 border-black pt-2 mt-4">
                <span>Total Assets</span>
                <span>{formatCurrency(data.assets.reduce((sum: number, item: any) => sum + item.value, 0))}</span>
              </div>
            </div>
          </div>
          
          {/* Liabilities & Equity */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Liabilities & Equity</h3>
            <div>
              {/* Current Liabilities */}
              <h4 className="font-medium">Current Liabilities</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between">
                  <span>Accounts Payable</span>
                  <span>{formatCurrency(data.liabilities[0].value)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Short-term Debt</span>
                  <span>{formatCurrency(data.liabilities[1].value)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Current Liabilities</span>
                  <span>{formatCurrency(data.liabilities.slice(0, 2).reduce((sum: number, item: any) => sum + item.value, 0))}</span>
                </div>
              </div>
              
              {/* Non-Current Liabilities */}
              <h4 className="font-medium mt-4">Non-Current Liabilities</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between">
                  <span>Long-term Debt</span>
                  <span>{formatCurrency(data.liabilities[2].value)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Non-Current Liabilities</span>
                  <span>{formatCurrency(data.liabilities.slice(2).reduce((sum: number, item: any) => sum + item.value, 0))}</span>
                </div>
              </div>
              
              {/* Total Liabilities */}
              <div className="flex justify-between font-medium border-t-2 border-black pt-2 mt-4">
                <span>Total Liabilities</span>
                <span>{formatCurrency(data.liabilities.reduce((sum: number, item: any) => sum + item.value, 0))}</span>
              </div>
              
              {/* Equity */}
              <h4 className="font-medium mt-4">Equity</h4>
              <div className="space-y-1 pl-4">
                {data.equity.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{formatCurrency(item.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Equity</span>
                  <span>{formatCurrency(data.equity.reduce((sum: number, item: any) => sum + item.value, 0))}</span>
                </div>
              </div>
              
              {/* Total Liabilities & Equity */}
              <div className="flex justify-between font-bold border-t-2 border-black pt-2 mt-4">
                <span>Total Liabilities & Equity</span>
                <span>{formatCurrency(
                  data.liabilities.reduce((sum: number, item: any) => sum + item.value, 0) + 
                  data.equity.reduce((sum: number, item: any) => sum + item.value, 0)
                )}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{companyName}</h1>
        <h2 className="text-xl">Balance Sheet</h2>
        <p className="text-muted-foreground">As of {reportDate}</p>
      </div>
      
      <div className="text-center py-10">
        <p>Balance Sheet Template: {templateId}</p>
        <p className="text-muted-foreground mt-2">
          This preview would show a formatted balance sheet based on the selected template.
        </p>
      </div>
    </Card>
  );
};

export default BalanceSheetPreview;
