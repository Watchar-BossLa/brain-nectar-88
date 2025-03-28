
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, X, ArrowRight } from 'lucide-react';

const templates = {
  balanceSheet: [
    { id: 'standard-balance-sheet', name: 'Standard Balance Sheet', description: 'Classic balance sheet format with assets, liabilities, and equity sections' },
    { id: 'classified-balance-sheet', name: 'Classified Balance Sheet', description: 'Detailed balance sheet with current and non-current classifications' },
    { id: 'comparative-balance-sheet', name: 'Comparative Balance Sheet', description: 'Balance sheet showing comparison between two periods' }
  ],
  incomeStatement: [
    { id: 'standard-income-statement', name: 'Standard Income Statement', description: 'Basic income statement with revenues, expenses, and net income' },
    { id: 'multi-step-income-statement', name: 'Multi-Step Income Statement', description: 'Detailed income statement with gross profit, operating income, and net income' },
    { id: 'contribution-margin-statement', name: 'Contribution Margin Statement', description: 'Income statement focusing on variable costs and contribution margin' }
  ],
  cashFlow: [
    { id: 'standard-cash-flow', name: 'Standard Cash Flow Statement', description: 'Cash flow statement with operating, investing, and financing activities' },
    { id: 'direct-method-cash-flow', name: 'Direct Method Cash Flow', description: 'Cash flow statement that shows operating cash receipts and payments' },
    { id: 'indirect-method-cash-flow', name: 'Indirect Method Cash Flow', description: 'Cash flow statement that reconciles net income to operating cash flow' }
  ]
};

interface TemplateGalleryProps {
  statementType: string;
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ statementType, onSelect, onClose }) => {
  const templateList = statementType === 'balanceSheet' 
    ? templates.balanceSheet 
    : statementType === 'incomeStatement'
      ? templates.incomeStatement
      : templates.cashFlow;
  
  const statementTitle = statementType === 'balanceSheet' 
    ? 'Balance Sheet' 
    : statementType === 'incomeStatement'
      ? 'Income Statement'
      : 'Cash Flow Statement';
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          <FileText className="inline mr-2 h-5 w-5" />
          {statementTitle} Templates
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {templateList.map((template) => (
          <Card key={template.id} className="overflow-hidden cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-0">
              <div 
                className="p-4 border-b bg-muted/30 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSelect(template.id)}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
