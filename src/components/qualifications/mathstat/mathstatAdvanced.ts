
import { QualificationTopic } from '../types';

export const mathstatAdvancedTopics: Record<string, QualificationTopic[]> = {
  'MOD': [
    { id: 'mod-1', name: 'Linear Models', weight: 20 },
    { id: 'mod-2', name: 'Generalized Linear Models', weight: 20 },
    { id: 'mod-3', name: 'Bayesian Statistical Methods', weight: 30 },
    { id: 'mod-4', name: 'Time Series Analysis', weight: 30 }
  ],
  'COMP': [
    { id: 'comp-1', name: 'Computational Statistics', weight: 25 },
    { id: 'comp-2', name: 'Simulation Methods', weight: 25 },
    { id: 'comp-3', name: 'Statistical Computing', weight: 25 },
    { id: 'comp-4', name: 'Statistical Software', weight: 25 }
  ]
};
