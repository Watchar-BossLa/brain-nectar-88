
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseHeader from '@/components/courses/CourseHeader';
import ModulesList from '@/components/courses/ModulesList';
import ResourcesTab from '@/components/courses/ResourcesTab';
import AssessmentsTab from '@/components/courses/AssessmentsTab';
import DiscussionTab from '@/components/courses/DiscussionTab';
import { courseMeta, modules } from '@/data/course-data';

const Courses = () => {
  return (
    <MainLayout>
      <div className="p-6 md:p-8">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Course Header */}
          <CourseHeader courseMeta={courseMeta} />
          
          {/* Course Tabs */}
          <Tabs defaultValue="modules" className="mb-8">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="modules" className="mt-6">
              <ModulesList modules={modules} />
            </TabsContent>
            
            <TabsContent value="resources">
              <ResourcesTab />
            </TabsContent>
            
            <TabsContent value="assessments">
              <AssessmentsTab />
            </TabsContent>
            
            <TabsContent value="discussion">
              <DiscussionTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Courses;
