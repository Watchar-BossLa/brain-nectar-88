
import React from 'react';
import { motion } from 'framer-motion';
import CourseCard from '@/components/ui/course-card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

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

const CoursesSection = () => {
  return (
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
  );
};

export default CoursesSection;
