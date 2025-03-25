
import { QualificationType, QualificationLevel } from './types';

export const qualifications: QualificationType[] = [
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
    description: 'A globally recognized professional designation that measures and certifies the competence and integrity of financial analysts. The curriculum covers ethical and professional standards, investment tools, asset classes, portfolio management, and wealth planning.',
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

export const accaModules: QualificationLevel[] = [
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

export const cpaModules: QualificationLevel[] = [
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

export const cfaModules: QualificationLevel[] = [
  {
    level: 'Level I',
    modules: [
      { 
        code: 'ETH', 
        name: 'Ethical and Professional Standards', 
        status: 'not-started' 
      },
      { 
        code: 'QM', 
        name: 'Quantitative Methods', 
        status: 'not-started' 
      },
      { 
        code: 'ECO', 
        name: 'Economics', 
        status: 'not-started' 
      },
      { 
        code: 'FRA', 
        name: 'Financial Reporting and Analysis', 
        status: 'not-started' 
      },
      { 
        code: 'CM', 
        name: 'Corporate Issuers', 
        status: 'not-started' 
      },
      { 
        code: 'EI', 
        name: 'Equity Investments', 
        status: 'not-started' 
      },
      { 
        code: 'FI', 
        name: 'Fixed Income', 
        status: 'not-started' 
      },
      { 
        code: 'DER', 
        name: 'Derivatives', 
        status: 'not-started' 
      },
      { 
        code: 'AI', 
        name: 'Alternative Investments', 
        status: 'not-started' 
      },
      { 
        code: 'PM', 
        name: 'Portfolio Management', 
        status: 'not-started' 
      }
    ]
  },
  {
    level: 'Level II',
    modules: [
      { 
        code: 'ETH', 
        name: 'Ethical and Professional Standards', 
        status: 'not-started' 
      },
      { 
        code: 'QM', 
        name: 'Quantitative Methods', 
        status: 'not-started' 
      },
      { 
        code: 'ECO', 
        name: 'Economics', 
        status: 'not-started' 
      },
      { 
        code: 'FRA', 
        name: 'Financial Reporting and Analysis', 
        status: 'not-started' 
      },
      { 
        code: 'CM', 
        name: 'Corporate Issuers', 
        status: 'not-started' 
      },
      { 
        code: 'EI', 
        name: 'Equity Investments', 
        status: 'not-started' 
      },
      { 
        code: 'FI', 
        name: 'Fixed Income', 
        status: 'not-started' 
      },
      { 
        code: 'DER', 
        name: 'Derivatives', 
        status: 'not-started' 
      },
      { 
        code: 'AI', 
        name: 'Alternative Investments', 
        status: 'not-started' 
      },
      { 
        code: 'PM', 
        name: 'Portfolio Management', 
        status: 'not-started' 
      }
    ]
  },
  {
    level: 'Level III',
    modules: [
      { 
        code: 'ETH', 
        name: 'Ethical and Professional Standards', 
        status: 'not-started' 
      },
      { 
        code: 'ECO', 
        name: 'Economics', 
        status: 'not-started' 
      },
      { 
        code: 'EI', 
        name: 'Equity Investments', 
        status: 'not-started' 
      },
      { 
        code: 'FI', 
        name: 'Fixed Income', 
        status: 'not-started' 
      },
      { 
        code: 'AI', 
        name: 'Alternative Investments', 
        status: 'not-started' 
      },
      { 
        code: 'PFP', 
        name: 'Private Wealth Management', 
        status: 'not-started' 
      },
      { 
        code: 'IPM', 
        name: 'Institutional Portfolio Management', 
        status: 'not-started' 
      },
      { 
        code: 'TPPM', 
        name: 'Trading, Performance, and Support', 
        status: 'not-started' 
      }
    ]
  }
];

export const frmModules: QualificationLevel[] = [
  {
    level: 'Part I',
    modules: [
      { code: 'FR', name: 'Foundations of Risk Management', status: 'not-started' },
      { code: 'QA', name: 'Quantitative Analysis', status: 'not-started' },
      { code: 'FM', name: 'Financial Markets and Products', status: 'not-started' },
      { code: 'VR', name: 'Valuation and Risk Models', status: 'not-started' }
    ]
  },
  {
    level: 'Part II',
    modules: [
      { code: 'MR', name: 'Market Risk Measurement and Management', status: 'not-started' },
      { code: 'CR', name: 'Credit Risk Measurement and Management', status: 'not-started' },
      { code: 'OR', name: 'Operational Risk and Resiliency', status: 'not-started' },
      { code: 'RM', name: 'Risk Management and Investment Management', status: 'not-started' },
      { code: 'PI', name: 'Current Issues in Financial Markets', status: 'not-started' }
    ]
  }
];

// Add new modules for CIMA
export const cimaModules: QualificationLevel[] = [
  {
    level: 'Operational',
    modules: [
      { code: 'E1', name: 'Managing Finance in a Digital World', status: 'not-started' },
      { code: 'P1', name: 'Management Accounting', status: 'not-started' },
      { code: 'F1', name: 'Financial Reporting', status: 'not-started' },
      { code: 'OCS', name: 'Operational Case Study', status: 'not-started' }
    ]
  },
  {
    level: 'Management',
    modules: [
      { code: 'E2', name: 'Managing Performance', status: 'not-started' },
      { code: 'P2', name: 'Advanced Management Accounting', status: 'not-started' },
      { code: 'F2', name: 'Advanced Financial Reporting', status: 'not-started' },
      { code: 'MCS', name: 'Management Case Study', status: 'not-started' }
    ]
  },
  {
    level: 'Strategic',
    modules: [
      { code: 'E3', name: 'Strategic Management', status: 'not-started' },
      { code: 'P3', name: 'Risk Management', status: 'not-started' },
      { code: 'F3', name: 'Financial Strategy', status: 'not-started' },
      { code: 'SCS', name: 'Strategic Case Study', status: 'not-started' }
    ]
  }
];

// Add new modules for CMA
export const cmaModules: QualificationLevel[] = [
  {
    level: 'Part 1',
    modules: [
      { code: 'EA', name: 'External Financial Reporting Decisions', status: 'not-started' },
      { code: 'ICR', name: 'Internal Controls and Technology', status: 'not-started' }
    ]
  },
  {
    level: 'Part 2',
    modules: [
      { code: 'FDM', name: 'Financial Decision Making', status: 'not-started' },
      { code: 'IP', name: 'Investment Planning and Professional Ethics', status: 'not-started' }
    ]
  }
];

// Add new modules for CFP
export const cfpModules: QualificationLevel[] = [
  {
    level: 'Education',
    modules: [
      { code: 'FPP', name: 'Financial Planning Process and Client Relationships', status: 'not-started' },
      { code: 'IM', name: 'Investment Management', status: 'not-started' },
      { code: 'IP', name: 'Insurance Planning', status: 'not-started' },
      { code: 'TP', name: 'Tax Planning', status: 'not-started' },
      { code: 'RP', name: 'Retirement Planning', status: 'not-started' },
      { code: 'EP', name: 'Estate Planning', status: 'not-started' }
    ]
  },
  {
    level: 'Exam',
    modules: [
      { code: 'EX', name: 'CFP® Certification Examination', status: 'not-started' }
    ]
  },
  {
    level: 'Experience',
    modules: [
      { code: 'PE', name: 'Professional Experience Requirement', status: 'not-started' }
    ]
  },
  {
    level: 'Ethics',
    modules: [
      { code: 'ET', name: 'Ethics Declaration and Background Check', status: 'not-started' }
    ]
  }
];

// Add new modules for CAIA
export const caiaModules: QualificationLevel[] = [
  {
    level: 'Level I',
    modules: [
      { code: 'PF', name: 'Professional Standards and Alternative Investments', status: 'not-started' },
      { code: 'PE', name: 'Private Equity and Private Debt', status: 'not-started' },
      { code: 'HF', name: 'Hedge Funds and Managed Futures', status: 'not-started' },
      { code: 'SR', name: 'Structured Products and Risk Management', status: 'not-started' }
    ]
  },
  {
    level: 'Level II',
    modules: [
      { code: 'AA', name: 'Asset Allocation and Institutional Investors', status: 'not-started' },
      { code: 'AP', name: 'Alternative Investment Strategies', status: 'not-started' },
      { code: 'DS', name: 'Due Diligence and Current Issues', status: 'not-started' }
    ]
  }
];
