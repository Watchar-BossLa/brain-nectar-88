
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import CourseCard from '@/components/ui/course-card';
import StatsCard from '@/components/ui/stats-card';
import { 
  BarChart2, 
  Clock, 
  Trophy, 
  BookOpen,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Mock data
  const currentCourses = [
    {
      id: '1',
      title: 'Financial Accounting Fundamentals',
      category: 'ACCA',
      progress: 65,
      modules: 8,
      duration: '24h total',
    },
    {
      id: '2',
      title: 'Management Accounting Techniques',
      category: 'CPA',
      progress: 32,
      modules: 12,
      duration: '32h total',
    },
    {
      id: '3',
      title: 'Corporate Reporting Standards',
      category: 'ACCA',
      progress: 78,
      modules: 6,
      duration: '18h total',
    }
  ];

  const upcomingAssessments = [
    {
      id: '1',
      title: 'Financial Accounting Quiz',
      date: 'Tomorrow, 10:00 AM',
      duration: '45 min',
    },
    {
      id: '2',
      title: 'Management Accounting Practice Test',
      date: 'Sep 28, 2:00 PM',
      duration: '90 min',
    }
  ];

  const recommendedTopics = [
    {
      id: '1',
      title: 'Depreciation Methods',
      category: 'Financial Accounting',
      strength: 40,
    },
    {
      id: '2',
      title: 'Cost Allocation Techniques',
      category: 'Management Accounting',
      strength: 35,
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
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold">Welcome back, Alex</h1>
          <p className="text-muted-foreground mt-1">
            Continue your learning journey where you left off.
          </p>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <StatsCard 
            title="Study Streak" 
            value="12 days" 
            trend="up" 
            trendValue="+3 from last week"
            icon={<Trophy size={20} />} 
          />
          <StatsCard 
            title="Study Time" 
            value="18.5 hours" 
            description="This week" 
            icon={<Clock size={20} />} 
          />
          <StatsCard 
            title="Completed Modules" 
            value="24/86" 
            icon={<BookOpen size={20} />} 
          />
          <StatsCard 
            title="Knowledge Mastery" 
            value="68%" 
            trend="up" 
            trendValue="+5% this month"
            icon={<BarChart2 size={20} />} 
          />
        </motion.div>
        
        {/* Continue Learning */}
        <motion.section 
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold">Continue Learning</h2>
            <Button variant="ghost" className="text-sm gap-1">
              View all <ChevronRight size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={course.category}
                progress={course.progress}
                modules={course.modules}
                duration={course.duration}
              />
            ))}
          </div>
        </motion.section>
        
        {/* Upcoming Assessments & Recommended Study */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Assessments */}
          <motion.div 
            className="border border-border rounded-xl p-5 bg-card"
            variants={item}
          >
            <h2 className="text-xl font-semibold mb-4">Upcoming Assessments</h2>
            
            <div className="space-y-4">
              {upcomingAssessments.map((assessment) => (
                <motion.div 
                  key={assessment.id} 
                  className="flex justify-between items-center p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <div>
                    <h3 className="font-medium">{assessment.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{assessment.date}</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span>
                      <Clock className="h-3.5 w-3.5" />
                      <span>{assessment.duration}</span>
                    </div>
                  </div>
                  <Button size="sm">Prepare</Button>
                </motion.div>
              ))}
            </div>
            
            {upcomingAssessments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No upcoming assessments</p>
              </div>
            )}
          </motion.div>
          
          {/* Recommended Study */}
          <motion.div 
            className="border border-border rounded-xl p-5 bg-card"
            variants={item}
          >
            <h2 className="text-xl font-semibold mb-4">Recommended Study</h2>
            
            <div className="space-y-4">
              {recommendedTopics.map((topic) => (
                <div key={topic.id} className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground">{topic.category}</p>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Knowledge strength</span>
                      <span>{topic.strength}%</span>
                    </div>
                    <Progress value={topic.strength} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Daily Study Goal */}
        <motion.div 
          className="border border-border rounded-xl p-5 bg-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Daily Study Goal</h2>
              <p className="text-muted-foreground text-sm">You've studied 45 minutes today</p>
            </div>
            <span className="text-primary font-medium mt-2 sm:mt-0">1.5 hours goal</span>
          </div>
          
          <Progress value={50} className="h-2 mb-2" />
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">45 minutes completed</span>
            <span className="text-sm text-muted-foreground">45 minutes remaining</span>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
