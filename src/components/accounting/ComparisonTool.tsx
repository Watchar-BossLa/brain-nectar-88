
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { AccountingStandard } from './types/standards';

interface ComparisonToolProps {
  standards: AccountingStandard[];
  onClose: () => void;
}

const ComparisonTool: React.FC<ComparisonToolProps> = ({ standards, onClose }) => {
  if (standards.length === 0) {
    return (
      <div className="text-center py-8">
        <p>Please select at least one standard to compare.</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  if (standards.length === 1) {
    return (
      <div className="text-center py-8">
        <p>Please select a second standard to compare with {standards[0].name}.</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  const standardA = standards[0];
  const standardB = standards[1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{standardA.name}</h3>
            <Badge>{standardA.framework}</Badge>
            <p className="text-sm mt-2">{standardA.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold">{standardB.name}</h3>
            <Badge>{standardB.framework}</Badge>
            <p className="text-sm mt-2">{standardB.description}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Comparison</TabsTrigger>
          <TabsTrigger value="practical">Practical Implications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Feature</div>
                <div className="font-medium">{standardA.framework}</div>
                <div className="font-medium">{standardB.framework}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t pt-2">
                <div>Effective Date</div>
                <div>{standardA.effectiveDate || 'Not specified'}</div>
                <div>{standardB.effectiveDate || 'Not specified'}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t pt-2">
                <div>Last Updated</div>
                <div>{standardA.lastUpdated || 'Not specified'}</div>
                <div>{standardB.lastUpdated || 'Not specified'}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t pt-2">
                <div>Category</div>
                <div>{standardA.category || 'General'}</div>
                <div>{standardB.category || 'General'}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Key Differences</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-50 border border-red-200 rounded-full p-1 mr-2">
                    <X className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium">Definition & Scope</p>
                    <p className="text-sm text-muted-foreground">
                      {standardA.framework} focuses more on specific rules, while {standardB.framework} takes a principles-based approach.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-full p-1 mr-2">
                    <ArrowRight className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">Recognition Criteria</p>
                    <p className="text-sm text-muted-foreground">
                      Similar core principles but {standardB.framework} provides more specific guidance on certain scenarios.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-50 border border-green-200 rounded-full p-1 mr-2">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Disclosure Requirements</p>
                    <p className="text-sm text-muted-foreground">
                      Both standards require similar disclosures with minor differences in detail level.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practical" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Practical Application</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Implementation Complexity</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="border rounded p-3">
                      <p className="font-medium">{standardA.framework}</p>
                      <p className="text-sm">Medium complexity with detailed rules-based guidance</p>
                    </div>
                    <div className="border rounded p-3">
                      <p className="font-medium">{standardB.framework}</p>
                      <p className="text-sm">Higher complexity due to principles-based approach requiring more judgment</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Financial Statement Impact</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="border rounded p-3">
                      <p className="font-medium">{standardA.framework}</p>
                      <p className="text-sm">May result in earlier recognition of certain transactions</p>
                    </div>
                    <div className="border rounded p-3">
                      <p className="font-medium">{standardB.framework}</p>
                      <p className="text-sm">More consistent treatment across different transaction types</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Common Pitfalls</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="border rounded p-3">
                      <p className="font-medium">{standardA.framework}</p>
                      <ul className="text-sm list-disc pl-4">
                        <li>Over-reliance on specific rules</li>
                        <li>Missing exceptions and scope limitations</li>
                      </ul>
                    </div>
                    <div className="border rounded p-3">
                      <p className="font-medium">{standardB.framework}</p>
                      <ul className="text-sm list-disc pl-4">
                        <li>Inconsistent application of principles</li>
                        <li>Insufficient documentation of judgments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Standards
        </Button>
        <Button variant="default">
          Download Comparison
        </Button>
      </div>
    </div>
  );
};

export default ComparisonTool;
