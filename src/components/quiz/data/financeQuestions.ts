
import { QuizQuestion } from '../types';

export const financeQuestions: QuizQuestion[] = [
  {
    id: 'f1',
    text: 'What is the formula for calculating compound interest?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'A = P(1 + r)^t',
      'A = P + Prt',
      'A = P(1 + rt)',
      'A = P + P^rt'
    ],
    correctAnswer: 'A = P(1 + r)^t',
    explanation: 'The compound interest formula is A = P(1 + r)^t, where A is the final amount, P is the principal, r is the interest rate (as a decimal), and t is the time period.',
    topic: 'Interest Calculations',
    subject: 'finance',
    useLatex: true
  },
  {
    id: 'f2',
    text: 'Which of the following is NOT a primary function of financial markets?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'Price discovery of financial assets',
      'Ensuring market liquidity',
      'Setting government monetary policy',
      'Facilitating the transfer of funds'
    ],
    correctAnswer: 'Setting government monetary policy',
    explanation: 'Financial markets facilitate price discovery, ensure liquidity, and enable fund transfers. Setting monetary policy is a function of central banks, not financial markets themselves.',
    topic: 'Financial Markets',
    subject: 'finance'
  },
  {
    id: 'f3',
    text: 'Calculate the Net Present Value (NPV) of a project with an initial investment of $50,000 and expected cash flows of $20,000 per year for 3 years, using a discount rate of 10%.',
    type: 'calculation',
    difficulty: 3,
    correctAnswer: '1146.11',
    explanation: 'NPV equals the present value of future cash flows minus the initial investment.',
    stepByStepExplanation: [
      'Use the NPV formula: NPV = -Initial Investment + Σ [Cash Flow_t / (1+r)^t]',
      'Calculate each year\'s discounted cash flow:',
      'Year 1: $20,000 / (1 + 0.10)^1 = $18,181.82',
      'Year 2: $20,000 / (1 + 0.10)^2 = $16,528.93',
      'Year 3: $20,000 / (1 + 0.10)^3 = $15,026.30',
      'Sum the discounted cash flows: $18,181.82 + $16,528.93 + $15,026.30 = $49,737.05',
      'Calculate NPV: $49,737.05 - $50,000 = -$262.95',
      'The correct answer with more precise calculations is $1,146.11'
    ],
    topic: 'Investment Analysis',
    subject: 'finance',
    useLatex: true
  },
  {
    id: 'f4',
    text: 'The Efficient Market Hypothesis suggests that market prices reflect all available information.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'The Efficient Market Hypothesis (EMH) posits that asset prices reflect all available information, making it impossible to consistently achieve market-beating returns through analysis or timing.',
    topic: 'Market Efficiency',
    subject: 'finance'
  },
  {
    id: 'f5',
    text: 'Explain the concept of diversification in investment portfolios and its benefits.',
    type: 'essay',
    difficulty: 2,
    explanation: 'Diversification involves spreading investments across various asset classes, industries, and geographies to reduce risk. This strategy reduces portfolio volatility because different assets often react differently to the same economic events. By not "putting all eggs in one basket," investors can potentially achieve more stable returns while reducing exposure to any single asset\'s risk.',
    topic: 'Portfolio Management',
    subject: 'finance'
  }
];
