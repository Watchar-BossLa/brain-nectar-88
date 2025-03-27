
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TemplateGalleryProps {
  statementType: string;
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  compatibility: string[];
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  statementType,
  onSelect,
  onClose
}) => {
  // Template data
  const templates: Template[] = [
    {
      id: 'standard-balance-sheet',
      name: 'Standard Balance Sheet',
      description: 'Classic two-column balance sheet format with assets on left, liabilities and equity on right',
      thumbnail: '/placeholder.svg',
      compatibility: ['balanceSheet']
    },
    {
      id: 'report-balance-sheet',
      name: 'Report Format Balance Sheet',
      description: 'Top-to-bottom format with assets followed by liabilities and equity',
      thumbnail: '/placeholder.svg',
      compatibility: ['balanceSheet']
    },
    {
      id: 'multi-period-balance-sheet',
      name: 'Multi-Period Balance Sheet',
      description: 'Compare balance sheets across multiple periods side by side',
      thumbnail: '/placeholder.svg',
      compatibility: ['balanceSheet']
    },
    {
      id: 'standard-income-statement',
      name: 'Standard Income Statement',
      description: 'Single-step format showing revenues, expenses, and net income',
      thumbnail: '/placeholder.svg',
      compatibility: ['incomeStatement']
    },
    {
      id: 'multi-step-income-statement',
      name: 'Multi-Step Income Statement',
      description: 'Detailed format showing gross profit, operating income, and net income',
      thumbnail: '/placeholder.svg',
      compatibility: ['incomeStatement']
    },
    {
      id: 'contribution-margin-income-statement',
      name: 'Contribution Margin Format',
      description: 'Separates fixed and variable costs to highlight contribution margin',
      thumbnail: '/placeholder.svg',
      compatibility: ['incomeStatement']
    },
    {
      id: 'direct-cash-flow',
      name: 'Direct Method Cash Flow',
      description: 'Reports cash flow activities using direct receipts and payments',
      thumbnail: '/placeholder.svg',
      compatibility: ['cashFlow']
    },
    {
      id: 'indirect-cash-flow',
      name: 'Indirect Method Cash Flow',
      description: 'Starts with net income and adjusts for non-cash items and working capital changes',
      thumbnail: '/placeholder.svg',
      compatibility: ['cashFlow']
    },
    {
      id: 'gaap-cash-flow',
      name: 'GAAP Compliant Cash Flow',
      description: 'Follows GAAP standards with proper categorization of all cash activities',
      thumbnail: '/placeholder.svg',
      compatibility: ['cashFlow']
    }
  ];

  // Filter templates based on the current statement type
  const filteredTemplates = templates.filter(template => 
    template.compatibility.includes(statementType)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Template Gallery</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Select a template to apply to your {statementType === 'balanceSheet' 
          ? 'balance sheet' 
          : statementType === 'incomeStatement' 
            ? 'income statement' 
            : 'cash flow statement'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card 
            key={template.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelect(template.id)}
          >
            <div className="aspect-video bg-muted">
              <img 
                src={template.thumbnail} 
                alt={template.name} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {template.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
