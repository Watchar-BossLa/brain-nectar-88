
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, BookText, ArrowUpDown } from 'lucide-react';

// Define the standard interfaces
interface AccountingStandard {
  id: string;
  code: string;
  title: string;
  framework: 'GAAP' | 'IFRS';
  summary: string;
  keyPoints: string[];
  category: string;
  examples?: string[];
}

const StandardsLibrary = () => {
  // GAAP standards data
  const gaapStandards: AccountingStandard[] = [
    {
      id: '1',
      code: 'ASC 105',
      title: 'Generally Accepted Accounting Principles',
      framework: 'GAAP',
      summary: 'Establishes the FASB Accounting Standards Codification as the source of authoritative GAAP.',
      keyPoints: [
        'Codification is the single source of authoritative nongovernmental U.S. GAAP',
        'Reduces the complexity of accounting standards research',
        'Organized by topic area rather than chronological order'
      ],
      category: 'Framework',
      examples: [
        'Proper citation for GAAP references in financial statements',
        'Required disclosures regarding departures from GAAP'
      ]
    },
    {
      id: '2',
      code: 'ASC 205',
      title: 'Presentation of Financial Statements',
      framework: 'GAAP',
      summary: 'Provides guidelines for the general presentation of financial statements.',
      keyPoints: [
        'Requirements for comparative financial statements',
        'Going concern assessment requirements',
        'Guidelines for reporting comprehensive income'
      ],
      category: 'Presentation',
      examples: [
        'Disclosure of liquidation basis of accounting',
        'Presentation of discontinued operations'
      ]
    },
    {
      id: '3',
      code: 'ASC 320',
      title: 'Investments - Debt Securities',
      framework: 'GAAP',
      summary: 'Establishes standards of accounting for investments in debt securities.',
      keyPoints: [
        'Classification into trading, available-for-sale, or held-to-maturity categories',
        'Recognition of unrealized gains and losses',
        'Impairment assessment requirements'
      ],
      category: 'Assets',
      examples: [
        'Recognition of interest income using the effective interest method',
        'Accounting for transfers between investment categories'
      ]
    },
    {
      id: '4',
      code: 'ASC 606',
      title: 'Revenue from Contracts with Customers',
      framework: 'GAAP',
      summary: 'Provides a comprehensive framework for recognizing revenue from customer contracts.',
      keyPoints: [
        'Five-step model for revenue recognition',
        'Identification of performance obligations',
        'Allocation of transaction price',
        'Recognition of revenue when control transfers'
      ],
      category: 'Revenue',
      examples: [
        'Contract modifications and their accounting treatment',
        'Principal versus agent considerations',
        'Customer loyalty programs'
      ]
    },
    {
      id: '5',
      code: 'ASC 718',
      title: 'Compensation - Stock Compensation',
      framework: 'GAAP',
      summary: 'Establishes standards for accounting for transactions in which an entity exchanges its equity instruments for goods or services.',
      keyPoints: [
        'Measurement at fair value for equity-classified awards',
        'Recognition of compensation cost over service period',
        'Accounting for modifications to awards'
      ],
      category: 'Compensation',
      examples: [
        'Graded vesting stock options',
        'Performance-based compensation',
        'Tax effects of stock-based compensation'
      ]
    },
  ];

  // IFRS standards data
  const ifrsStandards: AccountingStandard[] = [
    {
      id: '6',
      code: 'IAS 1',
      title: 'Presentation of Financial Statements',
      framework: 'IFRS',
      summary: 'Prescribes the basis for presentation of general purpose financial statements.',
      keyPoints: [
        'Sets out overall requirements for the presentation of financial statements',
        'Guidelines for structure and minimum requirements for content',
        'Distinction between current and non-current items'
      ],
      category: 'Presentation',
      examples: [
        'Statement of financial position presentation',
        'Statement of profit or loss and other comprehensive income',
        'Statement of changes in equity'
      ]
    },
    {
      id: '7',
      code: 'IFRS 9',
      title: 'Financial Instruments',
      framework: 'IFRS',
      summary: 'Sets out requirements for recognizing and measuring financial assets, financial liabilities, and some contracts to buy or sell non-financial items.',
      keyPoints: [
        'Classification and measurement of financial instruments',
        'New expected credit loss impairment model',
        'Revised hedge accounting model'
      ],
      category: 'Financial Instruments',
      examples: [
        'Classification of debt instruments at amortized cost',
        'Fair value through other comprehensive income',
        'Accounting for embedded derivatives'
      ]
    },
    {
      id: '8',
      code: 'IFRS 15',
      title: 'Revenue from Contracts with Customers',
      framework: 'IFRS',
      summary: 'Specifies how and when revenue is recognized and requires entities to provide users of financial statements with more informative, relevant disclosures.',
      keyPoints: [
        'Five-step model for revenue recognition',
        'Identification of separate performance obligations',
        'Variable consideration and constraining estimates'
      ],
      category: 'Revenue',
      examples: [
        'Construction contract revenue recognition',
        'Licensing agreements',
        'Contract costs capitalization'
      ]
    },
    {
      id: '9',
      code: 'IFRS 16',
      title: 'Leases',
      framework: 'IFRS',
      summary: 'Specifies how an IFRS reporter will recognize, measure, present and disclose leases.',
      keyPoints: [
        'Single lessee accounting model (right-of-use model)',
        'Recognition of assets and liabilities for all leases over 12 months',
        'Optional exemptions for short-term leases and low-value assets'
      ],
      category: 'Leases',
      examples: [
        'Recognition of right-of-use assets',
        'Lease liability measurement',
        'Sale and leaseback transactions'
      ]
    },
    {
      id: '10',
      code: 'IAS 12',
      title: 'Income Taxes',
      framework: 'IFRS',
      summary: 'Prescribes the accounting treatment for income taxes.',
      keyPoints: [
        'Recognition of current tax liabilities and assets',
        'Recognition of deferred tax liabilities and assets',
        'Measurement of deferred tax using enacted tax rates'
      ],
      category: 'Taxation',
      examples: [
        'Temporary differences between accounting and tax bases',
        'Unused tax losses and credits',
        'Business combinations'
      ]
    },
  ];

  // Combine all standards
  const allStandards = [...gaapStandards, ...ifrsStandards];

  // State for standards and filtering
  const [standards, setStandards] = useState<AccountingStandard[]>(allStandards);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<'all' | 'GAAP' | 'IFRS'>('all');
  const [sortField, setSortField] = useState<'code' | 'title' | 'category'>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStandard, setSelectedStandard] = useState<AccountingStandard | null>(null);

  // Filter and sort standards when any of the filtering criteria changes
  useEffect(() => {
    let filteredStandards = allStandards;
    
    // Filter by framework
    if (selectedFramework !== 'all') {
      filteredStandards = filteredStandards.filter(std => std.framework === selectedFramework);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredStandards = filteredStandards.filter(std => 
        std.code.toLowerCase().includes(query) || 
        std.title.toLowerCase().includes(query) ||
        std.summary.toLowerCase().includes(query) ||
        std.category.toLowerCase().includes(query)
      );
    }
    
    // Sort standards
    filteredStandards.sort((a, b) => {
      const fieldA = a[sortField].toLowerCase();
      const fieldB = b[sortField].toLowerCase();
      
      if (sortDirection === 'asc') {
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
      } else {
        return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
      }
    });
    
    setStandards(filteredStandards);
  }, [searchQuery, selectedFramework, sortField, sortDirection]);

  // Toggle sort direction
  const toggleSort = (field: 'code' | 'title' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookText className="h-5 w-5" />
          Accounting Standards Library
        </CardTitle>
        <CardDescription>
          Searchable database of GAAP and IFRS accounting standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse" className="space-y-4">
          <TabsList>
            <TabsTrigger value="browse">Browse Standards</TabsTrigger>
            <TabsTrigger value="compare">Compare Frameworks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search standards by code, title, or keyword..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value as 'all' | 'GAAP' | 'IFRS')}
              >
                <option value="all">All Frameworks</option>
                <option value="GAAP">GAAP Only</option>
                <option value="IFRS">IFRS Only</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border rounded-md">
                <div className="p-3 border-b bg-muted/20 font-medium">
                  Standards List ({standards.length})
                </div>
                <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] cursor-pointer" onClick={() => toggleSort('code')}>
                          <div className="flex items-center">
                            Code
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </div>
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => toggleSort('title')}>
                          <div className="flex items-center">
                            Title
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </div>
                        </TableHead>
                        <TableHead className="w-[100px] cursor-pointer" onClick={() => toggleSort('category')}>
                          <div className="flex items-center">
                            Category
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standards.map((standard) => (
                        <TableRow 
                          key={standard.id}
                          className={`cursor-pointer hover:bg-muted/50 ${selectedStandard?.id === standard.id ? 'bg-primary/10' : ''}`}
                          onClick={() => setSelectedStandard(standard)}
                        >
                          <TableCell className="font-medium">{standard.code}</TableCell>
                          <TableCell>{standard.title}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${standard.framework === 'GAAP' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                              {standard.framework}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {standards.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                            No standards match your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="md:col-span-2 border rounded-md">
                {selectedStandard ? (
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {selectedStandard.code}: {selectedStandard.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${selectedStandard.framework === 'GAAP' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {selectedStandard.framework}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Category: {selectedStandard.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Summary</h4>
                        <p className="text-muted-foreground">{selectedStandard.summary}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Key Points</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedStandard.keyPoints.map((point, index) => (
                            <li key={index} className="text-muted-foreground">{point}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {selectedStandard.examples && (
                        <div>
                          <h4 className="font-medium mb-1">Practical Examples</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedStandard.examples.map((example, index) => (
                              <li key={index} className="text-muted-foreground">{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="pt-4 mt-4 border-t">
                        <h4 className="font-medium mb-2">Related Resources</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <Button variant="outline" className="text-left justify-start">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Full Standard Text
                          </Button>
                          <Button variant="outline" className="text-left justify-start">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Implementation Guidance
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <BookText className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">Select a Standard</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      Click on any standard from the list to view detailed information, key points, and practical examples.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compare" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">GAAP vs. IFRS Comparison</h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>US GAAP</TableHead>
                    <TableHead>IFRS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Framework</TableCell>
                    <TableCell>Rule-based approach with detailed guidelines for specific industries and transactions</TableCell>
                    <TableCell>Principle-based approach that requires more judgment and interpretation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Inventory Valuation</TableCell>
                    <TableCell>LIFO (Last In, First Out) is permitted</TableCell>
                    <TableCell>LIFO is prohibited</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Development Costs</TableCell>
                    <TableCell>Generally expensed as incurred with some exceptions</TableCell>
                    <TableCell>Capitalized when technical and economic feasibility criteria are met</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fixed Assets</TableCell>
                    <TableCell>Only historical cost model allowed</TableCell>
                    <TableCell>Choice between cost model and revaluation model</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Financial Statement Presentation</TableCell>
                    <TableCell>Specific formats not mandated; items presented in decreasing order of liquidity</TableCell>
                    <TableCell>Current/non-current distinction required; minimum line items specified</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Extraordinary Items</TableCell>
                    <TableCell>Prohibited</TableCell>
                    <TableCell>Prohibited</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Revenue Recognition</TableCell>
                    <TableCell>5-step model under ASC 606</TableCell>
                    <TableCell>5-step model under IFRS 15 (largely converged with GAAP)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lease Accounting</TableCell>
                    <TableCell>All leases over 12 months on balance sheet (ASC 842)</TableCell>
                    <TableCell>All leases over 12 months on balance sheet (IFRS 16)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Key Conceptual Differences</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-muted-foreground">
                    <span className="font-medium text-foreground">Level of Detail:</span> GAAP tends to provide more detailed guidance with industry-specific rules, while IFRS relies more on general principles.
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-medium text-foreground">Conservatism:</span> GAAP historically emphasized conservatism more than IFRS, though this difference has narrowed.
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-medium text-foreground">Fair Value:</span> IFRS has traditionally made greater use of fair value accounting than GAAP, though this gap is also narrowing.
                  </li>
                  <li className="text-muted-foreground">
                    <span className="font-medium text-foreground">Global Adoption:</span> IFRS is used in over 140 countries worldwide, while GAAP is primarily used in the United States.
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StandardsLibrary;
