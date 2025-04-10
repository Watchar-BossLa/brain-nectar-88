/**
 * Finance Service
 * Provides functionality for finance learning features
 */

/**
 * Fetch finance topics
 * @returns {Promise<Array>} Array of finance topics
 */
export const getFinanceTopics = async () => {
  // This would typically be a fetch call to an API
  return [
    {
      id: 'personal-finance',
      name: 'Personal Finance',
      description: 'Managing individual finances',
      subtopics: [
        { id: 'budgeting', name: 'Budgeting & Financial Planning' },
        { id: 'saving-investing', name: 'Saving & Investment Strategies' },
        { id: 'credit-management', name: 'Credit Management' },
        { id: 'tax-planning', name: 'Tax Planning' },
        { id: 'retirement-planning', name: 'Retirement Planning' }
      ]
    },
    {
      id: 'corporate-finance',
      name: 'Corporate Finance',
      description: 'Financial management for businesses',
      subtopics: [
        { id: 'financial-statements', name: 'Financial Statement Analysis' },
        { id: 'capital-budgeting', name: 'Capital Budgeting' },
        { id: 'working-capital', name: 'Working Capital Management' },
        { id: 'capital-structure', name: 'Capital Structure' },
        { id: 'dividend-policy', name: 'Dividend Policy' }
      ]
    },
    {
      id: 'investments',
      name: 'Investments',
      description: 'Securities and portfolio management',
      subtopics: [
        { id: 'stock-valuation', name: 'Stock Valuation' },
        { id: 'bond-valuation', name: 'Bond Valuation' },
        { id: 'portfolio-theory', name: 'Portfolio Theory' },
        { id: 'asset-allocation', name: 'Asset Allocation' },
        { id: 'risk-management', name: 'Risk Management' }
      ]
    },
    {
      id: 'financial-markets',
      name: 'Financial Markets',
      description: 'Structure and function of markets',
      subtopics: [
        { id: 'stock-markets', name: 'Stock Markets' },
        { id: 'bond-markets', name: 'Bond Markets' },
        { id: 'derivatives-markets', name: 'Derivatives Markets' },
        { id: 'foreign-exchange', name: 'Foreign Exchange' },
        { id: 'market-efficiency', name: 'Market Efficiency' }
      ]
    },
    {
      id: 'banking',
      name: 'Banking & Financial Institutions',
      description: 'Financial intermediaries and services',
      subtopics: [
        { id: 'commercial-banking', name: 'Commercial Banking' },
        { id: 'investment-banking', name: 'Investment Banking' },
        { id: 'insurance', name: 'Insurance Companies' },
        { id: 'asset-management', name: 'Asset Management' },
        { id: 'financial-regulation', name: 'Financial Regulation' }
      ]
    }
  ];
};

/**
 * Fetch financial calculators
 * @returns {Promise<Array>} Array of financial calculators
 */
