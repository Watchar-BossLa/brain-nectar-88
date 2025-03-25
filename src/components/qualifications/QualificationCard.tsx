
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  Trophy,
  Users,
  ExternalLink
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { QualificationStructure } from './QualificationStructure';
import { QualificationType } from './types';

interface QualificationCardProps {
  qualification: QualificationType;
  getStatusBadge: (status: string) => React.ReactNode;
  accaModules: any[];
  cpaModules: any[];
  cfaModules: any[];
  frmModules: any[];
}

const QualificationCard: React.FC<QualificationCardProps> = ({ 
  qualification, 
  getStatusBadge,
  accaModules,
  cpaModules,
  cfaModules,
  frmModules
}) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={item}
      className="border border-border rounded-lg overflow-hidden"
    >
      <div className={`${qualification.color} h-2`}></div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold">{qualification.name}</h2>
              <span className="text-muted-foreground">({qualification.fullName})</span>
            </div>
            <p className="text-muted-foreground mt-2 max-w-3xl">{qualification.description}</p>
          </div>
          
          {qualification.status === 'in-progress' ? (
            <Button className="md:self-start">Continue Learning</Button>
          ) : (
            <Button variant="outline" className="md:self-start">Start Track</Button>
          )}
        </div>
        
        {qualification.status === 'in-progress' && (
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">
                {qualification.examsPassed}/{qualification.totalExams} exams passed
              </span>
            </div>
            <Progress 
              value={(qualification.examsPassed / qualification.totalExams) * 100} 
              className="h-2" 
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Exams</div>
              <div>{qualification.totalExams} total</div>
            </div>
          </div>
          
          {qualification.startedDate && (
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-full p-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Started</div>
                <div>{qualification.startedDate}</div>
              </div>
            </div>
          )}
          
          {qualification.expectedCompletion && (
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-full p-2">
                <Trophy className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Est. Completion</div>
                <div>{qualification.expectedCompletion}</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full p-2">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Active Students</div>
              <div>{qualification.activeStudents.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        {qualification.id === 'acca' && (
          <Accordion type="single" collapsible className="mt-6" defaultValue="acca-structure">
            <AccordionItem value="acca-structure">
              <AccordionTrigger>ACCA Qualification Structure</AccordionTrigger>
              <AccordionContent>
                <QualificationStructure modules={accaModules} getStatusBadge={getStatusBadge} />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink size={16} />
                    ACCA Official Website
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        {qualification.id === 'cpa' && (
          <Accordion type="single" collapsible className="mt-6" defaultValue="cpa-structure">
            <AccordionItem value="cpa-structure">
              <AccordionTrigger>CPA Exam Structure</AccordionTrigger>
              <AccordionContent>
                <QualificationStructure modules={cpaModules} getStatusBadge={getStatusBadge} />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink size={16} />
                    AICPA Official Website
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        {qualification.id === 'cfa' && (
          <Accordion type="single" collapsible className="mt-6" defaultValue="cfa-structure">
            <AccordionItem value="cfa-structure">
              <AccordionTrigger>CFA Program Structure</AccordionTrigger>
              <AccordionContent>
                <QualificationStructure modules={cfaModules} getStatusBadge={getStatusBadge} />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink size={16} />
                    CFA Institute Website
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        {qualification.id === 'frm' && (
          <Accordion type="single" collapsible className="mt-6" defaultValue="frm-structure">
            <AccordionItem value="frm-structure">
              <AccordionTrigger>FRM Program Structure</AccordionTrigger>
              <AccordionContent>
                <QualificationStructure modules={frmModules} getStatusBadge={getStatusBadge} />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ExternalLink size={16} />
                    GARP Official Website
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        
        {(qualification.id === 'cima' || qualification.id === 'cma' || qualification.id === 'cfp' || qualification.id === 'caia') && (
          <div className="flex justify-center mt-6">
            <Button>Explore {qualification.name} Structure</Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QualificationCard;
