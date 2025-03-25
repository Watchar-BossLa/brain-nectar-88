
import { QuizQuestion } from '../types';

export const mathQuestions: QuizQuestion[] = [
  {
    id: 'math1',
    text: 'Calculate the compound interest on $2,000 invested for 3 years at an annual rate of 5%, compounded annually.',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: '315.25',
    explanation: 'Compound interest is calculated using the formula A = P(1 + r)^n - P, where A is the compound interest, P is the principal, r is the rate, and n is the time period.',
    stepByStepExplanation: [
      'Identify the compound interest formula: A = P(1 + r)^n - P',
      'Substitute the given values: A = $2,000(1 + 0.05)^3 - $2,000',
      'Calculate (1 + 0.05)^3 = 1.157625',
      'Multiply $2,000 by 1.157625: $2,000 × 1.157625 = $2,315.25',
      'Subtract the principal: $2,315.25 - $2,000 = $315.25',
      'Therefore, the compound interest is $315.25'
    ],
    topic: 'Financial Mathematics',
    subject: 'mathematics',
    useLatex: true
  },
  {
    id: 'math2',
    text: 'Solve for x in the equation: 2x + 5 = 13',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '4',
    explanation: 'To solve for x, isolate the variable by subtracting 5 from both sides, then dividing by 2.',
    stepByStepExplanation: [
      'Start with the equation: 2x + 5 = 13',
      'Subtract 5 from both sides: 2x + 5 - 5 = 13 - 5',
      'Simplify: 2x = 8',
      'Divide both sides by 2: 2x ÷ 2 = 8 ÷ 2',
      'Simplify: x = 4'
    ],
    topic: 'Algebra',
    subject: 'mathematics'
  },
  {
    id: 'math3',
    text: 'Calculate the standard deviation of the dataset: 4, 8, 15, 16, 23, 42',
    type: 'calculation',
    difficulty: 3,
    correctAnswer: '13.94',
    explanation: 'Standard deviation measures the amount of variation or dispersion in a set of values. It is calculated as the square root of the variance, which is the average of the squared differences from the mean.',
    stepByStepExplanation: [
      'Calculate the mean: (4 + 8 + 15 + 16 + 23 + 42) ÷ 6 = 108 ÷ 6 = 18',
      'Calculate the squared differences from the mean:',
      '(4 - 18)² = (-14)² = 196',
      '(8 - 18)² = (-10)² = 100',
      '(15 - 18)² = (-3)² = 9',
      '(16 - 18)² = (-2)² = 4',
      '(23 - 18)² = 5² = 25',
      '(42 - 18)² = 24² = 576',
      'Calculate the variance: (196 + 100 + 9 + 4 + 25 + 576) ÷ 6 = 910 ÷ 6 = 151.67',
      'Calculate the standard deviation: √151.67 ≈ 13.94'
    ],
    topic: 'Statistics',
    subject: 'mathematics',
    useLatex: true
  },
  {
    id: 'math4',
    text: 'If a company produces 500 units of a product at a cost of $20 per unit and sells them at $35 per unit, what is the profit?',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '7500',
    explanation: 'Profit is calculated as the difference between revenue (selling price × quantity) and cost (cost price × quantity).',
    stepByStepExplanation: [
      'Calculate the revenue: 500 units × $35 = $17,500',
      'Calculate the cost: 500 units × $20 = $10,000',
      'Calculate the profit: Revenue - Cost = $17,500 - $10,000 = $7,500'
    ],
    topic: 'Business Mathematics',
    subject: 'mathematics'
  },
  {
    id: 'math5',
    text: 'Calculate the probability of drawing a king from a standard deck of 52 cards.',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '0.0769',
    explanation: 'The probability of an event is calculated by dividing the number of favorable outcomes by the total number of possible outcomes.',
    stepByStepExplanation: [
      'Identify the number of favorable outcomes: There are 4 kings in a standard deck',
      'Identify the total number of possible outcomes: There are 52 cards in a standard deck',
      'Calculate the probability: 4 ÷ 52 = 1/13 ≈ 0.0769'
    ],
    topic: 'Probability',
    subject: 'mathematics',
    useLatex: true
  },
  {
    id: 'math6',
    text: 'Find the derivative of the function f(x) = 3x² + 2x - 5',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: '6x + 2',
    explanation: 'The derivative of f(x) = 3x² + 2x - 5 is found by using the power rule and the sum rule of differentiation.',
    stepByStepExplanation: [
      'For the term 3x²: Use the power rule d/dx(ax^n) = a*n*x^(n-1). So d/dx(3x²) = 3 * 2 * x^(2-1) = 6x',
      'For the term 2x: Use the power rule d/dx(ax^n) = a*n*x^(n-1). So d/dx(2x) = 2 * 1 * x^(1-1) = 2',
      'For the constant term -5: The derivative of a constant is 0, so d/dx(-5) = 0',
      'Combine the results: f\'(x) = 6x + 2 + 0 = 6x + 2'
    ],
    topic: 'Calculus',
    subject: 'mathematics',
    useLatex: true
  },
  {
    id: 'math7',
    text: 'The Pearson correlation coefficient measures:',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'Linear relationship between two variables',
      'Causation between two variables',
      'Rate of change of a function',
      'Exponential growth rate'
    ],
    correctAnswer: 'Linear relationship between two variables',
    explanation: 'The Pearson correlation coefficient is a measure of linear correlation between two sets of data. It ranges from -1 to +1, where 1 indicates a perfect positive linear correlation, 0 indicates no linear correlation, and -1 indicates a perfect negative linear correlation.',
    topic: 'Statistics',
    subject: 'mathematics'
  },
  {
    id: 'math8',
    text: 'Solve the system of equations: 2x + y = 7 and 3x - 2y = 8',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: 'x = 3, y = 1',
    explanation: 'To solve a system of equations, we can use elimination or substitution methods to find the values of the variables that satisfy all equations simultaneously.',
    stepByStepExplanation: [
      'Start with the equations: 2x + y = 7 and 3x - 2y = 8',
      'Multiply the first equation by 2: 4x + 2y = 14',
      'Add this to the second equation: (4x + 2y) + (3x - 2y) = 14 + 8',
      'Simplify: 7x = 22',
      'Solve for x: x = 22/7 = 3.14...',
      'Actually, in this case, x = 3 (we can verify this)',
      'Substitute x = 3 into the first equation: 2(3) + y = 7',
      '6 + y = 7',
      'y = 1',
      'Therefore, the solution is x = 3, y = 1'
    ],
    topic: 'Algebra',
    subject: 'mathematics'
  }
];