export const getFinancialCalculators = async () => {
  // This would typically be a fetch call to an API
  return [
    {
      id: 'investment-calculator',
      name: 'Investment Calculator',
      description: 'Calculate future value of investments',
      inputs: [
        { id: 'initial-investment', name: 'Initial Investment', type: 'number', default: 1000 },
        { id: 'monthly-contribution', name: 'Monthly Contribution', type: 'number', default: 100 },
        { id: 'annual-return', name: 'Annual Return (%)', type: 'number', default: 7 },
        { id: 'investment-period', name: 'Investment Period (years)', type: 'number', default: 10 }
      ],
      outputs: [
        { id: 'future-value', name: 'Future Value' },
        { id: 'total-contributions', name: 'Total Contributions' },
        { id: 'total-interest', name: 'Total Interest Earned' }
      ]
    },
    {
      id: 'loan-calculator',
      name: 'Loan & Mortgage Calculator',
      description: 'Calculate loan payments and amortization',
      inputs: [
        { id: 'loan-amount', name: 'Loan Amount', type: 'number', default: 200000 },
        { id: 'interest-rate', name: 'Annual Interest Rate (%)', type: 'number', default: 4.5 },
        { id: 'loan-term', name: 'Loan Term (years)', type: 'number', default: 30 },
        { id: 'payment-frequency', name: 'Payment Frequency', type: 'select', options: ['Monthly', 'Bi-weekly', 'Weekly'], default: 'Monthly' }
      ],
      outputs: [
        { id: 'monthly-payment', name: 'Monthly Payment' },
        { id: 'total-payments', name: 'Total Payments' },
        { id: 'total-interest', name: 'Total Interest Paid' }
      ]
    },
    {
      id: 'retirement-calculator',
      name: 'Retirement Planning Calculator',
      description: 'Plan for your financial future',
      inputs: [
        { id: 'current-age', name: 'Current Age', type: 'number', default: 30 },
        { id: 'retirement-age', name: 'Retirement Age', type: 'number', default: 65 },
        { id: 'current-savings', name: 'Current Retirement Savings', type: 'number', default: 50000 },
        { id: 'monthly-contribution', name: 'Monthly Contribution', type: 'number', default: 500 },
        { id: 'expected-return', name: 'Expected Annual Return (%)', type: 'number', default: 6 },
        { id: 'inflation-rate', name: 'Expected Inflation Rate (%)', type: 'number', default: 2.5 },
        { id: 'retirement-income', name: 'Desired Annual Retirement Income', type: 'number', default: 80000 }
      ],
      outputs: [
        { id: 'retirement-savings', name: 'Projected Retirement Savings' },
        { id: 'income-duration', name: 'Years of Retirement Income' },
        { id: 'savings-gap', name: 'Retirement Savings Gap' }
      ]
    },
    {
      id: 'stock-valuation',
      name: 'Stock & Bond Valuation',
      description: 'Calculate intrinsic values of securities',
      inputs: [
        { id: 'valuation-model', name: 'Valuation Model', type: 'select', options: ['Dividend Discount', 'DCF', 'Bond Valuation'], default: 'Dividend Discount' },
        { id: 'current-dividend', name: 'Current Dividend/Cash Flow', type: 'number', default: 2.5 },
        { id: 'growth-rate', name: 'Growth Rate (%)', type: 'number', default: 3 },
        { id: 'discount-rate', name: 'Discount Rate (%)', type: 'number', default: 8 },
        { id: 'maturity', name: 'Maturity (years, for bonds)', type: 'number', default: 10 },
        { id: 'face-value', name: 'Face Value (for bonds)', type: 'number', default: 1000 }
      ],
      outputs: [
        { id: 'intrinsic-value', name: 'Intrinsic Value' },
        { id: 'implied-return', name: 'Implied Return (%)' }
      ]
    }
  ];
};

/**
 * Calculate financial results
 * @param {string} calculatorId - ID of the calculator
 * @param {Object} inputs - Calculator inputs
 * @returns {Promise<Object>} Calculation results
 */
export const calculateFinancialResults = async (calculatorId, inputs) => {
  // This would typically be a POST request to an API
  // Here we'll implement simple calculations for demonstration
  
  switch (calculatorId) {
    case 'investment-calculator': {
      const { initialInvestment, monthlyContribution, annualReturn, investmentPeriod } = inputs;
      const monthlyRate = annualReturn / 100 / 12;
      const totalMonths = investmentPeriod * 12;
      
      let futureValue = initialInvestment;
      for (let i = 0; i < totalMonths; i++) {
        futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
      }
      
      const totalContributions = initialInvestment + (monthlyContribution * totalMonths);
      const totalInterest = futureValue - totalContributions;
      
      return {
        futureValue: futureValue.toFixed(2),
        totalContributions: totalContributions.toFixed(2),
        totalInterest: totalInterest.toFixed(2)
      };
    }
    
    case 'loan-calculator': {
      const { loanAmount, interestRate, loanTerm, paymentFrequency } = inputs;
      const monthlyRate = interestRate / 100 / 12;
      const totalMonths = loanTerm * 12;
      
      // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
      // where P is payment, L is loan amount, c is monthly interest rate, n is number of payments
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      
      const totalPayments = monthlyPayment * totalMonths;
      const totalInterest = totalPayments - loanAmount;
      
      return {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalPayments: totalPayments.toFixed(2),
        totalInterest: totalInterest.toFixed(2)
      };
    }
    
    default:
      return {
        error: 'Calculator not implemented'
      };
  }
};

