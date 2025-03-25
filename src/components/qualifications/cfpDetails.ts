
import { QualificationTopic } from './types';

export const cfpEducationTopics: Record<string, QualificationTopic[]> = {
  'FPP': [
    { id: 'fpp-1', name: 'Financial Planning Process', weight: 25 },
    { id: 'fpp-2', name: 'Client Interaction', weight: 35 },
    { id: 'fpp-3', name: 'Ethics', weight: 40 }
  ],
  'IM': [
    { id: 'im-1', name: 'Investment Vehicles', weight: 25 },
    { id: 'im-2', name: 'Portfolio Theory', weight: 25 },
    { id: 'im-3', name: 'Investment Strategies', weight: 25 },
    { id: 'im-4', name: 'Asset Allocation', weight: 25 }
  ],
  'IP': [
    { id: 'ip-1', name: 'Life Insurance', weight: 25 },
    { id: 'ip-2', name: 'Health Insurance', weight: 25 },
    { id: 'ip-3', name: 'Property and Casualty Insurance', weight: 25 },
    { id: 'ip-4', name: 'Business Insurance', weight: 25 }
  ],
  'TP': [
    { id: 'tp-1', name: 'Income Tax Planning', weight: 30 },
    { id: 'tp-2', name: 'Estate Tax Planning', weight: 30 },
    { id: 'tp-3', name: 'Gift Tax Planning', weight: 20 },
    { id: 'tp-4', name: 'Tax Planning for Business Owners', weight: 20 }
  ],
  'RP': [
    { id: 'rp-1', name: 'Retirement Needs Analysis', weight: 25 },
    { id: 'rp-2', name: 'Qualified Retirement Plans', weight: 25 },
    { id: 'rp-3', name: 'Social Security and Medicare', weight: 25 },
    { id: 'rp-4', name: 'Distribution Planning', weight: 25 }
  ],
  'EP': [
    { id: 'ep-1', name: 'Estate Planning Documents', weight: 25 },
    { id: 'ep-2', name: 'Estate Planning Strategies', weight: 25 },
    { id: 'ep-3', name: 'Estate Planning for Business Owners', weight: 25 },
    { id: 'ep-4', name: 'Charitable Giving', weight: 25 }
  ]
};

export const cfpExamTopics: Record<string, QualificationTopic[]> = {
  'EX': [
    { id: 'ex-1', name: 'Comprehensive CFP® Examination', weight: 100 }
  ]
};

export const cfpExperienceTopics: Record<string, QualificationTopic[]> = {
  'PE': [
    { id: 'pe-1', name: 'Professional Experience Requirement', weight: 100 }
  ]
};

export const cfpEthicsTopics: Record<string, QualificationTopic[]> = {
  'ET': [
    { id: 'et-1', name: 'Ethics Declaration', weight: 50 },
    { id: 'et-2', name: 'Background Check', weight: 50 }
  ]
};
