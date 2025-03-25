
import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'What is the accounting equation?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'Assets = Liabilities + Equity',
      'Assets = Liabilities - Equity',
      'Assets + Liabilities = Equity',
      'Assets - Liabilities = Equity'
    ],
    correctAnswer: 'Assets = Liabilities + Equity',
    explanation: 'The accounting equation forms the foundation of double-entry accounting. It states that a company\'s assets must equal the sum of its liabilities and equity, ensuring that the balance sheet always balances.',
    topic: 'Accounting Fundamentals'
  },
  {
    id: 'q2',
    text: 'Which of the following is a liability?',
    type: 'multiple-choice',
    difficulty: 1,
    options: [
      'Accounts Receivable',
      'Cash',
      'Accounts Payable',
      'Equipment'
    ],
    correctAnswer: 'Accounts Payable',
    explanation: 'Accounts Payable represents money a company owes to its creditors or suppliers for goods or services purchased on credit. It is considered a liability because it is an obligation that must be paid in the future.',
    topic: 'Accounting Fundamentals'
  },
  {
    id: 'q3',
    text: 'Calculate the gross profit if sales are $120,000 and cost of goods sold is $85,000.',
    type: 'calculation',
    difficulty: 2,
    correctAnswer: '35000',
    explanation: 'Gross profit is calculated by subtracting the cost of goods sold from sales revenue. In this case, $120,000 - $85,000 = $35,000. This represents the profit before operating expenses are deducted.',
    topic: 'Financial Statements'
  },
  {
    id: 'q4',
    text: 'IFRS and GAAP are completely identical accounting standards.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'IFRS (International Financial Reporting Standards) and GAAP (Generally Accepted Accounting Principles) are different accounting frameworks. While they share many similarities, they differ in specific areas such as inventory valuation, revenue recognition, and treatment of leases.',
    topic: 'Accounting Standards'
  },
  {
    id: 'q5',
    text: 'Explain the concept of materiality in accounting and provide an example.',
    type: 'essay',
    difficulty: 3,
    explanation: 'Materiality is a concept that refers to the significance of an item or transaction in influencing the decisions of financial statement users. Information is considered material if its omission or misstatement could influence economic decisions. For example, a $10,000 error might be immaterial for a large corporation with billions in revenue but would be highly material for a small business with $100,000 in revenue.',
    topic: 'Accounting Concepts'
  },
  {
    id: 'q6',
    text: 'Which method of inventory valuation often results in higher net income during periods of rising prices?',
    type: 'multiple-choice',
    difficulty: 2,
    options: [
      'FIFO (First-In, First-Out)',
      'LIFO (Last-In, First-Out)',
      'Weighted Average',
      'Specific Identification'
    ],
    correctAnswer: 'FIFO (First-In, First-Out)',
    explanation: 'During periods of rising prices, FIFO (First-In, First-Out) typically results in higher net income because older inventory with lower costs is recognized as cost of goods sold, leading to higher gross profit. This contrasts with LIFO, which uses newer, more expensive inventory first, resulting in higher cost of goods sold and lower profits.',
    topic: 'Inventory Management'
  },
  {
    id: 'q7',
    text: 'Calculate the current ratio if current assets are $250,000 and current liabilities are $100,000.',
    type: 'calculation',
    difficulty: 1,
    correctAnswer: '2.5',
    explanation: 'The current ratio is calculated by dividing current assets by current liabilities. In this case, $250,000 ÷ $100,000 = 2.5. This indicates that the company has $2.50 in current assets for every $1 of current liabilities, suggesting good short-term liquidity.',
    topic: 'Financial Ratios'
  },
  {
    id: 'q8',
    text: 'Depreciation is a cash expense.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'Depreciation is a non-cash expense. It allocates the cost of a tangible asset over its useful life, reflecting the asset\'s decrease in value due to use, age, or obsolescence. While it reduces reported income on the income statement, it does not involve an actual cash outflow in the period it is recognized.',
    topic: 'Depreciation'
  },
  {
    id: 'q9',
    text: 'Calculate net present value (NPV) of a project with an initial investment of $100,000 and annual cash flows of $25,000 for 5 years, using a discount rate of 8%.',
    type: 'calculation',
    difficulty: 3,
    correctAnswer: '6210',
    explanation: 'NPV = -Initial Investment + Sum of Discounted Cash Flows. At 8% discount rate, the present value of $25,000 for 5 years is approximately $106,210. Subtracting the initial investment of $100,000 gives an NPV of $6,210, indicating the project adds value to the company.',
    topic: 'Investment Analysis'
  },
  {
    id: 'q10',
    text: 'Accrual accounting records revenue when cash is received and expenses when cash is paid.',
    type: 'true-false',
    difficulty: 1,
    options: ['True', 'False'],
    correctAnswer: 'False',
    explanation: 'This statement describes cash basis accounting, not accrual accounting. Accrual accounting records revenue when it is earned (regardless of when cash is received) and expenses when they are incurred (regardless of when cash is paid). This provides a more accurate picture of a company\'s financial position and performance over time.',
    topic: 'Accounting Methods'
  },
  {
    id: 'q11',
    text: 'What is the difference between a debit and a credit in accounting?',
    type: 'essay',
    difficulty: 2,
    explanation: 'In double-entry accounting, debits and credits are used to record transactions. Debits increase asset and expense accounts but decrease liability, equity, and revenue accounts. Conversely, credits increase liability, equity, and revenue accounts but decrease asset and expense accounts. The total debits must equal the total credits in every transaction, maintaining the accounting equation\'s balance.',
    topic: 'Accounting Fundamentals'
  },
  {
    id: 'q12',
    text: 'Which financial statement would you examine to determine a company\'s profitability?',
    type: 'multiple-choice',
    difficulty: 1,
    options: [
      'Balance Sheet',
      'Income Statement',
      'Cash Flow Statement',
      'Statement of Changes in Equity'
    ],
    correctAnswer: 'Income Statement',
    explanation: 'The Income Statement (also called Profit and Loss Statement) shows a company\'s revenues, expenses, and profits over a specific period. It is the primary financial statement used to assess a company\'s profitability, as it details how revenue is transformed into net income through various expenses and costs.',
    topic: 'Financial Statements'
  }
];
