
import { QualificationLevel } from '../types';
import { datascienceCoreTopics } from './datascienceCore';
import { datascienceSpecializedTopics } from './datascienceSpecialized';

// Export the Data Science modules with proper structure
export const datascienceModules: QualificationLevel[] = [
  {
    level: 'Core',
    modules: [
      { code: 'STAT', name: 'Statistical Foundations', status: 'not-started', topics: datascienceCoreTopics['STAT'] },
      { code: 'ML', name: 'Machine Learning', status: 'not-started', topics: datascienceCoreTopics['ML'] }
    ]
  },
  {
    level: 'Specialized',
    modules: [
      { code: 'DL', name: 'Deep Learning', status: 'not-started', topics: datascienceSpecializedTopics['DL'] },
      { code: 'BDA', name: 'Big Data Analytics', status: 'not-started', topics: datascienceSpecializedTopics['BDA'] }
    ]
  }
];

// Export the topic data
export { datascienceCoreTopics, datascienceSpecializedTopics };
