
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getFinancialData } from '../../utils/exportUtils';
import LatexRenderer from '@/components/math/LatexRenderer';

interface BalanceSheetPreviewProps {
  templateId: string;
}

const BalanceSheetPreview: React.FC<BalanceSheetPreviewProps> = ({ templateId }) => {
  const data = getFinancialData('balanceSheet');
  const companyName = "Sample Company, Inc.";
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Default template rendering
  if (templateId === 'standard-balance-sheet') {
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Balance Sheet</h2>
          <p className="text-muted-foreground">As of {reportDate}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Assets Column */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Assets</h3>
            <div className="space-y-1">
              {data.assets.map((asset, index) => (
                <div key={index} className="flex justify-between">
                  <span>{asset.name}</span>
                  <span>${asset.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold border-t pt-2 mt-4">
                <span>Total Assets</span>
                <span>${data.assets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Liabilities and Equity Column */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Liabilities & Equity</h3>
            <div className="space-y-1">
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Liabilities</h4>
                {data.liabilities.map((liability, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{liability.name}</span>
                    <span>${liability.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Liabilities</span>
                  <span>${data.liabilities.reduce((sum, liability) => sum + liability.value, 0).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Equity</h4>
                {data.equity.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>${item.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Equity</span>
                  <span>${data.equity.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold border-t-2 border-black pt-4 mt-4">
                <span>Total Liabilities & Equity</span>
                <span>${(
                  data.liabilities.reduce((sum, item) => sum + item.value, 0) +
                  data.equity.reduce((sum, item) => sum + item.value, 0)
                ).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">The accounting equation:</p>
          <div className="flex justify-center my-2">
            <LatexRenderer 
              latex="\\text{Assets} = \\text{Liabilities} + \\text{Equity}" 
              display={true}
            />
          </div>
          <p className="text-sm">
            ${data.assets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()} = 
            ${data.liabilities.reduce((sum, liability) => sum + liability.value, 0).toLocaleString()} + 
            ${data.equity.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
          </p>
        </div>
      </Card>
    );
  } else if (templateId === 'report-balance-sheet') {
    return (
      <Card className="border-2 p-6 mx-auto max-w-4xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Balance Sheet</h2>
          <p className="text-muted-foreground">As of {reportDate}</p>
        </div>
        
        <div className="space-y-6">
          {/* Assets Section */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Assets</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                {data.assets.map((asset, index) => (
                  <div key={index} className="flex justify-between pl-4">
                    <span>{asset.name}</span>
                    <span></span>
                  </div>
                ))}
              </div>
              <div>
                {data.assets.map((asset, index) => (
                  <div key={index} className="flex justify-end">
                    <span>${asset.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-end font-bold border-t pt-2">
                  <span>${data.assets.reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Liabilities Section */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Liabilities</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                {data.liabilities.map((liability, index) => (
                  <div key={index} className="flex justify-between pl-4">
                    <span>{liability.name}</span>
                    <span></span>
                  </div>
                ))}
              </div>
              <div>
                {data.liabilities.map((liability, index) => (
                  <div key={index} className="flex justify-end">
                    <span>${liability.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-end font-bold border-t pt-2">
                  <span>${data.liabilities.reduce((sum, liability) => sum + liability.value, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Equity Section */}
          <div>
            <h3 className="text-lg font-bold border-b-2 border-black mb-4">Equity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                {data.equity.map((item, index) => (
                  <div key={index} className="flex justify-between pl-4">
                    <span>{item.name}</span>
                    <span></span>
                  </div>
                ))}
              </div>
              <div>
                {data.equity.map((item, index) => (
                  <div key={index} className="flex justify-end">
                    <span>${item.value.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-end font-bold border-t pt-2">
                  <span>${data.equity.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Total Liabilities and Equity */}
          <div className="pt-4 border-t-2 border-black">
            <div className="grid grid-cols-3">
              <div className="col-span-2 font-bold">
                Total Liabilities and Equity
              </div>
              <div className="flex justify-end font-bold">
                <span>${(
                  data.liabilities.reduce((sum, item) => sum + item.value, 0) +
                  data.equity.reduce((sum, item) => sum + item.value, 0)
                ).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  } else if (templateId === 'multi-period-balance-sheet') {
    // Create sample data for previous period
    const previousPeriodData = {
      assets: data.assets.map(asset => ({ ...asset, value: asset.value * 0.9 })),
      liabilities: data.liabilities.map(liability => ({ ...liability, value: liability.value * 0.85 })),
      equity: data.equity.map(item => ({ ...item, value: item.value * 0.95 }))
    };
    
    const totalCurrentAssets = data.assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalCurrentLiabilities = data.liabilities.reduce((sum, liability) => sum + liability.value, 0);
    const totalCurrentEquity = data.equity.reduce((sum, item) => sum + item.value, 0);
    
    const totalPrevAssets = previousPeriodData.assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalPrevLiabilities = previousPeriodData.liabilities.reduce((sum, liability) => sum + liability.value, 0);
    const totalPrevEquity = previousPeriodData.equity.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <Card className="border-2 p-6 mx-auto max-w-5xl bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <h2 className="text-xl">Comparative Balance Sheet</h2>
          <p className="text-muted-foreground">For periods ending December 31, 2023 and 2022</p>
        </div>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left p-2">Account</th>
              <th className="text-right p-2">Current Period</th>
              <th className="text-right p-2">Previous Period</th>
              <th className="text-right p-2">Change ($)</th>
              <th className="text-right p-2">Change (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-black">
              <td colSpan={5} className="font-bold p-2 bg-gray-100">Assets</td>
            </tr>
            {data.assets.map((asset, index) => {
              const prevValue = previousPeriodData.assets[index].value;
              const change = asset.value - prevValue;
              const percentChange = (change / prevValue) * 100;
              
              return (
                <tr key={index} className="border-b">
                  <td className="p-2">{asset.name}</td>
                  <td className="text-right p-2">${asset.value.toLocaleString()}</td>
                  <td className="text-right p-2">${prevValue.toLocaleString()}</td>
                  <td className="text-right p-2">${change.toLocaleString()}</td>
                  <td className="text-right p-2">{percentChange.toFixed(1)}%</td>
                </tr>
              );
            })}
            <tr className="border-b font-semibold bg-gray-50">
              <td className="p-2">Total Assets</td>
              <td className="text-right p-2">${totalCurrentAssets.toLocaleString()}</td>
              <td className="text-right p-2">${totalPrevAssets.toLocaleString()}</td>
              <td className="text-right p-2">${(totalCurrentAssets - totalPrevAssets).toLocaleString()}</td>
              <td className="text-right p-2">{((totalCurrentAssets - totalPrevAssets) / totalPrevAssets * 100).toFixed(1)}%</td>
            </tr>
            
            <tr className="border-b border-black">
              <td colSpan={5} className="font-bold p-2 bg-gray-100">Liabilities</td>
            </tr>
            {data.liabilities.map((liability, index) => {
              const prevValue = previousPeriodData.liabilities[index].value;
              const change = liability.value - prevValue;
              const percentChange = (change / prevValue) * 100;
              
              return (
                <tr key={index} className="border-b">
                  <td className="p-2">{liability.name}</td>
                  <td className="text-right p-2">${liability.value.toLocaleString()}</td>
                  <td className="text-right p-2">${prevValue.toLocaleString()}</td>
                  <td className="text-right p-2">${change.toLocaleString()}</td>
                  <td className="text-right p-2">{percentChange.toFixed(1)}%</td>
                </tr>
              );
            })}
            <tr className="border-b font-semibold bg-gray-50">
              <td className="p-2">Total Liabilities</td>
              <td className="text-right p-2">${totalCurrentLiabilities.toLocaleString()}</td>
              <td className="text-right p-2">${totalPrevLiabilities.toLocaleString()}</td>
              <td className="text-right p-2">${(totalCurrentLiabilities - totalPrevLiabilities).toLocaleString()}</td>
              <td className="text-right p-2">{((totalCurrentLiabilities - totalPrevLiabilities) / totalPrevLiabilities * 100).toFixed(1)}%</td>
            </tr>
            
            <tr className="border-b border-black">
              <td colSpan={5} className="font-bold p-2 bg-gray-100">Equity</td>
            </tr>
            {data.equity.map((item, index) => {
              const prevValue = previousPeriodData.equity[index].value;
              const change = item.value - prevValue;
              const percentChange = (change / prevValue) * 100;
              
              return (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.name}</td>
                  <td className="text-right p-2">${item.value.toLocaleString()}</td>
                  <td className="text-right p-2">${prevValue.toLocaleString()}</td>
                  <td className="text-right p-2">${change.toLocaleString()}</td>
                  <td className="text-right p-2">{percentChange.toFixed(1)}%</td>
                </tr>
              );
            })}
            <tr className="border-b font-semibold bg-gray-50">
              <td className="p-2">Total Equity</td>
              <td className="text-right p-2">${totalCurrentEquity.toLocaleString()}</td>
              <td className="text-right p-2">${totalPrevEquity.toLocaleString()}</td>
              <td className="text-right p-2">${(totalCurrentEquity - totalPrevEquity).toLocaleString()}</td>
              <td className="text-right p-2">{((totalCurrentEquity - totalPrevEquity) / totalPrevEquity * 100).toFixed(1)}%</td>
            </tr>
            
            <tr className="border-t-2 border-black font-bold">
              <td className="p-2">Total Liabilities & Equity</td>
              <td className="text-right p-2">${(totalCurrentLiabilities + totalCurrentEquity).toLocaleString()}</td>
              <td className="text-right p-2">${(totalPrevLiabilities + totalPrevEquity).toLocaleString()}</td>
              <td className="text-right p-2">${((totalCurrentLiabilities + totalCurrentEquity) - (totalPrevLiabilities + totalPrevEquity)).toLocaleString()}</td>
              <td className="text-right p-2">{(((totalCurrentLiabilities + totalCurrentEquity) - (totalPrevLiabilities + totalPrevEquity)) / (totalPrevLiabilities + totalPrevEquity) * 100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </Card>
    );
  }
  
  return <div>Template not found</div>;
};

export default BalanceSheetPreview;
