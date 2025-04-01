
import { supabase } from '@/integrations/supabase/client';
import { Flashcard } from '@/types/supabase';

export interface DefaultFlashcard {
  front_content: string;
  back_content: string;
  topic: string;
  difficulty: number;
}

// Default accounting flashcards for new users
export const accountingFlashcards: DefaultFlashcard[] = [
  {
    front_content: "What is the Accounting Equation?",
    back_content: "Assets = Liabilities + Equity",
    topic: "Fundamentals",
    difficulty: 1
  },
  {
    front_content: "Define 'Accounts Receivable'",
    back_content: "Money owed to a company by its debtors (customers)",
    topic: "Fundamentals",
    difficulty: 1
  },
  {
    front_content: "What is 'Depreciation'?",
    back_content: "The systematic allocation of an asset's cost over its useful life",
    topic: "Fundamentals",
    difficulty: 2
  },
  {
    front_content: "Explain 'FIFO' inventory method",
    back_content: "First-In, First-Out: Assumes that the oldest inventory items are sold first",
    topic: "Inventory",
    difficulty: 2
  },
  {
    front_content: "What does 'GAAP' stand for?",
    back_content: "Generally Accepted Accounting Principles",
    topic: "Standards",
    difficulty: 1
  },
  {
    front_content: "Define 'Net Income'",
    back_content: "Total revenues minus total expenses for a given period",
    topic: "Financial Statements",
    difficulty: 1
  },
  {
    front_content: "What is a 'Balance Sheet'?",
    back_content: "A financial statement that reports a company's assets, liabilities, and equity at a specific point in time",
    topic: "Financial Statements",
    difficulty: 2
  },
  {
    front_content: "What does 'ROI' stand for?",
    back_content: "Return On Investment",
    topic: "Financial Analysis",
    difficulty: 1
  },
  {
    front_content: "Define 'Accrual Accounting'",
    back_content: "An accounting method where revenue and expenses are recorded when they are earned or incurred, regardless of when cash is received or paid",
    topic: "Fundamentals",
    difficulty: 3
  },
  {
    front_content: "What is 'Working Capital'?",
    back_content: "Current Assets minus Current Liabilities; represents a company's operational liquidity",
    topic: "Financial Analysis",
    difficulty: 2
  },
  {
    front_content: "What is 'Double-Entry Bookkeeping'?",
    back_content: "An accounting system where every transaction affects at least two accounts, with debits equaling credits",
    topic: "Fundamentals",
    difficulty: 2
  },
  {
    front_content: "Define 'Gross Profit'",
    back_content: "Revenue minus Cost of Goods Sold (COGS)",
    topic: "Financial Statements",
    difficulty: 1
  },
  {
    front_content: "What is a 'Journal Entry'?",
    back_content: "A record of a financial transaction that shows the accounts affected and the amounts",
    topic: "Fundamentals",
    difficulty: 1
  },
  {
    front_content: "Explain 'Accounts Payable'",
    back_content: "Money owed by a company to its creditors (suppliers)",
    topic: "Fundamentals",
    difficulty: 1
  },
  {
    front_content: "What is 'Revenue Recognition'?",
    back_content: "The process of recording revenue when it is earned, rather than when payment is received",
    topic: "Fundamentals",
    difficulty: 2
  }
];

