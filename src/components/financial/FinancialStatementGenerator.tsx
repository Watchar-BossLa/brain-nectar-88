
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  FileText, 
  BookOpen, 
  ArrowDownToLine, 
  ClipboardCopy, 
  Printer 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Import extracted components
import BalanceSheetTab from './balance-sheet/BalanceSheetTab';
import IncomeStatementTab from './income-statement/IncomeStatementTab';
import CashFlowTab from './cash-flow/CashFlowTab';
import TemplateGallery from './templates/TemplateGallery';
import StatementPreview from './templates/StatementPreview';
import { exportToPDF, exportToCSV, copyToClipboard } from './utils/exportUtils';

const FinancialStatementGenerator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('balanceSheet');
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleExport = (type: 'pdf' | 'csv' | 'clipboard') => {
    try {
      if (type === 'pdf') {
        exportToPDF(activeTab, `${activeTab}.pdf`);
        toast({
          title: "PDF Export Successful",
          description: "Your financial statement has been exported as a PDF",
        });
      } else if (type === 'csv') {
        exportToCSV([], `${activeTab}.csv`);
        toast({
          title: "CSV Export Successful",
          description: "Your financial statement has been exported as a CSV file",
        });
      } else if (type === 'clipboard') {
        copyToClipboard(JSON.stringify(getDataForActiveTab()));
        toast({
          title: "Copied to Clipboard",
          description: "Your financial statement data has been copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your financial statement",
        variant: "destructive",
      });
    }
  };

  const getDataForActiveTab = () => {
    // This would normally fetch the actual data from the tabs
    // For now returning a placeholder
    return { type: activeTab, data: "Placeholder data" };
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateGallery(false);
    toast({
      title: "Template Applied",
      description: "The selected template has been applied to your statement",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Financial Statement Generator
            </CardTitle>
            <CardDescription>
              Create and analyze balance sheets, income statements, and cash flow statements
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTemplateGallery(true)}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showTemplateGallery ? (
          <TemplateGallery 
            statementType={activeTab} 
            onSelect={handleTemplateSelect}
            onClose={() => setShowTemplateGallery(false)}
          />
        ) : selectedTemplate ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTemplate(null)}
              >
                ← Back to Editor
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport('clipboard')}
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport('pdf')}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
            <StatementPreview
              templateId={selectedTemplate}
              statementType={activeTab}
            />
          </>
        ) : (
          <Tabs 
            defaultValue="balanceSheet" 
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="balanceSheet">Balance Sheet</TabsTrigger>
              <TabsTrigger value="incomeStatement">Income Statement</TabsTrigger>
              <TabsTrigger value="cashFlow">Cash Flow</TabsTrigger>
            </TabsList>
            
            {/* Balance Sheet Tab */}
            <TabsContent value="balanceSheet">
              <BalanceSheetTab />
            </TabsContent>
            
            {/* Income Statement Tab */}
            <TabsContent value="incomeStatement">
              <IncomeStatementTab />
            </TabsContent>
            
            {/* Cash Flow Statement Tab */}
            <TabsContent value="cashFlow">
              <CashFlowTab />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialStatementGenerator;
