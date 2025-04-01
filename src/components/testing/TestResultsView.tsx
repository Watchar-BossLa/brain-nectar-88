
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { TestResult } from '@/services/testing/AppTester';

interface TestResultsViewProps {
  results: TestResult;
  title: string;
}

export function TestResultsView({ results, title }: TestResultsViewProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge variant={results.success ? "default" : "destructive"}>
            {results.success ? "Passed" : "Failed"}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Executed in {results.duration}ms at {new Date(results.timestamp).toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {results.results.map((result, index) => (
          <Collapsible key={index} className="mb-2">
            <div className="flex items-center justify-between border rounded-md px-3 py-2">
              <div className="flex items-center gap-2">
                {result.success ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">{result.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={result.success ? "outline" : "destructive"} className="text-xs">
                  {result.success ? "Pass" : "Fail"}
                </Badge>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent>
              <div className="mt-1 pl-4 border-l-2 ml-2 text-sm">
                <p className="text-muted-foreground text-xs mb-1">{result.message}</p>
                
                {result.data && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold mb-1">Data:</div>
                    <pre className="text-xs bg-muted p-2 rounded-md overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                {!result.success && result.error && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription className="text-xs">
                      {result.error instanceof Error ? result.error.message : String(result.error)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
