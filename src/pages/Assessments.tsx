
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Clock, 
  Calendar,
  AlertTriangle,
  BarChart2
} from 'lucide-react';

const Assessments = () => {
  // Mock data for assessments
  const upcomingAssessments = [
    {
      id: '1',
      title: 'Financial Accounting Quiz',
      type: 'Quiz',
      subject: 'ACCA - FA',
      date: 'Tomorrow, 10:00 AM',
      duration: '45 min',
      questions: 30,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Management Accounting Practice Test',
      type: 'Practice Test',
      subject: 'CPA - BEC',
      date: 'Sep 28, 2:00 PM',
      duration: '90 min',
      questions: 60,
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Corporate Reporting Diagnostic',
      type: 'Diagnostic',
      subject: 'ACCA - SBR',
      date: 'Oct 5, 9:00 AM',
      duration: '120 min',
      questions: 75,
      status: 'scheduled'
    }
  ];

  const pastAssessments = [
    {
      id: '4',
      title: 'Introduction to Financial Accounting',
      type: 'Quiz',
      subject: 'ACCA - FA',
      date: 'Sep 15, 2023',
      score: 85,
      status: 'passed'
    },
    {
      id: '5',
      title: 'Accounting Ethics Assessment',
      type: 'Exam',
      subject: 'CPA - AUD',
      date: 'Aug 28, 2023',
      score: 92,
      status: 'passed'
    },
    {
      id: '6',
      title: 'Cost Accounting Principles',
      type: 'Quiz',
      subject: 'CMA - Part 1',
      date: 'Aug 10, 2023',
      score: 78,
      status: 'passed'
    },
    {
      id: '7',
      title: 'Financial Statement Analysis',
      type: 'Practice Test',
      subject: 'CIMA - F1',
      date: 'Jul 22, 2023',
      score: 65,
      status: 'failed'
    }
  ];

  // Animation variants
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

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold">Assessments</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress with quizzes, practice tests, and diagnostic assessments.
          </p>
        </motion.div>

        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Assessments</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {upcomingAssessments.map((assessment) => (
                <motion.div 
                  key={assessment.id}
                  variants={item}
                  className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{assessment.type}</Badge>
                        <Badge variant="secondary">{assessment.subject}</Badge>
                      </div>
                      <h3 className="text-lg font-medium">{assessment.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{assessment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{assessment.duration}</span>
                        </div>
                        <div>
                          {assessment.questions} questions
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">Prepare</Button>
                      <Button size="sm">Take Assessment</Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {upcomingAssessments.length === 0 && (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Upcoming Assessments</h3>
                  <p className="text-muted-foreground">You don't have any scheduled assessments at the moment.</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="past">
            <motion.div 
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {pastAssessments.map((assessment) => (
                <motion.div 
                  key={assessment.id}
                  variants={item}
                  className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{assessment.type}</Badge>
                        <Badge variant="secondary">{assessment.subject}</Badge>
                        {assessment.status === 'passed' ? (
                          <Badge variant="success" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Passed</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-medium">{assessment.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{assessment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {assessment.status === 'passed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className={assessment.status === 'passed' ? "text-green-600" : "text-red-500"}>
                            Score: {assessment.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">Review</Button>
                      <Button variant="secondary" size="sm">Retry</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          
          <TabsContent value="recommended">
            <div className="text-center py-16 border border-dashed border-border rounded-lg">
              <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">Personalized Recommendations</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Based on your learning progress, we'll suggest assessments to help strengthen your knowledge in specific areas.
              </p>
              <Button>Complete a diagnostic test</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Assessment Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="border border-border rounded-lg p-5 bg-card">
            <h3 className="text-lg font-medium mb-3">Overall Performance</h3>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Score</span>
              <span className="font-medium">82%</span>
            </div>
            <Progress value={82} className="h-2 mb-4" />
            <div className="text-sm text-muted-foreground">Based on 12 completed assessments</div>
          </div>
          
          <div className="border border-border rounded-lg p-5 bg-card">
            <h3 className="text-lg font-medium mb-3">Strongest Areas</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Financial Reporting</span>
                <span className="font-medium text-green-600">95%</span>
              </li>
              <li className="flex justify-between">
                <span>Business Ethics</span>
                <span className="font-medium text-green-600">90%</span>
              </li>
              <li className="flex justify-between">
                <span>Audit Principles</span>
                <span className="font-medium text-green-600">88%</span>
              </li>
            </ul>
          </div>
          
          <div className="border border-border rounded-lg p-5 bg-card">
            <h3 className="text-lg font-medium mb-3">Areas for Improvement</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Tax Regulations</span>
                <span className="font-medium text-amber-600">65%</span>
              </li>
              <li className="flex justify-between">
                <span>Cost Accounting</span>
                <span className="font-medium text-amber-600">70%</span>
              </li>
              <li className="flex justify-between">
                <span>Financial Instruments</span>
                <span className="font-medium text-red-500">58%</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Assessments;
