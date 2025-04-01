
import React from 'react';
import { TestIssue } from '@/services/testing/TestRunner';
import { AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface IssuesListProps {
  issues: TestIssue[];
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  if (issues.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <Info className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">No issues found</h3>
        <p className="text-muted-foreground">All tests passed successfully.</p>
      </div>
    );
  }

  // Sort issues by severity (critical first)
  const sortedIssues = [...issues].sort((a, b) => {
    const severityRank = {
      'critical': 0,
      'high': 1,
      'moderate': 2,
      'low': 3
    };
    return severityRank[a.severity] - severityRank[b.severity];
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    let className = '';
    
    switch (severity) {
      case 'critical':
        className = 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
        break;
      case 'high':
        className = 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200';
        break;
      case 'moderate':
        className = 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
        break;
      case 'low':
        className = 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
        break;
    }
    
    return (
      <Badge variant="outline" className={className}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Found Issues ({issues.length})</CardTitle>
        <CardDescription>
          The following issues were identified during testing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedIssues.map((issue, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(issue.severity)}
                  <h3 className="font-medium">Issue in {issue.component}</h3>
                </div>
                {getSeverityBadge(issue.severity)}
              </div>
              
              <p className="text-sm mb-3 text-muted-foreground">
                {issue.description}
              </p>
              
              <Separator className="my-2" />
              
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Recommendation:</h4>
                <p className="text-sm text-muted-foreground">
                  {issue.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
