
import { QualificationTopic } from '../types';

export const cimaGateways: Record<string, QualificationTopic[]> = {
  'OCS': [
    { id: 'ocs-1', name: 'Operational Case Study', weight: 100 }
  ],
  'MCS': [
    { id: 'mcs-1', name: 'Management Case Study', weight: 100 }
  ],
  'SCS': [
    { id: 'scs-1', name: 'Strategic Case Study', weight: 100 }
  ]
};
