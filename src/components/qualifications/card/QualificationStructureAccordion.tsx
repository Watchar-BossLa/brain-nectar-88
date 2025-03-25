
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QualificationStructure } from '../QualificationStructure';

interface QualificationStructureAccordionProps {
  qualificationId: string;
  modules: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  accordionName: string;
  websiteName: string;
}

const QualificationStructureAccordion: React.FC<QualificationStructureAccordionProps> = ({
  qualificationId,
  modules,
  getStatusBadge,
  accordionName,
  websiteName
}) => {
  if (!modules) {
    return null;
  }
  
  return (
    <Accordion type="single" collapsible className="mt-6" defaultValue={`${qualificationId}-structure`}>
      <AccordionItem value={`${qualificationId}-structure`}>
        <AccordionTrigger>{accordionName}</AccordionTrigger>
        <AccordionContent>
          <QualificationStructure modules={modules} getStatusBadge={getStatusBadge} />
          <div className="flex justify-end mt-4">
            <Button variant="outline" size="sm" className="gap-1">
              <ExternalLink size={16} />
              {websiteName}
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default QualificationStructureAccordion;
