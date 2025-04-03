import React from 'react';
import { EquationStatusProps } from '@/types/components';
import { LatexRenderer } from '../../../math/LatexRendererWrapper';

const EquationStatus: React.FC<EquationStatusProps> = ({
  isBalanced,
  totalAssets,
  totalLiabilities,
  totalEquity,
}) => {
  const difference = Math.abs(totalAssets - (totalLiabilities + totalEquity));
  
  return (
    <div className={`p-4 rounded-md mt-6 ${isBalanced ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      <h3 className="font-medium mb-2">Accounting Equation Status</h3>
      <div className="mb-3">
        <LatexRenderer 
          latex={`\\text{Assets} = \\text{Liabilities} + \\text{Equity} \\quad \\Rightarrow \\quad $${totalAssets.toLocaleString()} = ${totalLiabilities.toLocaleString()} + ${totalEquity.toLocaleString()}$`} 
          display={true} 
        />
      </div>
      <p className={`text-sm ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
        {isBalanced 
          ? 'The accounting equation is balanced.' 
          : `The accounting equation is not balanced. Difference: $${difference.toLocaleString()}`}
      </p>
    </div>
  );
};

export default EquationStatus;
