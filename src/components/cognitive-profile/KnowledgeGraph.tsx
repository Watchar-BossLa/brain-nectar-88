
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KnowledgeNodeProps {
  id: string;
  label: string;
  category: string;
  strength: number;
}

interface KnowledgeGraphProps {
  nodes: KnowledgeNodeProps[];
  categories: { [key: string]: string }; // category id to color
}

const KnowledgeGraph = ({ nodes, categories }: KnowledgeGraphProps) => {
  // Group nodes by category
  const groupedNodes: { [key: string]: KnowledgeNodeProps[] } = {};
  
  nodes.forEach(node => {
    if (!groupedNodes[node.category]) {
      groupedNodes[node.category] = [];
    }
    groupedNodes[node.category].push(node);
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Knowledge Connections</CardTitle>
        <CardDescription>Visualization of how concepts connect in your understanding</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedNodes).map(([category, categoryNodes]) => (
            <div key={category}>
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: categories[category] }} 
                />
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {categoryNodes.map(node => (
                  <Badge 
                    key={node.id}
                    variant="outline"
                    className="py-1.5 px-3"
                    style={{ 
                      borderColor: categories[node.category],
                      backgroundColor: `${categories[node.category]}${node.strength > 70 ? '30' : node.strength > 40 ? '20' : '10'}`
                    }}
                  >
                    {node.label}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
