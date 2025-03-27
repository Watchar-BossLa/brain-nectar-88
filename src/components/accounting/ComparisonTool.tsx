
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BadgeDiff, Download, Printer, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface AccountingStandard {
  id: string;
  name: string;
  description: string;
  framework: 'GAAP' | 'IFRS' | 'FASB' | 'IASB' | 'AASB' | 'Other';
  content: string;
  category?: string;
  lastUpdated?: string;
  effectiveDate?: string;
  examples?: string[];
  relatedStandards?: string[];
  searchKeywords?: string[];
}

interface ComparisonToolProps {
  standards: AccountingStandard[];
  onClose: () => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ standards, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  if (standards.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Please select standards to compare</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  // Extract common comparison areas based on the standards
  const comparisonAreas = [
    { id: "overview", name: "Overview" },
    { id: "recognition", name: "Recognition Criteria" },
    { id: "measurement", name: "Measurement" },
    { id: "disclosure", name: "Disclosure Requirements" },
    { id: "examples", name: "Examples" },
    { id: "differences", name: "Key Differences" },
  ];

  // Simulated key differences between standards
  const getKeyDifferences = () => {
    // If comparing GAAP and IFRS
    if (
      standards.some(s => s.framework === 'GAAP') && 
      standards.some(s => s.framework === 'IFRS')
    ) {
      if (standards.some(s => s.id === 'GAAP-ASC-606') && standards.some(s => s.id === 'IFRS-15')) {
        return [
          {
            area: "Contract Modifications",
            gaap: "ASC 606 provides more detailed guidance on contract modifications.",
            ifrs: "IFRS 15 is more principles-based with less detailed guidance."
          },
          {
            area: "Variable Consideration",
            gaap: "GAAP limits variable consideration to amount not probable of significant reversal.",
            ifrs: "IFRS uses 'highly probable' threshold which may be a higher hurdle."
          },
          {
            area: "Licenses",
            gaap: "More detailed guidance on determining nature of licenses.",
            ifrs: "Similar principles but less application guidance."
          },
          {
            area: "Disclosures",
            gaap: "Allows non-public entities certain disclosure exemptions.",
            ifrs: "Generally requires more extensive disclosures with fewer exemptions."
          }
        ];
      } else if (standards.some(s => s.id === 'GAAP-ASC-842') && standards.some(s => s.id === 'IFRS-16')) {
        return [
          {
            area: "Lease Classification",
            gaap: "Maintains distinction between operating and finance leases for lessees.",
            ifrs: "Single model for all leases, similar to finance leases under GAAP."
          },
          {
            area: "Low-value Exemption",
            gaap: "No specific exemption for low-value assets.",
            ifrs: "Explicit exemption for leases of low-value assets (e.g., under $5,000)."
          },
          {
            area: "Initial Direct Costs",
            gaap: "Broader definition of which costs can be capitalized.",
            ifrs: "Narrower definition, aligning with incremental costs from IFRS 15."
          }
        ];
      } else if (standards.some(s => s.id === 'GAAP-ASC-230') && standards.some(s => s.id === 'IFRS-7')) {
        return [
          {
            area: "Classification of Interest and Dividends",
            gaap: "Interest paid can be operating or financing; dividends paid are financing.",
            ifrs: "Interest and dividends paid can be operating or financing; interest and dividends received can be operating or investing."
          },
          {
            area: "Bank Overdrafts",
            gaap: "Generally not included in cash equivalents.",
            ifrs: "May be included in cash and cash equivalents if they form an integral part of cash management."
          },
          {
            area: "Restricted Cash",
            gaap: "Changes in restricted cash must be shown in the statement of cash flows.",
            ifrs: "Less prescriptive on presentation of restricted cash."
          }
        ];
      } else if (standards.some(s => s.id === 'GAAP-ASC-350') && standards.some(s => s.id === 'IFRS-36')) {
        return [
          {
            area: "Impairment Testing Frequency",
            gaap: "Annual goodwill impairment test required, with option for qualitative assessment.",
            ifrs: "Annual test required, but triggered at CGU level rather than reporting unit."
          },
          {
            area: "Impairment Reversal",
            gaap: "Prohibited for goodwill and indefinite-lived intangibles.",
            ifrs: "Allowed for assets other than goodwill if there is a change in estimates."
          },
          {
            area: "Impairment Calculation",
            gaap: "Two-step approach for goodwill, with fair value emphasis.",
            ifrs: "One-step approach using recoverable amount (higher of fair value less costs to sell and value in use)."
          }
        ];
      }
    }
    
    // Default generic differences
    return [
      {
        area: "Principles vs Rules",
        gaap: "Generally more rules-based with specific guidance.",
        ifrs: "More principles-based allowing greater judgment."
      },
      {
        area: "Industry Guidance",
        gaap: "Provides more industry-specific guidance.",
        ifrs: "Less industry-specific guidance."
      },
      {
        area: "Disclosures",
        gaap: "May have different disclosure requirements.",
        ifrs: "Often requires more extensive disclosures."
      }
    ];
  };

  const keyDifferences = getKeyDifferences();

  const handleExport = (format: string) => {
    toast({
      title: `Export Initiated`,
      description: `Comparison exported as ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BadgeDiff className="h-5 w-5" />
            Standards Comparison
          </h2>
          <p className="text-sm text-muted-foreground">
            Comparing {standards.length} standards
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Printer className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            toast({
              title: "Link Copied",
              description: "Comparison link copied to clipboard",
            });
          }}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {standards.map(standard => (
          <Card key={standard.id}>
            <CardHeader className="pb-2">
              <Badge className="w-fit mb-1">{standard.framework}</Badge>
              <CardTitle className="text-base">{standard.name}</CardTitle>
              <CardDescription className="text-sm">{standard.id}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{standard.description}</p>
              {standard.effectiveDate && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Effective Date: {new Date(standard.effectiveDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          {comparisonAreas.map(area => (
            <TabsTrigger key={area.id} value={area.id}>{area.name}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Overview</CardTitle>
              <CardDescription>
                High-level comparison of the standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Feature</TableHead>
                    {standards.map(standard => (
                      <TableHead key={standard.id}>{standard.framework}: {standard.id}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Framework</TableCell>
                    {standards.map(standard => (
                      <TableCell key={standard.id}>{standard.framework}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Category</TableCell>
                    {standards.map(standard => (
                      <TableCell key={standard.id}>{standard.category || "General"}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Effective Date</TableCell>
                    {standards.map(standard => (
                      <TableCell key={standard.id}>
                        {standard.effectiveDate 
                          ? new Date(standard.effectiveDate).toLocaleDateString() 
                          : "Not specified"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Last Updated</TableCell>
                    {standards.map(standard => (
                      <TableCell key={standard.id}>
                        {standard.lastUpdated 
                          ? new Date(standard.lastUpdated).toLocaleDateString() 
                          : "Not specified"}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Related Standards</TableCell>
                    {standards.map(standard => (
                      <TableCell key={standard.id}>
                        {standard.relatedStandards?.join(", ") || "None specified"}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recognition" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recognition Criteria</CardTitle>
              <CardDescription>
                When items should be recognized in financial statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {standards.map(standard => (
                  <div key={standard.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge>{standard.framework}</Badge>
                      <h3 className="font-medium">{standard.id}</h3>
                    </div>
                    <Separator />
                    <div className="prose prose-sm max-w-none">
                      {standard.id.includes('606') || standard.id.includes('15') ? (
                        <>
                          <p>Recognition criteria requires:</p>
                          <ul>
                            <li>Identify the contract with a customer</li>
                            <li>Identify the performance obligations</li>
                            <li>Determine transaction price</li>
                            <li>Allocate transaction price to performance obligations</li>
                            <li>Recognize revenue when performance obligations are satisfied</li>
                          </ul>
                        </>
                      ) : standard.id.includes('842') || standard.id.includes('16') ? (
                        <>
                          <p>Recognition criteria requires:</p>
                          <ul>
                            <li>Identify if contract contains a lease</li>
                            <li>Recognize right-of-use asset and lease liability</li>
                            <li>Measure initial recognition at present value of lease payments</li>
                            <li>Exceptions for short-term and low-value asset leases</li>
                          </ul>
                        </>
                      ) : standard.id.includes('350') || standard.id.includes('36') ? (
                        <>
                          <p>Impairment recognition criteria:</p>
                          <ul>
                            <li>Indicators of impairment must be assessed</li>
                            <li>Recoverable amount compared to carrying value</li>
                            <li>Impairment loss recognized when carrying amount exceeds recoverable amount</li>
                          </ul>
                        </>
                      ) : (
                        <p>Recognition criteria specific to this standard would be shown here in a comprehensive implementation.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Measurement</CardTitle>
              <CardDescription>
                How elements are measured in financial statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {standards.map(standard => (
                  <div key={standard.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge>{standard.framework}</Badge>
                      <h3 className="font-medium">{standard.id}</h3>
                    </div>
                    <Separator />
                    <div className="prose prose-sm max-w-none">
                      {standard.id.includes('606') || standard.id.includes('15') ? (
                        <>
                          <p>Measurement principles:</p>
                          <ul>
                            <li>Transaction price based on consideration expected to be entitled</li>
                            <li>Variable consideration estimated and included with constraint</li>
                            <li>Allocation based on standalone selling prices</li>
                            <li>Time value of money considered if significant</li>
                          </ul>
                        </>
                      ) : standard.id.includes('842') || standard.id.includes('16') ? (
                        <>
                          <p>Measurement principles:</p>
                          <ul>
                            <li>Initial measurement: Present value of lease payments plus initial direct costs</li>
                            <li>Discount rate: Implicit rate or incremental borrowing rate</li>
                            <li>Subsequent measurement: Cost model or fair value model</li>
                            <li>Remeasurement required for lease modifications</li>
                          </ul>
                        </>
                      ) : standard.id.includes('350') || standard.id.includes('36') ? (
                        <>
                          <p>Measurement principles:</p>
                          <ul>
                            <li>Recoverable amount: Higher of fair value less costs to sell and value in use</li>
                            <li>Value in use: Present value of future cash flows</li>
                            <li>Impairment allocated first to goodwill, then to other assets</li>
                          </ul>
                        </>
                      ) : (
                        <p>Measurement principles specific to this standard would be shown here in a comprehensive implementation.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disclosure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Disclosure Requirements</CardTitle>
              <CardDescription>
                Information required to be disclosed in financial statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {standards.map(standard => (
                  <div key={standard.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge>{standard.framework}</Badge>
                      <h3 className="font-medium">{standard.id}</h3>
                    </div>
                    <Separator />
                    <div className="prose prose-sm max-w-none">
                      {standard.id.includes('606') || standard.id.includes('15') ? (
                        <>
                          <p>Key disclosures include:</p>
                          <ul>
                            <li>Disaggregation of revenue</li>
                            <li>Contract balances</li>
                            <li>Performance obligations</li>
                            <li>Significant judgments</li>
                            <li>Costs to obtain or fulfill contracts</li>
                          </ul>
                        </>
                      ) : standard.id.includes('842') || standard.id.includes('16') ? (
                        <>
                          <p>Key disclosures include:</p>
                          <ul>
                            <li>Right-of-use assets by class</li>
                            <li>Lease liabilities maturity analysis</li>
                            <li>Short-term and low-value lease expenses</li>
                            <li>Variable lease payments</li>
                            <li>Sale and leaseback transactions</li>
                          </ul>
                        </>
                      ) : standard.id.includes('350') || standard.id.includes('36') ? (
                        <>
                          <p>Key disclosures include:</p>
                          <ul>
                            <li>Events and circumstances leading to impairment</li>
                            <li>Impairment losses by asset class</li>
                            <li>Valuation techniques and key assumptions</li>
                            <li>Sensitivity analysis for key assumptions</li>
                          </ul>
                        </>
                      ) : (
                        <p>Disclosure requirements specific to this standard would be shown here in a comprehensive implementation.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
              <CardDescription>
                Practical examples of applying the standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {standards.map(standard => (
                  <div key={standard.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge>{standard.framework}</Badge>
                      <h3 className="font-medium">{standard.id}</h3>
                    </div>
                    <Separator />
                    <div className="prose prose-sm max-w-none">
                      <ul>
                        {standard.examples?.map((example, index) => (
                          <li key={index}>{example}</li>
                        )) || (
                          <li>No examples specified for this standard</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="differences" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Differences</CardTitle>
              <CardDescription>
                Major differences between the standards being compared
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Area</TableHead>
                    <TableHead>GAAP</TableHead>
                    <TableHead>IFRS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keyDifferences.map((difference, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{difference.area}</TableCell>
                      <TableCell>{difference.gaap}</TableCell>
                      <TableCell>{difference.ifrs}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={onClose}>Close Comparison</Button>
      </div>
    </div>
  );
};

export default ComparisonTool;
