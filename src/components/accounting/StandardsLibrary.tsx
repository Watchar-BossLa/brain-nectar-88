
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AccountingStandard {
  id: string;
  name: string;
  description: string;
  framework: 'GAAP' | 'IFRS';
  content: string;
  examples?: string[];
  relatedStandards?: string[];
}

interface StandardsLibraryProps {
  standards?: AccountingStandard[];
  className?: string;
}

/**
 * Accounting Standards Library component
 */
const StandardsLibrary: React.FC<StandardsLibraryProps> = ({
  standards = [],
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFramework, setActiveFramework] = useState<'all' | 'GAAP' | 'IFRS'>('all');
  
  // Filter standards based on search query and active framework
  const filteredStandards = standards.filter(standard => {
    const matchesSearch = 
      standard.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      standard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFramework = activeFramework === 'all' || standard.framework === activeFramework;
    
    return matchesSearch && matchesFramework;
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Accounting Standards Library</CardTitle>
        <CardDescription>
          Comprehensive database of GAAP and IFRS standards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search standards..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setSearchQuery('')}>Clear</Button>
        </div>
        
        <Tabs defaultValue="all" onValueChange={(value) => setActiveFramework(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="GAAP">GAAP</TabsTrigger>
            <TabsTrigger value="IFRS">IFRS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <StandardsList standards={filteredStandards} />
          </TabsContent>
          
          <TabsContent value="GAAP" className="mt-4">
            <StandardsList standards={filteredStandards} />
          </TabsContent>
          
          <TabsContent value="IFRS" className="mt-4">
            <StandardsList standards={filteredStandards} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper component to display the list of standards
const StandardsList: React.FC<{ standards: AccountingStandard[] }> = ({ standards }) => {
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null);
  
  if (standards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No standards found matching your search criteria.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {standards.map(standard => (
        <Card key={standard.id} className="overflow-hidden">
          <div
            className="p-4 cursor-pointer flex justify-between items-center hover:bg-muted"
            onClick={() => setExpandedStandard(expandedStandard === standard.id ? null : standard.id)}
          >
            <div>
              <h3 className="font-medium">
                {standard.name}
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 rounded-full">
                  {standard.framework}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">{standard.description}</p>
            </div>
            <Button variant="ghost" size="sm">
              {expandedStandard === standard.id ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          
          {expandedStandard === standard.id && (
            <CardContent className="border-t pt-4">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: standard.content }} />
                
                {standard.examples && standard.examples.length > 0 && (
                  <>
                    <h4>Examples</h4>
                    <ul>
                      {standard.examples.map((example, index) => (
                        <li key={index}>{example}</li>
                      ))}
                    </ul>
                  </>
                )}
                
                {standard.relatedStandards && standard.relatedStandards.length > 0 && (
                  <>
                    <h4>Related Standards</h4>
                    <div className="flex flex-wrap gap-2">
                      {standard.relatedStandards.map(id => (
                        <Button 
                          key={id} 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedStandard(id);
                          }}
                        >
                          {id}
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default StandardsLibrary;
