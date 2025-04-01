
import React, { useState } from 'react';
import { TestResult } from '@/services/testing/AppTester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import type { TestResultDetail as TestResultDetailType } from '@/services/testing/AppTester';

export function TestResultsView({ 
  results, 
  title 
}: { 
  results: TestResult; 
  title: string;
}) {
  const passedTests = results.results.filter(r => r.success).length;
  const totalTests = results.results.length;
  const passPercentage = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            {results.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            {title}
          </div>
          <span className="text-sm font-normal">
            {passedTests}/{totalTests} passed
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={passPercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          {results.results.map((detail, index) => (
            <TestResultDetail key={index} detail={detail} />
          ))}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Completed in {results.duration}ms at {new Date(results.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}

function TestResultDetail({ detail }: { detail: TestResultDetailType }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={`border rounded-md ${detail.success ? 'bg-green-50/50' : 'bg-red-50/50'}`}
    >
      <div className="p-2 flex items-center justify-between">
        <div className="flex items-center">
          {detail.success ? (
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
          )}
          <span className={`text-sm ${detail.success ? 'text-green-700' : 'text-red-700'}`}>
            {detail.name}
          </span>
        </div>
        
        <CollapsibleTrigger asChild>
          <button className="p-1 rounded-md hover:bg-black/5">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="px-4 py-2 border-t text-sm">
          <p className="mb-2">{detail.message}</p>
          
          {(detail.data || detail.error) && (
            <div className="mt-2">
              <div className="text-xs font-medium mb-1">Details:</div>
              <pre className="text-xs bg-black/5 p-2 rounded-md overflow-auto max-h-40">
                {JSON.stringify(detail.data || detail.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
