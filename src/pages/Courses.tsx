
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ClipboardCheck, FileText, MessageSquare } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import CourseHeader from '@/components/courses/CourseHeader';
import ModulesList from '@/components/courses/ModulesList';
import ResourcesTab from '@/components/courses/ResourcesTab';
import AssessmentsTab from '@/components/courses/AssessmentsTab';
import DiscussionTab from '@/components/courses/DiscussionTab';
import { courseMeta, modules } from '@/data/course-data';

// Define tab types
type TabType = 'modules' | 'resources' | 'assessments' | 'discussion';

const Courses = () => {
  const [activeTab, setActiveTab] = useState<TabType>('modules');
  
  // Tab configuration
  const tabs = [
    { 
      id: 'modules' as TabType, 
      label: 'Modules', 
      icon: <BookOpen className="h-4 w-4 mr-2" /> 
    },
    { 
      id: 'resources' as TabType, 
      label: 'Resources', 
      icon: <FileText className="h-4 w-4 mr-2" /> 
    },
    { 
      id: 'assessments' as TabType, 
      label: 'Assessments', 
      icon: <ClipboardCheck className="h-4 w-4 mr-2" /> 
    },
    { 
      id: 'discussion' as TabType, 
      label: 'Discussion', 
      icon: <MessageSquare className="h-4 w-4 mr-2" /> 
    },
  ];
  
  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'modules':
        return <ModulesList modules={modules} />;
      case 'resources':
        return <ResourcesTab />;
      case 'assessments':
        return <AssessmentsTab />;
      case 'discussion':
        return <DiscussionTab />;
      default:
        return null;
    }
  };
  
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
          
          {/* Improved Course Tabs Navigation */}
          <div className="mb-8 mt-6">
            {/* Mobile Tab Navigation (scrollable) */}
            <div className="flex overflow-x-auto pb-2 sm:hidden">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Desktop Tab Navigation */}
            <div className="hidden sm:flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent hover:border-muted-foreground/30 hover:text-foreground/80'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Courses;
