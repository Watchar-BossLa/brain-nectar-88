
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { AccountingStandard } from '../types/standards';

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
  onToggleSelection
}) => {
  const [expandedStandard, setExpandedStandard] = useState<string | null>(null);
  
  if (standards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
        <BookOpen className="h-12 w-12 text-muted-foreground/50" />
        <p>No standards found matching your search criteria.</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing {standards.length} standard{standards.length !== 1 ? 's' : ''}
      </p>
      
      {standards.map(standard => (
        <Card key={standard.id} className={`overflow-hidden ${selectedStandards.includes(standard.id) ? 'border-primary' : ''}`}>
          <div
            className="p-4 cursor-pointer hover:bg-muted"
            onClick={() => setExpandedStandard(expandedStandard === standard.id ? null : standard.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {standard.name}
                  <Badge className="ml-2">
                    {standard.framework}
                  </Badge>
                  {standard.category && (
                    <Badge variant="outline" className="ml-1">
                      {standard.category}
                    </Badge>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{standard.description}</p>
                {standard.lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(standard.lastUpdated).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={selectedStandards.includes(standard.id) ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelection(standard.id);
                  }}
                >
                  {selectedStandards.includes(standard.id) ? "Selected" : "Select for Compare"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(standard.id);
                  }}
                  className={bookmarks.includes(standard.id) ? "text-yellow-500" : "text-muted-foreground"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={bookmarks.includes(standard.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                  </svg>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedStandard(expandedStandard === standard.id ? null : standard.id);
                  }}
                >
                  {expandedStandard === standard.id ? 'Collapse' : 'Expand'}
                </Button>
              </div>
            </div>
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
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`#/standards/${standard.id}`, '_blank');
                    }}
                  >
                    View Full Standard
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default StandardsList;