/**
 * Fetch market simulation data
 * @param {string} simulationType - Type of simulation
 * @returns {Promise<Object>} Simulation data
 */
export const getMarketSimulationData = async (simulationType) => {
  // This would typically be a fetch call to an API
  
  switch (simulationType) {
    case 'stock-market': {
      return {
        id: 'stock-market-sim',
        name: 'Stock Market Simulator',
        description: 'Simulate trading in a virtual stock market',
        initialBalance: 100000,
        availableStocks: [
          { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150.25, volatility: 'medium' },
          { symbol: 'MSFT', name: 'Microsoft Corporation', currentPrice: 290.10, volatility: 'low' },
          { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 3200.50, volatility: 'medium' },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 2750.75, volatility: 'low' },
          { symbol: 'TSLA', name: 'Tesla, Inc.', currentPrice: 700.30, volatility: 'high' },
          { symbol: 'FB', name: 'Meta Platforms, Inc.', currentPrice: 330.20, volatility: 'medium' },
          { symbol: 'NFLX', name: 'Netflix, Inc.', currentPrice: 520.80, volatility: 'high' },
          { symbol: 'JPM', name: 'JPMorgan Chase & Co.', currentPrice: 155.40, volatility: 'low' },
          { symbol: 'V', name: 'Visa Inc.', currentPrice: 230.15, volatility: 'low' },
          { symbol: 'DIS', name: 'The Walt Disney Company', currentPrice: 175.60, volatility: 'medium' }
        ],
        marketScenarios: [
          { id: 'bull-market', name: 'Bull Market', description: 'Rising market with positive sentiment' },
          { id: 'bear-market', name: 'Bear Market', description: 'Declining market with negative sentiment' },
          { id: 'volatile-market', name: 'Volatile Market', description: 'Market with large price swings' },
          { id: 'sideways-market', name: 'Sideways Market', description: 'Market with minimal price movement' }
        ],
        simulationPeriod: {
          min: 1,
          max: 52,
          default: 12,
          unit: 'weeks'
        }
      };
    }
    
    case 'portfolio-management': {
      return {
        id: 'portfolio-management-sim',
        name: 'Portfolio Management Simulator',
        description: 'Manage a diversified investment portfolio',
        initialBalance: 500000,
        assetClasses: [
          { id: 'us-stocks', name: 'US Stocks', expectedReturn: 8.0, risk: 'high' },
          { id: 'intl-stocks', name: 'International Stocks', expectedReturn: 7.0, risk: 'high' },
          { id: 'us-bonds', name: 'US Bonds', expectedReturn: 3.0, risk: 'medium' },
          { id: 'intl-bonds', name: 'International Bonds', expectedReturn: 3.5, risk: 'medium' },
          { id: 'real-estate', name: 'Real Estate', expectedReturn: 6.0, risk: 'medium' },
          { id: 'commodities', name: 'Commodities', expectedReturn: 4.0, risk: 'high' },
          { id: 'cash', name: 'Cash & Equivalents', expectedReturn: 1.0, risk: 'low' }
        ],
        investmentGoals: [
          { id: 'growth', name: 'Growth', description: 'Maximize long-term growth' },
          { id: 'income', name: 'Income', description: 'Generate regular income' },
          { id: 'balanced', name: 'Balanced', description: 'Balance growth and income' },
          { id: 'preservation', name: 'Capital Preservation', description: 'Preserve capital with minimal risk' }
        ],
        simulationPeriod: {
          min: 1,
          max: 30,
          default: 10,
          unit: 'years'
        }
      };
    }
    
    default:
      return {
        error: 'Simulation type not available'
      };
  }
};