// Default finance flashcards for new users
export const financeFlashcards: DefaultFlashcard[] = [
  {
    front_content: "What is the Time Value of Money?",
    back_content: "The concept that money available now is worth more than the same amount in the future due to its potential earning capacity",
    topic: "Fundamentals",
    difficulty: 2
  },
  {
    front_content: "Define 'Net Present Value' (NPV)",
    back_content: "The difference between the present value of cash inflows and the present value of cash outflows over a period of time",
    topic: "Capital Budgeting",
    difficulty: 3
  },
  {
    front_content: "What is 'Beta' in finance?",
    back_content: "A measure of volatility or systematic risk of a security or portfolio compared to the market as a whole",
    topic: "Investments",
    difficulty: 3
  },
  {
    front_content: "Explain the 'Efficient Market Hypothesis'",
    back_content: "A theory stating that asset prices reflect all available information, making it impossible to consistently outperform the market",
    topic: "Market Theory",
    difficulty: 3
  },
  {
    front_content: "What is 'Compound Interest'?",
    back_content: "Interest calculated on the initial principal and on the accumulated interest over previous periods",
    topic: "Fundamentals",
    difficulty: 1
  },
  {
    front_content: "Define 'Diversification'",
    back_content: "The practice of spreading investments among different assets to reduce risk",
    topic: "Investments",
    difficulty: 1
  },
  {
    front_content: "What is a 'Derivative'?",
    back_content: "A financial security whose value depends on an underlying asset or group of assets",
    topic: "Investments",
    difficulty: 2
  },
  {
    front_content: "Explain 'Liquidity'",
    back_content: "The degree to which an asset can be quickly bought or sold without affecting its price",
    topic: "Fundamentals",
    difficulty: 1
  },
  {
    front_content: "What is 'CAPM'?",
    back_content: "Capital Asset Pricing Model: A model describing the relationship between systematic risk and expected return for assets",
    topic: "Investments",
    difficulty: 3
  },
  {
    front_content: "Define 'Arbitrage'",
    back_content: "The practice of taking advantage of price differences in different markets for the same asset",
    topic: "Trading",
    difficulty: 2
  },
  {
    front_content: "What is 'Internal Rate of Return' (IRR)?",
    back_content: "The discount rate that makes the net present value (NPV) of all cash flows equal to zero",
    topic: "Capital Budgeting",
    difficulty: 3
  },
  {
    front_content: "Define 'Leverage'",
    back_content: "The use of borrowed money to increase the potential return of an investment",
    topic: "Fundamentals",
    difficulty: 2
  },
  {
    front_content: "What is a 'Mutual Fund'?",
    back_content: "An investment vehicle made up of a pool of money from many investors to invest in securities like stocks, bonds, etc.",
    topic: "Investments",
    difficulty: 1
  },
  {
    front_content: "Explain 'P/E Ratio'",
    back_content: "Price-to-Earnings Ratio: A company's share price divided by its earnings per share",
    topic: "Investments",
    difficulty: 2
  },
  {
    front_content: "What is 'Foreign Exchange Risk'?",
    back_content: "The risk that an investment's value may change due to changes in currency exchange rates",
    topic: "Risk Management",
    difficulty: 2
  }
];

// Default flashcards for topics like IFRS, GAAP, etc.
export const standardsFlashcards: DefaultFlashcard[] = [
  {
    front_content: "What is 'IFRS'?",
    back_content: "International Financial Reporting Standards: A set of accounting standards developed by the International Accounting Standards Board (IASB)",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "Define 'Materiality' in accounting",
    back_content: "Information is material if omitting, misstating or obscuring it could reasonably be expected to influence decisions of primary users of financial statements",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "What is 'Fair Value' according to IFRS 13?",
    back_content: "The price that would be received to sell an asset or paid to transfer a liability in an orderly transaction between market participants at the measurement date",
    topic: "IFRS",
    difficulty: 3
  },
  {
    front_content: "Explain 'Revenue Recognition' under IFRS 15",
    back_content: "A five-step model recognizing revenue when control of goods or services transfers to a customer, at an amount that reflects the consideration to which the entity expects to be entitled",
    topic: "IFRS",
    difficulty: 3
  },
  {
    front_content: "What is 'Asset Impairment'?",
    back_content: "The reduction in value of an asset below its carrying amount on the balance sheet",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "Define 'Goodwill' in accounting",
    back_content: "An intangible asset that arises when a company acquires another business for a price higher than the fair value of its identifiable assets",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "What is 'LIFO' and is it allowed under IFRS?",
    back_content: "Last-In, First-Out: An inventory valuation method. It is not allowed under IFRS but is permitted under US GAAP",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "What are 'Contingent Liabilities'?",
    back_content: "Potential obligations that may arise depending on the outcome of an uncertain future event",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "Explain 'Substance Over Form' principle",
    back_content: "Transactions should be accounted for and presented in accordance with their substance and economic reality, not merely their legal form",
    topic: "Standards",
    difficulty: 3
  },
  {
    front_content: "What is 'Going Concern' assumption?",
    back_content: "The assumption that an entity will continue to operate for the foreseeable future, with no intention or necessity to liquidate or significantly curtail operations",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "What is 'IAS 1'?",
    back_content: "International Accounting Standard 1: Presentation of Financial Statements - Sets out the overall requirements for financial statements",
    topic: "IFRS",
    difficulty: 2
  },
  {
    front_content: "Define 'IFRS 9'",
    back_content: "Financial Instruments - Standard that specifies how an entity should classify and measure financial assets, liabilities, and some contracts to buy or sell non-financial items",
    topic: "IFRS",
    difficulty: 3
  },
  {
    front_content: "What is 'IFRS 16'?",
    back_content: "Leases - Specifies how to recognize, measure, present and disclose leases",
    topic: "IFRS",
    difficulty: 3
  },
  {
    front_content: "Explain the difference between IFRS and US GAAP",
    back_content: "IFRS is principles-based and used internationally; US GAAP is rules-based and used primarily in the United States",
    topic: "Standards",
    difficulty: 2
  },
  {
    front_content: "What is 'Conservatism' in accounting?",
    back_content: "A principle that requires recognition of expenses and liabilities as soon as possible when uncertain, but recognition of revenues and assets only when they are assured",
    topic: "Standards",
    difficulty: 2
  }
];

