
import { QualificationTopic } from '../types';

export const datascienceSpecializedTopics: Record<string, QualificationTopic[]> = {
  'DL': [
    { id: 'dl-1', name: 'Neural Networks', weight: 20 },
    { id: 'dl-2', name: 'Deep Learning Architectures', weight: 30 },
    { id: 'dl-3', name: 'Natural Language Processing', weight: 25 },
    { id: 'dl-4', name: 'Computer Vision', weight: 25 }
  ],
  'BDA': [
    { id: 'bda-1', name: 'Big Data Technologies', weight: 20 },
    { id: 'bda-2', name: 'Data Engineering', weight: 20 },
    { id: 'bda-3', name: 'Data Visualization', weight: 30 },
    { id: 'bda-4', name: 'Business Intelligence', weight: 30 }
  ]
};
