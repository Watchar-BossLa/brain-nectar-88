
import { QualificationLevel } from '../types';
import { cfpEducationTopics } from './cfpEducation';
import { cfpExamTopics } from './cfpExam';
import { cfpExperienceTopics } from './cfpExperience';
import { cfpEthicsTopics } from './cfpEthics';

export const cfpModules: QualificationLevel[] = [
  {
    level: 'Education',
    modules: [
      { code: 'FPP', name: 'Financial Planning Process', status: 'not-started', topics: cfpEducationTopics['FPP'] },
      { code: 'IM', name: 'Investment Management', status: 'not-started', topics: cfpEducationTopics['IM'] },
      { code: 'IP', name: 'Insurance Planning', status: 'not-started', topics: cfpEducationTopics['IP'] },
      { code: 'TP', name: 'Tax Planning', status: 'not-started', topics: cfpEducationTopics['TP'] },
      { code: 'RP', name: 'Retirement Planning', status: 'not-started', topics: cfpEducationTopics['RP'] },
      { code: 'EP', name: 'Estate Planning', status: 'not-started', topics: cfpEducationTopics['EP'] }
    ]
  },
  {
    level: 'Exam',
    modules: [
      { code: 'EX', name: 'CFP® Examination', status: 'not-started', topics: cfpExamTopics['EX'] }
    ]
  },
  {
    level: 'Experience',
    modules: [
      { code: 'PE', name: 'Professional Experience', status: 'not-started', topics: cfpExperienceTopics['PE'] }
    ]
  },
  {
    level: 'Ethics',
    modules: [
      { code: 'ET', name: 'Ethics Requirements', status: 'not-started', topics: cfpEthicsTopics['ET'] }
    ]
  }
];

export { cfpEducationTopics, cfpExamTopics, cfpExperienceTopics, cfpEthicsTopics };
