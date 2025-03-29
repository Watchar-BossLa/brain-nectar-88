
import { QuizQuestion } from '../types';

export const topics = [
  "Accounting Fundamentals",
  "Balance Sheet",
  "Depreciation",
  "Financial Analysis",
  "Equity",
  "Financial Ratios",
  "Stockholders' Equity",
  "Accounting Principles",
  "Time Value of Money"
];

export const subjects = [
  "accounting",
  "finance",
  "mathematics",
  "economics"
];

export const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "What is the accounting equation?",
    type: "multiple-choice",
    difficulty: 1,
    options: [
      "Assets = Liabilities + Equity",
      "Assets = Liabilities - Equity",
      "Assets + Liabilities = Equity",
      "Assets + Equity = Liabilities"
    ],
    correctAnswer: "Assets = Liabilities + Equity",
    explanation: "The accounting equation forms the foundation of double-entry accounting. It states that a company's assets are equal to the sum of its liabilities and shareholders' equity.",
    topic: "Accounting Fundamentals",
    subject: "accounting",
    useLatex: true
  },
  {
    id: "q2",
    text: "Calculate the present value of $1,000 to be received in 2 years, with an annual discount rate of 5%.",
    type: "calculation",
    difficulty: 2,
    correctAnswer: "907.03",
    explanation: "Present value is calculated using the formula PV = FV / (1 + r)^n",
    stepByStepExplanation: [
      "Identify the future value (FV): $1,000",
      "Identify the discount rate (r): 5% or 0.05",
      "Identify the time period (n): 2 years",
      "Apply the formula: PV = $1,000 / (1 + 0.05)^2",
      "PV = $1,000 / (1.05)^2",
      "PV = $1,000 / 1.1025",
      "PV = $907.03"
    ],
    topic: "Time Value of Money",
    subject: "finance",
    useLatex: true
  },
  {
    id: "q3",
    text: "When preparing a balance sheet, which of the following items would be classified as a current asset?",
    type: "multiple-choice",
    difficulty: 1,
    options: [
      "Accounts Receivable",
      "Land",
      "Goodwill",
      "Long-term Investments"
    ],
    correctAnswer: "Accounts Receivable",
    explanation: "Current assets are assets that are expected to be converted to cash or used within one year or the operating cycle, whichever is longer. Accounts receivable are typically collected within a short period and are therefore classified as current assets.",
    topic: "Balance Sheet",
    subject: "accounting"
  },
  {
    id: "q4",
    text: "Calculate the depreciation expense for a machine that costs $50,000, has a salvage value of $10,000, and a useful life of 5 years using the straight-line method.",
    type: "calculation",
    difficulty: 2,
    correctAnswer: "8000",
    explanation: "The straight-line depreciation method allocates an equal amount of depreciation each year over the asset's useful life.",
    stepByStepExplanation: [
      "Calculate the depreciable cost: Cost - Salvage Value = $50,000 - $10,000 = $40,000",
      "Divide the depreciable cost by the useful life: $40,000 ÷ 5 years = $8,000 per year"
    ],
    topic: "Depreciation",
    subject: "accounting",
    useLatex: true
  },
  {
    id: "q5",
    text: "In the context of financial statements, what does the term 'liquidity' refer to?",
    type: "multiple-choice",
    difficulty: 1,
    options: [
      "A company's ability to meet short-term obligations",
      "A company's ability to generate profit",
      "A company's ability to pay dividends",
      "A company's ability to raise long-term capital"
    ],
    correctAnswer: "A company's ability to meet short-term obligations",
    explanation: "Liquidity refers to a company's ability to convert assets into cash quickly to meet its short-term obligations and operational needs. It is a measure of how easily a company can pay its bills and debt obligations as they come due.",
    topic: "Financial Analysis",
    subject: "finance"
  },
  {
    id: "q6",
    text: "True or False: Retained earnings represent cash available to pay dividends.",
    type: "true-false",
    difficulty: 2,
    options: ["True", "False"],
    correctAnswer: "False",
    explanation: "Retained earnings represent the accumulated net income that has not been distributed as dividends, but it does not necessarily indicate available cash. Retained earnings can be reinvested in the business through various assets, not just held as cash.",
    topic: "Equity",
    subject: "accounting"
  },
  {
    id: "q7",
    text: "Calculate the Return on Assets (ROA) for a company with net income of $120,000 and average total assets of $1,500,000.",
    type: "calculation",
    difficulty: 2,
    correctAnswer: "0.08",
    explanation: "Return on Assets (ROA) measures how efficiently a company is using its assets to generate profit.",
    stepByStepExplanation: [
      "Identify the net income: $120,000",
      "Identify the average total assets: $1,500,000",
      "Apply the formula: ROA = Net Income / Average Total Assets",
      "ROA = $120,000 / $1,500,000",
      "ROA = 0.08 or 8%"
    ],
    topic: "Financial Ratios",
    subject: "finance",
    useLatex: true
  },
  {
    id: "q8",
    text: "When a company issues stock at a price higher than its par value, where is the excess amount recorded?",
    type: "multiple-choice",
    difficulty: 3,
    options: [
      "Additional Paid-in Capital",
      "Retained Earnings",
      "Treasury Stock",
      "Dividends Payable"
    ],
    correctAnswer: "Additional Paid-in Capital",
    explanation: "When a company issues stock above its par value, the par value is recorded in the common stock account, and the excess amount (premium) is recorded in the Additional Paid-in Capital account.",
    topic: "Stockholders' Equity",
    subject: "accounting"
  },
  {
    id: "q9",
    text: "Which of the following is NOT part of the GAAP matching principle?",
    type: "multiple-choice",
    difficulty: 3,
    options: [
      "Recording revenues when earned regardless of cash receipt",
      "Recording expenses in the period they are paid",
      "Matching expenses to the revenues they help generate",
      "Recording expenses in the period they are incurred"
    ],
    correctAnswer: "Recording expenses in the period they are paid",
    explanation: "The matching principle states that expenses should be recorded in the same accounting period as the revenues they help generate, regardless of when the cash is paid. Recording expenses when they are paid is the cash basis of accounting, not the accrual basis required by GAAP.",
    topic: "Accounting Principles",
    subject: "accounting"
  },
  {
    id: "q10",
    text: "Calculate the debt-to-equity ratio for a company with total liabilities of $250,000 and total shareholders' equity of $500,000.",
    type: "calculation",
    difficulty: 1,
    correctAnswer: "0.5",
    explanation: "The debt-to-equity ratio measures a company's financial leverage by comparing total liabilities to shareholders' equity.",
    stepByStepExplanation: [
      "Identify total liabilities: $250,000",
      "Identify total shareholders' equity: $500,000",
      "Apply the formula: Debt-to-Equity Ratio = Total Liabilities / Total Shareholders' Equity",
      "Debt-to-Equity Ratio = $250,000 / $500,000",
      "Debt-to-Equity Ratio = 0.5"
    ],
    topic: "Financial Ratios",
    subject: "finance",
    useLatex: true
  }
];
