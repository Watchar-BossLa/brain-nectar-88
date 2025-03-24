
import { QuizQuestion } from '../types';

// Sample quiz questions at different difficulty levels
export const quizQuestions: QuizQuestion[] = [
  // Easy questions (difficulty 1)
  {
    id: 'e1',
    text: 'Which of the following is a component of the accounting equation?',
    type: 'multiple-choice',
    difficulty: 1,
    options: ['Revenues', 'Assets', 'Dividends', 'Expenses'],
    correctAnswer: 'Assets',
    explanation: 'The accounting equation is Assets = Liabilities + Equity. Revenues and expenses affect equity through retained earnings, and dividends reduce equity, but they are not primary components of the accounting equation.',
    topic: 'Accounting Fundamentals'
  },
  {
    id: 'e2',
    text: 'In accounting, debits increase asset accounts.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'In the double-entry bookkeeping system, debits increase asset accounts and expense accounts, while credits increase liability accounts, equity accounts, and revenue accounts.',
    topic: 'Debits and Credits'
  },
  {
    id: 'e3',
    text: 'Calculate the ending inventory using FIFO method:\n\nBeginning inventory: 10 units at $8 each\nPurchase 1: 15 units at $10 each\nPurchase 2: 20 units at $12 each\nSold: 30 units',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '180',
    explanation: 'Using FIFO (First-In, First-Out), the first units purchased are the first sold. We sold 30 units total.\n10 units from beginning inventory + 15 units from first purchase + 5 units from second purchase = 30 units sold\nEnding inventory = 15 units from second purchase at $12 each = $180',
    topic: 'Inventory Valuation',
    useLatex: true
  },
  
  // Medium questions (difficulty 2)
  {
    id: 'm1',
    text: 'Which of the following statements about cash flow is NOT correct?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'A company can have positive net income but negative cash flow',
      'Purchase of equipment is an operating cash flow',
      'Payment of dividends is a financing cash flow',
      'Collection of accounts receivable is an operating cash flow'
    ],
    correctAnswer: 'Purchase of equipment is an operating cash flow',
    explanation: 'Purchase of equipment is an investing cash flow, not an operating cash flow. Operating cash flows relate to day-to-day operations, investing cash flows relate to long-term assets, and financing cash flows relate to debt and equity financing.',
    topic: 'Cash Flow'
  },
  {
    id: 'm2',
    text: 'Calculate the break-even point in units when:\n\nFixed costs = $120,000\nSelling price per unit = $50\nVariable cost per unit = $30',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: '6000',
    explanation: 'Break-even point in units = Fixed costs ÷ Contribution margin per unit\nContribution margin per unit = Selling price per unit - Variable cost per unit\nContribution margin per unit = $50 - $30 = $20\nBreak-even point = $120,000 ÷ $20 = 6,000 units',
    topic: 'Cost-Volume-Profit Analysis',
    useLatex: true
  },
  {
    id: 'm3',
    text: 'Under IFRS, development costs must be capitalized when certain criteria are met.',
    type: 'true-false',
    difficulty: 2,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Under IFRS (IAS 38), development costs must be capitalized when technical feasibility, intention to complete, ability to use or sell, generation of future economic benefits, resources to complete, and ability to measure costs reliably are all demonstrated. This differs from US GAAP, which generally expenses R&D costs as incurred.',
    topic: 'IFRS Standards'
  },
  
  // Hard questions (difficulty 3)
  {
    id: 'h1',
    text: 'Calculate the present value of a 5-year ordinary annuity with annual payments of $10,000 and a discount rate of 8%.',
    type: 'calculation',
    difficulty: 3,
    correctAnswer: '39927',
    explanation: 'The present value of an ordinary annuity can be calculated using the formula:\nPV = PMT × [(1 - (1 + r)^-n) ÷ r]\nWhere PMT = payment, r = rate, n = number of periods\nPV = $10,000 × [(1 - (1 + 0.08)^-5) ÷ 0.08]\nPV = $10,000 × [(1 - 0.6806) ÷ 0.08]\nPV = $10,000 × [0.3194 ÷ 0.08]\nPV = $10,000 × 3.9927\nPV = $39,927',
    topic: 'Time Value of Money',
    useLatex: true
  },
  {
    id: 'h2',
    text: 'Which of the following is NOT a required disclosure under ASC 842 (Leases)?',
    type: 'multiple-choice',
    difficulty: 3,
    options: [
      'Information about variable lease payments',
      'Maturity analysis of lease liabilities',
      'Weighted-average discount rate for leases',
      'Detailed information about lessor\'s residual value guarantees'
    ],
    correctAnswer: 'Detailed information about lessor\'s residual value guarantees',
    explanation: 'ASC 842 requires lessees to disclose information about variable lease payments, maturity analysis of lease liabilities, and weighted-average discount rates. While some information about residual value guarantees is required, detailed information about lessor\'s residual value guarantees is not a specific disclosure requirement for lessees under ASC 842.',
    topic: 'Lease Accounting'
  },
  {
    id: 'h3',
    text: 'Explain the concept of "substance over form" in accounting and provide an example of how it affects financial reporting.',
    type: 'essay',
    difficulty: 3,
    explanation: 'Substance over form is an accounting principle that states transactions should be recorded and presented in financial statements according to their economic substance rather than their legal form. For example, in a sale and leaseback transaction that is essentially a financing arrangement, the asset might remain on the seller\'s balance sheet despite legal transfer of ownership if the seller retains the risks and rewards of ownership. Another example is when a special purpose entity (SPE) might be consolidated in a company\'s financial statements despite being legally separate if the company effectively controls it and bears its risks and rewards.',
    topic: 'Accounting Principles'
  },
  {
    id: 'h4',
    text: 'Calculate the effective annual interest rate when the nominal rate is 12% compounded monthly.',
    type: 'calculation',
    difficulty: 3,
    correctAnswer: '12.68',
    explanation: 'The formula for effective annual rate (EAR) is:\nEAR = (1 + r/m)^m - 1\nWhere r = nominal rate and m = number of compounding periods per year\nEAR = (1 + 0.12/12)^12 - 1\nEAR = (1 + 0.01)^12 - 1\nEAR = 1.1268 - 1\nEAR = 0.1268 or 12.68%',
    topic: 'Interest Rates',
    useLatex: true
  },
];