/**
 * Fetch finance case studies
 * @param {string} category - Case study category
 * @returns {Promise<Array>} Array of case studies
 */
export const getFinanceCaseStudies = async (category = '') => {
  // This would typically be a fetch call to an API
  const caseStudies = [
    {
      id: 'tesla-capital-raising',
      title: 'Tesla\'s Capital Raising Strategy',
      category: 'corporate-finance',
      description: 'Analysis of Tesla\'s approach to raising capital for expansion',
      topics: ['Capital structure', 'Equity financing', 'Debt financing'],
      difficulty: 'intermediate',
      estimatedTime: '45 minutes'
    },
    {
      id: 'amazon-reinvestment',
      title: 'Amazon\'s Reinvestment Policy',
      category: 'corporate-finance',
      description: 'Examination of Amazon\'s strategy of reinvesting profits for growth',
      topics: ['Dividend policy', 'Capital allocation', 'Growth strategy'],
      difficulty: 'intermediate',
      estimatedTime: '60 minutes'
    },
    {
      id: 'buffett-investment',
      title: 'Warren Buffett\'s Investment Philosophy',
      category: 'investment-management',
      description: 'Analysis of Warren Buffett\'s value investing approach',
      topics: ['Value investing', 'Fundamental analysis', 'Long-term investing'],
      difficulty: 'beginner',
      estimatedTime: '30 minutes'
    },
    {
      id: 'yale-endowment',
      title: 'Yale Endowment\'s Asset Allocation',
      category: 'investment-management',
      description: 'Study of the Yale Endowment\'s innovative asset allocation strategy',
      topics: ['Asset allocation', 'Alternative investments', 'Portfolio management'],
      difficulty: 'advanced',
      estimatedTime: '75 minutes'
    },
    {
      id: '2008-financial-crisis',
      title: '2008 Global Financial Crisis',
      category: 'financial-crisis',
      description: 'Analysis of the causes, consequences, and responses to the 2008 financial crisis',
      topics: ['Systemic risk', 'Mortgage-backed securities', 'Financial regulation'],
      difficulty: 'intermediate',
      estimatedTime: '90 minutes'
    },
    {
      id: 'early-retirement',
      title: 'Early Retirement Planning',
      category: 'personal-finance',
      description: 'Case study of strategies for achieving early retirement',
      topics: ['Retirement planning', 'Investment strategy', 'Budgeting'],
      difficulty: 'beginner',
      estimatedTime: '45 minutes'
    }
  ];
  
  if (!category) return caseStudies;
  
  return caseStudies.filter(study => 
    study.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Submit case study analysis
 * @param {string} caseStudyId - ID of the case study
 * @param {Object} analysis - User's analysis
 * @returns {Promise<Object>} Feedback on the analysis
 */
export const submitCaseStudyAnalysis = async (caseStudyId, analysis) => {
  // This would typically be a POST request to an API
  return {
    score: 85,
    feedback: 'Your analysis demonstrates a good understanding of the key financial concepts involved in this case study.',
    strengths: [
      'Strong identification of the main financial issues',
      'Good application of theoretical concepts to the practical situation',
      'Well-structured analysis with clear conclusions'
    ],
    areasForImprovement: [
      'Consider more quantitative analysis to support your conclusions',
      'Explore alternative scenarios and their potential outcomes',
      'Provide more specific recommendations based on your analysis'
    ],
    expertAnalysis: 'The expert analysis for this case study emphasizes the importance of considering both short-term financial constraints and long-term strategic goals when making capital allocation decisions...'
  };
};
