
import { ModuleType } from '@/components/courses/ModulesList';

// Mock course meta data
export const courseMeta = {
  title: "Financial Accounting Fundamentals",
  description: "Master the core principles of financial accounting including the accounting cycle, financial statements, and GAAP.",
  category: "ACCA",
  progress: 65,
  modules: 8,
  completed: 4,
  totalDuration: "24 hours"
};

// Mock modules data
export const modules: ModuleType[] = [
  {
    id: 'module-1',
    title: 'Introduction to Financial Accounting',
    progress: 100,
    totalDuration: '3h 45m',
    topics: [
      { id: '1-1', title: 'The Accounting Environment', duration: '45m', isCompleted: true },
      { id: '1-2', title: 'Financial Statements Overview', duration: '1h', isCompleted: true },
      { id: '1-3', title: 'Users of Financial Information', duration: '1h', isCompleted: true },
      { id: '1-4', title: 'Accounting Standards Framework', duration: '1h', isCompleted: true },
    ]
  },
  {
    id: 'module-2',
    title: 'The Accounting Cycle',
    progress: 100,
    totalDuration: '4h 30m',
    topics: [
      { id: '2-1', title: 'Double-Entry Bookkeeping', duration: '1h 15m', isCompleted: true },
      { id: '2-2', title: 'Journal Entries and Ledgers', duration: '1h', isCompleted: true },
      { id: '2-3', title: 'Trial Balance Preparation', duration: '1h 15m', isCompleted: true },
      { id: '2-4', title: 'Adjusting Entries', duration: '1h', isCompleted: true },
    ]
  },
  {
    id: 'module-3',
    title: 'Financial Statements',
    progress: 75,
    totalDuration: '5h 15m',
    topics: [
      { id: '3-1', title: 'Income Statement', duration: '1h 30m', isCompleted: true },
      { id: '3-2', title: 'Balance Sheet', duration: '1h 30m', isCompleted: true },
      { id: '3-3', title: 'Cash Flow Statement', duration: '1h 15m', isCompleted: true },
      { id: '3-4', title: 'Statement of Changes in Equity', duration: '1h', isCompleted: false },
    ]
  },
  {
    id: 'module-4',
    title: 'Accounting for Assets',
    progress: 50,
    totalDuration: '4h',
    topics: [
      { id: '4-1', title: 'Current Assets', duration: '1h', isCompleted: true },
      { id: '4-2', title: 'Non-Current Assets', duration: '1h 30m', isCompleted: true },
      { id: '4-3', title: 'Depreciation Methods', duration: '1h 30m', isCompleted: false },
    ]
  },
  {
    id: 'module-5',
    title: 'Accounting for Liabilities',
    progress: 0,
    totalDuration: '4h 30m',
    topics: [
      { id: '5-1', title: 'Current Liabilities', duration: '1h 30m', isCompleted: false },
      { id: '5-2', title: 'Non-Current Liabilities', duration: '1h 30m', isCompleted: false },
      { id: '5-3', title: 'Provisions and Contingencies', duration: '1h 30m', isCompleted: false },
    ]
  },
];
