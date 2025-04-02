
/**
 * Central management for all subjects supported by Study Bee
 */

export type SubjectInfo = {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  primaryPath: string; // Primary navigation path for this subject
};

export const subjects: Record<string, SubjectInfo> = {
  accounting: {
    id: 'accounting',
    name: 'Accounting',
    description: 'Master financial accounting principles, standards, and practices',
    icon: 'Calculator',
    color: 'text-blue-500',
    primaryPath: '/qualifications'
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    description: 'Learn financial management, investment analysis, and valuation techniques',
    icon: 'LineChart',
    color: 'text-green-500',
    primaryPath: '/finance'
  },
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Develop skills in pure and applied mathematics concepts and problem-solving',
    icon: 'PlusSquare',
    color: 'text-violet-500',
    primaryPath: '/mathematics'
  },
  statistics: {
    id: 'statistics', 
    name: 'Statistics',
    description: 'Master data analysis, probability theory, and statistical inference methods',
    icon: 'BarChart2',
    color: 'text-amber-500',
    primaryPath: '/statistics'
  },
  dataScience: {
    id: 'dataScience',
    name: 'Data Science',
    description: 'Learn data analysis, machine learning, and data visualization techniques',
    icon: 'Database',
    color: 'text-cyan-500',
    primaryPath: '/data-science'
  }
};

export type SubjectId = keyof typeof subjects;

export const getSubjectInfo = (subjectId: string): SubjectInfo => {
  return subjects[subjectId as SubjectId] || subjects.accounting;
};

export const getAllSubjects = (): SubjectInfo[] => {
  return Object.values(subjects);
};