// Adding taxation flashcards
export const taxationFlashcards: DefaultFlashcard[] = [
  {
    front_content: "What is 'Income Tax'?",
    back_content: "A tax levied on the financial income of individuals, corporations, or other legal entities",
    topic: "Taxation",
    difficulty: 1
  },
  {
    front_content: "Define 'Capital Gains Tax'",
    back_content: "A tax on profits from the sale of certain types of assets, such as stocks, bonds, or real estate",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "What is 'VAT' (Value-Added Tax)?",
    back_content: "A consumption tax placed on a product whenever value is added at each stage of the supply chain, from production to point of sale",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "Explain 'Tax Deduction' vs 'Tax Credit'",
    back_content: "Tax deduction reduces taxable income, while tax credit reduces the tax owed dollar-for-dollar",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "What is 'Withholding Tax'?",
    back_content: "Tax deducted at source from payments made to non-residents of a country",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "Define 'Tax Avoidance'",
    back_content: "Legal arrangement of one's financial affairs to minimize tax liability",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "What is 'Tax Evasion'?",
    back_content: "The illegal non-payment or underpayment of taxes, usually by deliberately making a false declaration",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "Explain 'Double Taxation'",
    back_content: "When income is taxed twice, e.g., corporate profits taxed at corporate level and then dividends taxed at shareholder level",
    topic: "Taxation",
    difficulty: 3
  },
  {
    front_content: "What is a 'Tax Haven'?",
    back_content: "A country or territory where taxes are levied at a low rate or not at all",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "Define 'Property Tax'",
    back_content: "A tax assessed on real estate by the local government, based on the value of the property",
    topic: "Taxation",
    difficulty: 1
  },
  {
    front_content: "What is 'Transfer Pricing'?",
    back_content: "The setting of prices for transactions between related entities, such as divisions of the same company",
    topic: "Taxation",
    difficulty: 3
  },
  {
    front_content: "Explain 'Tax Base'",
    back_content: "The total amount of assets or income that can be taxed by a taxing authority",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "What is 'Tax Incidence'?",
    back_content: "The analysis of who ultimately bears the economic burden of a tax",
    topic: "Taxation",
    difficulty: 3
  },
  {
    front_content: "Define 'Progressive Taxation'",
    back_content: "A tax system where the tax rate increases as the taxable income increases",
    topic: "Taxation",
    difficulty: 2
  },
  {
    front_content: "What is 'Regressive Taxation'?",
    back_content: "A tax system where the tax rate decreases as the taxable income increases",
    topic: "Taxation",
    difficulty: 2
  }
];

