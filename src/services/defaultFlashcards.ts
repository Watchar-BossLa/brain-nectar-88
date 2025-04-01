
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
      ...standardsFlashcards
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
