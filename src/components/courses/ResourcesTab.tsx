
import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ResourcesTab = () => {
  const resources = [
    { id: 1, name: "Financial Accounting Textbook PDF", type: "PDF", size: "12.4 MB" },
    { id: 2, name: "Chapter 1 Lecture Slides", type: "PPTX", size: "5.8 MB" },
    { id: 3, name: "Practice Exercises - Week 1", type: "PDF", size: "2.1 MB" },
    { id: 4, name: "Accounting Principles Cheat Sheet", type: "PDF", size: "1.5 MB" }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Course Resources</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map(resource => (
            <TableRow key={resource.id}>
              <TableCell className="font-medium">{resource.name}</TableCell>
              <TableCell>{resource.type}</TableCell>
              <TableCell>{resource.size}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResourcesTab;
