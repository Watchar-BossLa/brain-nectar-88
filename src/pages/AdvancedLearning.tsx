
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from '@/components/layout/MainLayout';

// Import our new components
import AccountingEquation from '@/components/accounting/AccountingEquation';
import BalanceSheet from '@/components/accounting/BalanceSheet';
import StandardsLibrary from '@/components/accounting/standards-library';
import AdaptiveQuiz from '@/components/quiz/AdaptiveQuiz';
import StudySchedulePlanner from '@/components/study/StudySchedulePlanner';
import LatexRenderer from '@/components/math/LatexRenderer';

export default function AdvancedLearning() {
  const [activeTab, setActiveTab] = useState('formulas');
  
  // Mock data for examples
  const mockBalanceSheetData = {
    assets: [
      { name: 'Cash', amount: 25000 },
      { name: 'Accounts Receivable', amount: 18000 },
      { name: 'Inventory', amount: 32000 },
      { name: 'Equipment', amount: 45000 }
    ],
    liabilities: [
      { name: 'Accounts Payable', amount: 15000 },
      { name: 'Notes Payable', amount: 30000 }
    ],
    equity: [
      { name: 'Common Stock', amount: 50000 },
      { name: 'Retained Earnings', amount: 25000 }
    ]
  };
  
  const mockStandards = [
    {
      id: 'GAAP-ASC-606',
      name: 'ASC 606 - Revenue Recognition',
      description: 'Establishes principles for reporting useful information about the nature, amount, timing, and uncertainty of revenue.',
      framework: 'GAAP' as const,
      content: '<p>The core principle of ASC 606 is that an entity should recognize revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.</p><p>The standard introduces a 5-step approach to revenue recognition:</p><ol><li>Identify the contract(s) with a customer</li><li>Identify the performance obligations in the contract</li><li>Determine the transaction price</li><li>Allocate the transaction price to the performance obligations</li><li>Recognize revenue when (or as) the entity satisfies a performance obligation</li></ol>',
      examples: [
        'Software company with multi-element arrangements',
        'Construction contracts with milestone billings',
        'Subscription services with setup fees'
      ],
      relatedStandards: ['IFRS-15']
    },
    {
      id: 'IFRS-15',
      name: 'IFRS 15 - Revenue from Contracts with Customers',
      description: 'International standard on revenue recognition and accounting for contracts with customers.',
      framework: 'IFRS' as const,
      content: '<p>IFRS 15 establishes a comprehensive framework for determining when to recognize revenue and how much revenue to recognize. The core principle is that an entity recognizes revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.</p><p>Like ASC 606, IFRS 15 follows a 5-step model for revenue recognition.</p>',
      examples: [
        'Long-term service contracts',
        'Sale of goods with right of return',
        'Licenses of intellectual property'
      ],
      relatedStandards: ['GAAP-ASC-606']
    }
  ];
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Advanced Learning Features</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="formulas">Accounting Formulas</TabsTrigger>
            <TabsTrigger value="statements">Financial Statements</TabsTrigger>
            <TabsTrigger value="standards">Accounting Standards</TabsTrigger>
            <TabsTrigger value="quiz">Adaptive Quiz</TabsTrigger>
            <TabsTrigger value="scheduler">Study Planner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formulas">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Accounting Equation</h2>
                  <AccountingEquation interactive={true} assets={120000} liabilities={70000} />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Key Accounting Formulas</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Present Value</h3>
                      <LatexRenderer 
                        latex="PV = \frac{FV}{(1 + r)^n}" 
                        display={true} 
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Where PV is Present Value, FV is Future Value, r is the interest rate, and n is the number of periods.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Return on Assets (ROA)</h3>
                      <LatexRenderer 
                        latex="ROA = \frac{\text{Net Income}}{\text{Average Total Assets}}" 
                        display={true} 
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Measures how efficiently a company is using its assets to generate profit.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Debt-to-Equity Ratio</h3>
                      <LatexRenderer 
                        latex="\text{Debt-to-Equity Ratio} = \frac{\text{Total Liabilities}}{\text{Total Equity}}" 
                        display={true} 
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Indicates the relative proportion of shareholders' equity and debt used to finance a company's assets.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="statements">
            <div className="space-y-6">
              <BalanceSheet 
                assets={mockBalanceSheetData.assets}
                liabilities={mockBalanceSheetData.liabilities}
                equity={mockBalanceSheetData.equity}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="standards">
            <StandardsLibrary standards={mockStandards} />
          </TabsContent>
          
          <TabsContent value="quiz">
            <AdaptiveQuiz 
              topicIds={['topic-1', 'topic-2']} 
              initialDifficulty={0.5}
              maxQuestions={5}
            />
          </TabsContent>
          
          <TabsContent value="scheduler">
            <StudySchedulePlanner />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
