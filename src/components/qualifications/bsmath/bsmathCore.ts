
import { QualificationTopic } from '../types';

export const bsmathCoreTopics: Record<string, QualificationTopic[]> = {
  'CALC': [
    { id: 'calc-1', name: 'Calculus I: Differential Calculus', weight: 25 },
    { id: 'calc-2', name: 'Calculus II: Integral Calculus', weight: 25 },
    { id: 'calc-3', name: 'Calculus III: Multivariable Calculus', weight: 25 },
    { id: 'calc-4', name: 'Differential Equations', weight: 25 }
  ],
  'ALG': [
    { id: 'alg-1', name: 'Linear Algebra', weight: 30 },
    { id: 'alg-2', name: 'Abstract Algebra', weight: 30 },
    { id: 'alg-3', name: 'Number Theory', weight: 20 },
    { id: 'alg-4', name: 'Discrete Mathematics', weight: 20 }
  ]
};
