
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import FormulaDisplay from '../FormulaDisplay';

interface FormulasTabProps {
  // Add any needed props here
}

const FormulasTab: React.FC<FormulasTabProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Accounting & Finance Formulas</CardTitle>
        <CardDescription>Reference these formulas during your studies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormulaDisplay 
          formula="\\text{Assets} = \\text{Liabilities} + \\text{Equity}"
          explanation="The fundamental accounting equation that forms the basis of double-entry bookkeeping."
          isHighlighted
        />
        
        <FormulaDisplay 
          formula="\\text{ROA} = \\frac{\\text{Net Income}}{\\text{Average Total Assets}}"
          explanation="Return on Assets measures how efficiently a company is using its assets to generate profit."
        />
        
        <FormulaDisplay 
          formula="\\text{PV} = \\frac{\\text{FV}}{(1 + r)^n}"
          explanation="Present Value formula calculates the current value of a future sum of money."
        />
        
        <FormulaDisplay 
          formula="\\text{Debt-to-Equity} = \\frac{\\text{Total Liabilities}}{\\text{Total Equity}}"
          explanation="Measures a company's financial leverage by comparing debt financing to equity financing."
        />
        
        <FormulaDisplay 
          formula="\\text{Annual Depreciation} = \\frac{\\text{Cost} - \\text{Salvage Value}}{\\text{Useful Life}}"
          explanation="Straight-line depreciation allocates the cost of an asset evenly over its useful life."
        />
      </CardContent>
    </Card>
  );
};

export default FormulasTab;