// Adding audit flashcards
export const auditFlashcards: DefaultFlashcard[] = [
  {
    front_content: "What is an 'Audit'?",
    back_content: "A systematic examination of financial records, documents, and processes to determine their accuracy, consistency, and compliance with established rules",
    topic: "Audit",
    difficulty: 1
  },
  {
    front_content: "Define 'Internal Audit'",
    back_content: "An independent, objective assurance and consulting activity designed to add value and improve an organization's operations",
    topic: "Audit",
    difficulty: 1
  },
  {
    front_content: "What is 'External Audit'?",
    back_content: "An audit conducted by an independent third party to provide an opinion on the fairness of financial statements",
    topic: "Audit",
    difficulty: 1
  },
  {
    front_content: "Explain 'Audit Risk'",
    back_content: "The risk that the auditor expresses an inappropriate opinion when the financial statements are materially misstated",
    topic: "Audit",
    difficulty: 2
  },
  {
    front_content: "What is 'Materiality' in auditing?",
    back_content: "A concept relating to the significance of transactions, balances and errors that could influence the economic decisions of users of financial statements",
    topic: "Audit",
    difficulty: 2
  },
  {
    front_content: "Define 'Audit Evidence'",
    back_content: "Information used by the auditor to arrive at the conclusions on which the audit opinion is based",
    topic: "Audit",
    difficulty: 1
  },
  {
    front_content: "What is an 'Unqualified Opinion'?",
    back_content: "An auditor's opinion that financial statements are fairly presented, in all material respects, in accordance with applicable financial reporting framework",
    topic: "Audit",
    difficulty: 2
  },
  {
    front_content: "Explain 'Substantive Testing'",
    back_content: "Audit procedures designed to detect material misstatements at the assertion level",
    topic: "Audit",
    difficulty: 2
  },
  {
    front_content: "What are 'Controls Tests'?",
    back_content: "Tests performed to obtain audit evidence about the effectiveness of the design and operation of internal controls",
    topic: "Audit",
    difficulty: 2
  },
  {
    front_content: "Define 'Sampling Risk'",
    back_content: "The risk that the auditor's conclusion based on a sample may be different from the conclusion if the entire population were subjected to the same audit procedure",
    topic: "Audit",
    difficulty: 3
  },
  {
    front_content: "What is 'Audit Trail'?",
    back_content: "A chronological record that provides documentary evidence of the sequence of activities that have affected a specific operation, procedure, or event",
    topic: "Audit",
    difficulty: 2
  },
  {
    front_content: "Explain 'Analytical Procedures'",
    back_content: "Evaluations of financial information through analysis of plausible relationships among both financial and non-financial data",
    topic: "Audit",
    difficulty: 2
  },
  {
    front_content: "What is 'Audit Documentation'?",
    back_content: "The record of audit procedures performed, relevant audit evidence obtained, and conclusions the auditor reached",
    topic: "Audit",
    difficulty: 1
  },
  {
    front_content: "Define 'Fraud Risk'",
    back_content: "The risk of material misstatement due to fraud – an intentional act by one or more individuals involving deception to obtain an unjust or illegal advantage",
    topic: "Audit",
    difficulty: 3
  },
  {
    front_content: "What is the 'Auditor's Independence'?",
    back_content: "The state of mind that permits the provision of an opinion without being affected by influences that compromise professional judgment",
    topic: "Audit",
    difficulty: 2
  }
];

/**
 * Load default flashcards for a new user
 * @param userId - The ID of the user to load flashcards for
 * @returns Promise resolving to a boolean indicating success or failure
 */
export async function loadDefaultFlashcardsForUser(userId: string): Promise<boolean> {
  try {
    const { data: existingCards, error: fetchError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Error checking for existing flashcards:', fetchError);
      return false;
    }
    
    // Only load default flashcards if user has no flashcards
    if (existingCards && existingCards.length > 0) {
      console.log('User already has flashcards, skipping default flashcards load');
      return true;
    }
    
    const now = new Date().toISOString();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Combine all flashcards
    const allDefaultFlashcards = [
      ...accountingFlashcards, 
      ...financeFlashcards, 
      ...standardsFlashcards,
      ...taxationFlashcards,
      ...auditFlashcards
    ];
    
    // Map to Supabase format
    const flashcardsToInsert = allDefaultFlashcards.map(card => ({
      user_id: userId,
      front_content: card.front_content,
      back_content: card.back_content,
      topic_id: null, // We don't have topic IDs for default cards
      difficulty: card.difficulty,
      next_review_date: tomorrow.toISOString(),
      repetition_count: 0,
      mastery_level: 0,
      easiness_factor: 2.5, // Default easiness factor
      created_at: now,
      updated_at: now,
      last_retention: 0.85 // Default retention
    }));
    
    // Insert all flashcards
    const { error: insertError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert);
      
    if (insertError) {
      console.error('Error inserting default flashcards:', insertError);
      return false;
    }
    
    console.log(`Successfully loaded ${flashcardsToInsert.length} default flashcards for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error loading default flashcards:', error);
    return false;
  }
}

// Create a function to manually trigger loading default flashcards
export async function triggerDefaultFlashcardsLoad(userId: string): Promise<boolean> {
  // First, delete any existing flashcards for the user to ensure a clean slate
  try {
    const { error: deleteError } = await supabase
      .from('flashcards')
      .delete()
      .eq('user_id', userId);
      
    if (deleteError) {
      console.error('Error deleting existing flashcards:', deleteError);
      return false;
    }
    
    // Load the default flashcards
    return await loadDefaultFlashcardsForUser(userId);
  } catch (error) {
    console.error('Error triggering default flashcards load:', error);
    return false;
  }
}
