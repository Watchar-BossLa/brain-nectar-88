import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  ExternalLink,
  Users,
  Trophy,
  Clock
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Qualifications = () => {
  // Mock data for qualifications
  const qualifications = [
    {
      id: 'acca',
      name: 'ACCA',
      fullName: 'Association of Chartered Certified Accountants',
      description: 'A globally recognized accounting qualification providing the skills, knowledge and professional values for a successful career in finance.',
      levels: ['Knowledge', 'Skills', 'Professional'],
      totalExams: 13,
      examsPassed: 5,
      startedDate: 'Jan 2023',
      expectedCompletion: 'Dec 2025',
      activeStudents: 2850,
      status: 'in-progress',
      color: 'bg-blue-500'
    },
    {
      id: 'cpa',
      name: 'CPA',
      fullName: 'Certified Public Accountant',
      description: 'The U.S. CPA certification is one of the most respected accounting credentials that demonstrates expertise in accounting and taxation.',
      levels: ['AUD', 'BEC', 'FAR', 'REG'],
      totalExams: 4,
      examsPassed: 1,
      startedDate: 'Mar 2023',
      expectedCompletion: 'Jun 2024',
      activeStudents: 3200,
      status: 'in-progress',
      color: 'bg-purple-500'
    },
    {
      id: 'cima',
      name: 'CIMA',
      fullName: 'Chartered Institute of Management Accountants',
      description: 'The largest professional body of management accountants offering the most relevant finance qualification for business.',
      levels: ['Operational', 'Management', 'Strategic'],
      totalExams: 9,
      examsPassed: 0,
      status: 'not-started',
      activeStudents: 1890,
      color: 'bg-emerald-500'
    },
    {
      id: 'cma',
      name: 'CMA',
      fullName: 'Certified Management Accountant',
      description: 'A globally recognized certification that demonstrates competency in management accounting and financial management.',
      levels: ['Part 1', 'Part 2'],
      totalExams: 2,
      examsPassed: 0,
      status: 'not-started',
      activeStudents: 1560,
      color: 'bg-amber-500'
    },
    {
      id: 'cfa',
      name: 'CFA',
      fullName: 'Chartered Financial Analyst',
      description: 'A globally recognized professional designation that measures and certifies the competence and integrity of financial analysts.',
      levels: ['Level I', 'Level II', 'Level III'],
      totalExams: 3,
      examsPassed: 0,
      status: 'not-started',
      activeStudents: 2750,
      color: 'bg-blue-600'
    },
    {
      id: 'frm',
      name: 'FRM',
      fullName: 'Financial Risk Manager',
      description: 'A professional designation for risk management professionals, with a focus on credit risk, market risk, operational risk, and investment management.',
      levels: ['Part I', 'Part II'],
      totalExams: 2,
      examsPassed: 0,
      status: 'not-started',
      activeStudents: 1450,
      color: 'bg-red-500'
    },
    {
      id: 'cfp',
      name: 'CFP',
      fullName: 'Certified Financial Planner',
      description: 'A professional certification for financial planners conferred by the Certified Financial Planner Board of Standards.',
      levels: ['Education', 'Exam', 'Experience', 'Ethics'],
      totalExams: 1,
      examsPassed: 0,
      status: 'not-started',
      activeStudents: 1890,
      color: 'bg-indigo-500'
    },
    {
      id: 'caia',
      name: 'CAIA',
      fullName: 'Chartered Alternative Investment Analyst',
      description: 'A professional designation offered by the CAIA Association to investment professionals who specialize in alternative investments.',
      levels: ['Level I', 'Level II'],
      totalExams: 2,
      examsPassed: 0,
      status: 'not-started',
      activeStudents: 980,
      color: 'bg-teal-500'
    },
  ];

  const accaModules = [
    {
      level: 'Knowledge',
      modules: [
        { code: 'BT', name: 'Business and Technology', status: 'passed' },
        { code: 'MA', name: 'Management Accounting', status: 'passed' },
        { code: 'FA', name: 'Financial Accounting', status: 'in-progress' }
      ]
    },
    {
      level: 'Skills',
      modules: [
        { code: 'LW', name: 'Corporate and Business Law', status: 'passed' },
        { code: 'PM', name: 'Performance Management', status: 'passed' },
        { code: 'TX', name: 'Taxation', status: 'passed' },
        { code: 'FR', name: 'Financial Reporting', status: 'scheduled' },
        { code: 'AA', name: 'Audit and Assurance', status: 'not-started' },
        { code: 'FM', name: 'Financial Management', status: 'not-started' }
      ]
    },
    {
      level: 'Professional',
      modules: [
        { code: 'SBL', name: 'Strategic Business Leader', status: 'not-started' },
        { code: 'SBR', name: 'Strategic Business Reporting', status: 'not-started' },
        { code: 'Advanced Options (2 out of 4)', name: 'Specialized papers', status: 'not-started' }
      ]
    }
  ];

  const cpaModules = [
    {
      level: 'Core Exams',
      modules: [
        { code: 'AUD', name: 'Auditing and Attestation', status: 'scheduled' },
        { code: 'BEC', name: 'Business Environment and Concepts', status: 'in-progress' },
        { code: 'FAR', name: 'Financial Accounting and Reporting', status: 'passed' },
        { code: 'REG', name: 'Regulation', status: 'not-started' }
      ]
    }
  ];

  const cfaModules = [
    {
      level: 'Program Structure',
      modules: [
        { code: 'L1', name: 'Level I - Investment Tools', status: 'not-started' },
        { code: 'L2', name: 'Level II - Asset Valuation', status: 'not-started' },
        { code: 'L3', name: 'Level III - Portfolio Management', status: 'not-started' }
      ]
    }
  ];

  const frmModules = [
    {
      level: 'Program Structure',
      modules: [
        { code: 'P1', name: 'Part I - Foundations of Risk Management', status: 'not-started' },
        { code: 'P2', name: 'Part II - Advanced Risk Management', status: 'not-started' }
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Passed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">Scheduled</Badge>;
      case 'not-started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold">Qualification Tracks</h1>
          <p className="text-muted-foreground mt-1">
            Professional accounting and finance certifications to advance your career.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {qualifications.map((qualification) => (
            <motion.div 
              key={qualification.id}
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
                        {accaModules.map((level, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            <h3 className="font-medium mb-3">{level.level} Level</h3>
                            <div className="space-y-2">
                              {level.modules.map((module, moduleIndex) => (
                                <div 
                                  key={moduleIndex} 
                                  className="flex items-center justify-between p-3 border border-border rounded-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="font-medium min-w-[40px]">{module.code}</div>
                                    <div>{module.name}</div>
                                  </div>
                                  {getStatusBadge(module.status)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
                        {cpaModules.map((level, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            <h3 className="font-medium mb-3">{level.level}</h3>
                            <div className="space-y-2">
                              {level.modules.map((module, moduleIndex) => (
                                <div 
                                  key={moduleIndex} 
                                  className="flex items-center justify-between p-3 border border-border rounded-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="font-medium min-w-[40px]">{module.code}</div>
                                    <div>{module.name}</div>
                                  </div>
                                  {getStatusBadge(module.status)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
                        {cfaModules.map((level, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            <h3 className="font-medium mb-3">{level.level}</h3>
                            <div className="space-y-2">
                              {level.modules.map((module, moduleIndex) => (
                                <div 
                                  key={moduleIndex} 
                                  className="flex items-center justify-between p-3 border border-border rounded-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="font-medium min-w-[40px]">{module.code}</div>
                                    <div>{module.name}</div>
                                  </div>
                                  {getStatusBadge(module.status)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
                        {frmModules.map((level, index) => (
                          <div key={index} className="mb-6 last:mb-0">
                            <h3 className="font-medium mb-3">{level.level}</h3>
                            <div className="space-y-2">
                              {level.modules.map((module, moduleIndex) => (
                                <div 
                                  key={moduleIndex} 
                                  className="flex items-center justify-between p-3 border border-border rounded-md"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="font-medium min-w-[40px]">{module.code}</div>
                                    <div>{module.name}</div>
                                  </div>
                                  {getStatusBadge(module.status)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-10 border border-border rounded-lg p-6 bg-card/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">Personalized Recommendation</h2>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <p className="mb-4">
                Based on your current progress and career goals in corporate accounting, we recommend:
              </p>
              <div className="p-4 border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Complete ACCA Financial Reporting (FR) next
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This module builds on your Financial Accounting knowledge and is essential for your long-term career goals in corporate accounting.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-background">Next Exam: Oct 15</Badge>
                  <Badge variant="outline" className="bg-background flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Est. Study Time: 120 hours
                  </Badge>
                </div>
              </div>
            </div>
            <Button className="md:self-center">Prepare for FR Exam</Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Qualifications;
