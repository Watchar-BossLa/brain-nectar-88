
import { QuizQuestion } from '../types';

export const financeQuestions: QuizQuestion[] = [
  {
    id: 'fin1',
    text: 'What is the Capital Asset Pricing Model (CAPM) used for?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'To calculate the expected return on investment',
      'To determine the optimal capital structure',
      'To value fixed income securities',
      'To measure operational efficiency'
    ],
    correctAnswer: 'To calculate the expected return on investment',
    explanation: 'The Capital Asset Pricing Model (CAPM) is used to determine the theoretical appropriate required rate of return of an asset, to make decisions about adding assets to a diversified portfolio.',
    topic: 'Investment Analysis',
    subject: 'finance'
  },
  {
    id: 'fin2',
    text: 'Which of the following ratios is used to assess a company\'s ability to pay its short-term obligations?',
    type: 'multiple-choice',
    difficulty: 1,
    options: [
      'Current Ratio',
      'Debt-to-Equity Ratio',
      'Return on Assets',
      'Price-to-Earnings Ratio'
    ],
    correctAnswer: 'Current Ratio',
    explanation: 'The Current Ratio is a liquidity ratio that measures a company\'s ability to pay short-term obligations. It is calculated by dividing current assets by current liabilities.',
    topic: 'Financial Ratios',
    subject: 'finance'
  },
  {
    id: 'fin3',
    text: 'Calculate the present value of $10,000 to be received in 5 years, assuming an annual discount rate of 6%.',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: '7473',
    explanation: 'The present value is calculated using the formula PV = FV / (1 + r)^n, where FV is future value, r is the discount rate, and n is the number of periods.',
    stepByStepExplanation: [
      'Identify the formula: Present Value (PV) = Future Value (FV) / (1 + r)^n',
      'Substitute the given values: PV = $10,000 / (1 + 0.06)^5',
      'Calculate (1 + 0.06)^5 = 1.3382',
      'Divide $10,000 by 1.3382: $10,000 / 1.3382 = $7,473.17',
      'Therefore, the present value is approximately $7,473'
    ],
    topic: 'Time Value of Money',
    subject: 'finance'
  },
  {
    id: 'fin4',
    text: 'The efficient market hypothesis suggests that stock prices reflect all available information.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'The efficient market hypothesis (EMH) states that asset prices reflect all available information. In an efficient market, it would be impossible to consistently outperform the market through expert stock selection or market timing.',
    topic: 'Market Efficiency',
    subject: 'finance'
  },
  {
    id: 'fin5',
    text: 'Explain the concept of diversification in portfolio management and why it is important for investors.',
    type: 'essay',
    difficulty: 3,
    explanation: 'Diversification is a risk management strategy that mixes a variety of investments within a portfolio. The rationale behind this technique is that a portfolio constructed of different kinds of assets will, on average, yield higher long-term returns and lower the risk of any individual holding or security. It aims to reduce non-systematic risk by investing in various assets that would each react differently to the same event.',
    topic: 'Portfolio Management',
    subject: 'finance'
  },
  {
    id: 'fin6',
    text: 'Which financial ratio would be most useful to analyze a company\'s operational efficiency?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'Asset Turnover Ratio',
      'Price-to-Earnings Ratio',
      'Debt-to-Equity Ratio',
      'Dividend Yield'
    ],
    correctAnswer: 'Asset Turnover Ratio',
    explanation: 'The Asset Turnover Ratio measures how efficiently a company is using its assets to generate revenue. It is calculated by dividing total revenue by average total assets. A higher ratio indicates better operational efficiency.',
    topic: 'Financial Analysis',
    subject: 'finance'
  },
  {
    id: 'fin7',
    text: 'Calculate the future value of $5,000 invested for 3 years at an annual compound interest rate of 4%.',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '5624',
    explanation: 'Future value with compound interest is calculated using the formula FV = P(1 + r)^n, where P is the principal amount, r is the interest rate, and n is the number of time periods.',
    stepByStepExplanation: [
      'Identify the formula: Future Value (FV) = Principal (P) × (1 + r)^n',
      'Substitute the given values: FV = $5,000 × (1 + 0.04)^3',
      'Calculate (1 + 0.04)^3 = 1.1249',
      'Multiply $5,000 by 1.1249: $5,000 × 1.1249 = $5,624.32',
      'Therefore, the future value is approximately $5,624'
    ],
    topic: 'Time Value of Money',
    subject: 'finance'
  },
  {
    id: 'fin8',
    text: 'In finance, beta is a measure of:',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'Volatility compared to the market',
      'Expected return on investment',
      'Liquidity of an asset',
      'A company\'s debt level'
    ],
    correctAnswer: 'Volatility compared to the market',
    explanation: 'Beta is a measure of a stock\'s volatility in relation to the overall market. A beta of 1 indicates that the security\'s price moves with the market. A beta greater than 1 indicates higher volatility than the market, while a beta less than 1 indicates lower volatility.',
    topic: 'Risk Assessment',
    subject: 'finance'
  }
];
