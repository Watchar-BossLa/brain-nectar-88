
import { QuizQuestion } from '../types';

export const mathQuestions: QuizQuestion[] = [
  {
    id: 'm1',
    text: 'What is the derivative of f(x) = x² with respect to x?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'f\'(x) = x',
      'f\'(x) = 2x',
      'f\'(x) = 2',
      'f\'(x) = x²'
    ],
    correctAnswer: 'f\'(x) = 2x',
    explanation: 'The derivative of x² is 2x. This follows from the power rule for differentiation which states that the derivative of x^n is n×x^(n-1).',
    topic: 'Calculus',
    subject: 'mathematics',
    useLatex: true
  },
  {
    id: 'm2',
    text: 'What is the value of the limit as x approaches 0 of (sin x)/x?',
    type: 'multiple-choice',
    difficulty: 3,
    options: [
      '0',
      '1',
      'undefined',
      'infinity'
    ],
    correctAnswer: '1',
    explanation: 'This is a fundamental limit in calculus. As x approaches 0, (sin x)/x approaches 1. This can be proven using L\'Hôpital\'s rule or the Taylor series expansion of sin x.',
    topic: 'Limits',
    subject: 'mathematics',
    useLatex: true
  },
  {
    id: 'm3',
    text: 'Calculate the area of a circle with radius 4 units.',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '50.27',
    explanation: 'The area of a circle is given by the formula A = πr².',
    stepByStepExplanation: [
      'Use the formula for the area of a circle: A = πr²',
      'Substitute the radius value: A = π × 4²',
      'Compute the square: A = π × 16',
      'Multiply by π: A = 16π',
      'Using π ≈ 3.14159: A ≈ 16 × 3.14159 ≈ 50.27 square units'
    ],
    topic: 'Geometry',
    subject: 'mathematics',
    useLatex: true
  },
  {
    id: 'm4',
    text: 'The probability of an event cannot be greater than 1.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'In probability theory, the probability of an event is a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty. The sum of probabilities of all possible outcomes equals 1.',
    topic: 'Probability',
    subject: 'mathematics'
  },
  {
    id: 'm5',
    text: 'Solve the system of equations: 2x + y = 5 and 3x - 2y = 4',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: 'x=2,y=1',
    explanation: 'This system can be solved by substitution or elimination methods.',
    stepByStepExplanation: [
      'From the first equation, express y in terms of x: y = 5 - 2x',
      'Substitute this into the second equation: 3x - 2(5 - 2x) = 4',
      'Simplify: 3x - 10 + 4x = 4',
      'Combine like terms: 7x - 10 = 4',
      'Add 10 to both sides: 7x = 14',
      'Divide by 7: x = 2',
      'Substitute back to find y: y = 5 - 2(2) = 5 - 4 = 1',
      'The solution is x = 2, y = 1'
    ],
    topic: 'Linear Algebra',
    subject: 'mathematics',
    useLatex: true
  }
];
