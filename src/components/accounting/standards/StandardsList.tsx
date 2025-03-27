
import React from 'react';
import { AccountingStandard } from '../types/standards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Bookmark, FileText, ArrowUpDown } from 'lucide-react';

interface StandardsListProps {
  standards: AccountingStandard[];
  bookmarks: string[];
  selectedStandards: string[];
  onToggleBookmark: (id: string) => void;
  onToggleSelection: (id: string) => void;
}

const StandardsList: React.FC<StandardsListProps> = ({
  standards,
  bookmarks,
  selectedStandards,
  onToggleBookmark,
  onToggleSelection,
}) => {
  if (standards.length === 0) {
    return (
      <div className="p-12 text-center border rounded-lg">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-3" />
        <h3 className="text-lg font-medium mb-1">No Standards Found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {standards.map((standard) => (
        <Card key={standard.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between gap-2">
              <div>
                <CardTitle className="text-base font-semibold line-clamp-1">{standard.name}</CardTitle>
                <CardDescription className="line-clamp-2">{standard.description}</CardDescription>
              </div>
              <div className="flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleBookmark(standard.id)}
                  className={bookmarks.includes(standard.id) ? 'text-primary' : ''}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{standard.framework}</Badge>
              {standard.category && (
                <Badge variant="secondary">{standard.category}</Badge>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => window.open(`/standard/${standard.id}`, '_blank')}
                >
                  <FileText className="h-4 w-4" />
                  <span>View</span>
                </Button>
                <Button 
                  variant={selectedStandards.includes(standard.id) ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => onToggleSelection(standard.id)}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span>{selectedStandards.includes(standard.id) ? 'Selected' : 'Compare'}</span>
                </Button>
              </div>
              {standard.lastUpdated && (
                <div className="text-xs text-muted-foreground">
                  Updated: {standard.lastUpdated}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StandardsList;
