import React from 'react';
import LatexRenderer from '../math/LatexRenderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountingEquationProps {
  assets?: number;
  liabilities?: number;
  equity?: number;
  interactive?: boolean;
  className?: string;
}

/**
 * Interactive accounting equation component that visualizes
 * the fundamental equation: Assets = Liabilities + Equity
 */
const AccountingEquation: React.FC<AccountingEquationProps> = ({
  assets = 0,
  liabilities = 0,
  equity = 0,
  interactive = false,
  className = ""
}) => {
  const [localAssets, setLocalAssets] = React.useState(assets);
  const [localLiabilities, setLocalLiabilities] = React.useState(liabilities);
  const [localEquity, setLocalEquity] = React.useState(equity);
  
  // Keep the equation balanced when in interactive mode
  React.useEffect(() => {
    if (interactive) {
      // A = L + E, so E = A - L
      setLocalEquity(localAssets - localLiabilities);
    }
  }, [interactive, localAssets, localLiabilities]);
  
  // Non-interactive mode should just display the provided values
  React.useEffect(() => {
    if (!interactive) {
      setLocalAssets(assets);
      setLocalLiabilities(liabilities);
      setLocalEquity(equity);
    }
  }, [interactive, assets, liabilities, equity]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Accounting Equation</CardTitle>
        <CardDescription>
          The foundation of double-entry bookkeeping
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-6">
          <LatexRenderer 
            latex="\\text{Assets} = \\text{Liabilities} + \\text{Equity}" 
            display={true} 
          />
        </div>
        
        {interactive ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Assets</label>
              <input
                type="number"
                value={localAssets}
                onChange={(e) => setLocalAssets(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Liabilities</label>
              <input
                type="number"
                value={localLiabilities}
                onChange={(e) => setLocalLiabilities(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Equity</label>
              <input
                type="number"
                value={localEquity}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm font-medium">Assets</p>
              <p className="text-2xl">{localAssets}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Liabilities</p>
              <p className="text-2xl">{localLiabilities}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Equity</p>
              <p className="text-2xl">{localEquity}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountingEquation;
