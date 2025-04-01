
import { supabase } from '@/integrations/supabase/client';

/**
 * Triggers the loading of default flashcards for a user
 * 
 * @param userId The ID of the user to load default flashcards for
 * @returns Promise resolving to true if successful, false otherwise
 */
export const triggerDefaultFlashcardsLoad = async (userId: string): Promise<boolean> => {
  try {
    // Define default flashcard categories and their content
    const defaultFlashcards = [
      // Accounting
      { 
        front_content: "What is the accounting equation?", 
        back_content: "Assets = Liabilities + Equity"
      },
      {
        front_content: "What is the difference between accrual accounting and cash accounting?",
        back_content: "Accrual accounting records revenue when earned and expenses when incurred, regardless of cash flow. Cash accounting records transactions only when cash is exchanged."
      },
      {
        front_content: "What are the four main financial statements?",
        back_content: "1. Balance Sheet\n2. Income Statement\n3. Cash Flow Statement\n4. Statement of Changes in Equity"
      },
      {
        front_content: "What is depreciation?",
        back_content: "Depreciation is the systematic allocation of the cost of a tangible asset over its useful life."
      },
      {
        front_content: "What is the matching principle?",
        back_content: "Expenses should be recognized in the same period as the revenues they helped to generate."
      },
      {
        front_content: "What is goodwill in accounting?",
        back_content: "Goodwill is an intangible asset representing the excess of purchase price over the fair value of net assets acquired in a business combination."
      },
      {
        front_content: "What is the difference between FIFO and LIFO?",
        back_content: "FIFO (First In, First Out): Oldest inventory items are sold first.\nLIFO (Last In, First Out): Newest inventory items are sold first."
      },
      {
        front_content: "What is the purpose of a trial balance?",
        back_content: "A trial balance is prepared to verify that the total of all debit balances equals the total of all credit balances, confirming mathematical accuracy."
      },
      {
        front_content: "What is the difference between gross profit and net profit?",
        back_content: "Gross profit = Revenue - Cost of goods sold.\nNet profit = Revenue - All expenses (COGS, operating expenses, taxes, etc.)"
      },
      {
        front_content: "What is a contra asset account?",
        back_content: "A contra asset account has a credit balance and offsets an asset account. Example: Accumulated Depreciation reduces the value of the related asset."
      },
      {
        front_content: "What is the conservatism principle?",
        back_content: "When in doubt, choose the accounting method that is least likely to overstate assets and income."
      },
      {
        front_content: "What is the difference between revenue and income?",
        back_content: "Revenue is the total amount of money received from sales before expenses are deducted. Income (or profit) is what remains after all expenses are subtracted from revenue."
      },
      {
        front_content: "What is the purpose of closing entries?",
        back_content: "Closing entries are made at the end of an accounting period to zero out temporary accounts and transfer their balances to permanent accounts."
      },
      {
        front_content: "What is the difference between a journal and a ledger?",
        back_content: "Journal is the book of original entry where transactions are recorded chronologically. Ledger is where transactions are classified and posted from journals by account."
      },
      {
        front_content: "What is the accounting cycle?",
        back_content: "The accounting cycle is a series of steps performed each accounting period, including: 1. Identifying transactions 2. Recording journal entries 3. Posting to ledger 4. Preparing trial balance 5. Adjusting entries 6. Adjusted trial balance 7. Financial statements 8. Closing entries 9. Post-closing trial balance"
      },
      
      // Finance
      {
        front_content: "What is the time value of money?",
        back_content: "The concept that money available now is worth more than the same amount in the future due to its potential earning capacity."
      },
      {
        front_content: "What is the formula for calculating Net Present Value (NPV)?",
        back_content: "NPV = Σ [CF_t / (1+r)^t] - Initial Investment\nWhere: CF_t = Cash flow in period t, r = discount rate, t = time period"
      },
      {
        front_content: "What is the Capital Asset Pricing Model (CAPM)?",
        back_content: "Expected Return = Risk-Free Rate + β(Market Risk Premium)\nWhere β represents the asset's correlation with the market."
      },
      {
        front_content: "What is the difference between systematic and unsystematic risk?",
        back_content: "Systematic risk affects the entire market and cannot be diversified away (e.g., inflation, interest rates). Unsystematic risk is specific to individual companies or sectors and can be reduced through diversification."
      },
      {
        front_content: "What is the efficient market hypothesis?",
        back_content: "The theory that asset prices reflect all available information, making it impossible to consistently outperform the market through stock selection or market timing."
      },
      {
        front_content: "What is the difference between stocks and bonds?",
        back_content: "Stocks represent ownership in a company, with potential for dividends and capital appreciation. Bonds are debt instruments where the investor lends money to an entity for a fixed period with regular interest payments."
      },
      {
        front_content: "What is the formula for calculating IRR (Internal Rate of Return)?",
        back_content: "IRR is the discount rate that makes the NPV of all cash flows equal to zero: 0 = Σ [CF_t / (1+IRR)^t] - Initial Investment"
      },
      {
        front_content: "What is the difference between operating leverage and financial leverage?",
        back_content: "Operating leverage is the ratio of fixed costs to variable costs. Financial leverage refers to the use of debt to finance assets."
      },
      {
        front_content: "What is the Gordon Growth Model?",
        back_content: "P = D₁ / (k - g)\nWhere P = stock price, D₁ = expected dividend next year, k = required rate of return, g = constant dividend growth rate"
      },
      {
        front_content: "What is the formula for calculating WACC (Weighted Average Cost of Capital)?",
        back_content: "WACC = (E/V × Re) + (D/V × Rd × (1-T))\nWhere E = market value of equity, D = market value of debt, V = total market value, Re = cost of equity, Rd = cost of debt, T = tax rate"
      },
      {
        front_content: "What is the Black-Scholes option pricing model used for?",
        back_content: "It's a mathematical model used to calculate the theoretical price of European-style options, considering factors like stock price, strike price, time to expiration, risk-free rate, and volatility."
      },
      {
        front_content: "What is the difference between futures and options contracts?",
        back_content: "Futures are obligations to buy/sell at a future date at a predetermined price. Options give the right, but not obligation, to buy/sell at a specified price before expiration."
      },
      {
        front_content: "What is arbitrage?",
        back_content: "The simultaneous purchase and sale of an asset to profit from price differences in different markets without risk."
      },
      {
        front_content: "What is the Modigliani-Miller theorem?",
        back_content: "In perfect markets, a firm's value is unaffected by how it is financed (equity vs. debt). Capital structure is irrelevant to firm value."
      },
      {
        front_content: "What is duration in bond pricing?",
        back_content: "A measure of a bond's sensitivity to interest rate changes. It represents the weighted average time until all cash flows are received."
      },

      // Standards
      {
        front_content: "What is IFRS?",
        back_content: "International Financial Reporting Standards - a set of accounting standards developed by the International Accounting Standards Board (IASB) for financial reporting globally."
      },
      {
        front_content: "What is GAAP?",
        back_content: "Generally Accepted Accounting Principles - the standard framework of guidelines for financial accounting used in the United States."
      },
      {
        front_content: "What is the objective of IFRS 15?",
        back_content: "IFRS 15 establishes principles for reporting useful information about the nature, amount, timing, and uncertainty of revenue and cash flows from contracts with customers."
      },
      {
        front_content: "What is the difference between IAS and IFRS?",
        back_content: "IAS (International Accounting Standards) were issued between 1973 and 2001. IFRS replaced IAS in 2001, though some IAS remain in effect until superseded by IFRS."
      },
      {
        front_content: "What are the key components of IFRS 9?",
        back_content: "IFRS 9 addresses: 1. Classification and measurement of financial instruments 2. Impairment methodology 3. Hedge accounting"
      },
      {
        front_content: "What is the primary focus of IFRS 16?",
        back_content: "IFRS 16 focuses on lease accounting, requiring lessees to recognize assets and liabilities for most leases on their balance sheets."
      },
      {
        front_content: "What is the purpose of IAS 1?",
        back_content: "IAS 1 prescribes the basis for presentation of general-purpose financial statements to ensure comparability with the entity's financial statements of previous periods and with financial statements of other entities."
      },
      {
        front_content: "What is the conceptual framework in accounting standards?",
        back_content: "The conceptual framework sets out the concepts that underlie the preparation and presentation of financial statements. It is not a standard itself but provides guidance for developing accounting standards."
      },
      {
        front_content: "What is the difference between principles-based and rules-based accounting standards?",
        back_content: "Principles-based standards (like IFRS) provide general guidelines that require professional judgment. Rules-based standards (like US GAAP) give specific, detailed rules to follow."
      },
      {
        front_content: "What is the primary objective of IFRS 3?",
        back_content: "IFRS 3 focuses on business combinations, requiring the acquisition method of accounting for all business combinations and identifying the acquirer in all business combinations."
      },
      {
        front_content: "What is IFRS 13 about?",
        back_content: "IFRS 13 establishes a single framework for measuring fair value and requires disclosures about fair value measurements."
      },
      {
        front_content: "What is IAS 36 and when is it applied?",
        back_content: "IAS 36 (Impairment of Assets) ensures assets are carried at no more than their recoverable amount and is applied to most non-financial assets."
      },
      {
        front_content: "What is the purpose of IAS 12?",
        back_content: "IAS 12 prescribes the accounting treatment for income taxes, including current and deferred tax."
      },
      {
        front_content: "What is the difference between IFRS for SMEs and full IFRS?",
        back_content: "IFRS for SMEs is a simplified version of full IFRS designed for small and medium-sized entities, with reduced disclosure requirements and simplified accounting treatments."
      },
      {
        front_content: "What is the Conceptual Framework's definition of an asset?",
        back_content: "An asset is a present economic resource controlled by the entity as a result of past events. An economic resource is a right that has the potential to produce economic benefits."
      },

      // Taxation
      {
        front_content: "What is the difference between tax avoidance and tax evasion?",
        back_content: "Tax avoidance is legal minimization of taxes through legal means. Tax evasion is illegal non-payment or underpayment of taxes."
      },
      {
        front_content: "What is double taxation?",
        back_content: "When the same income is taxed twice, often occurring when income is taxed at both the corporate level and again at the personal level when distributed as dividends."
      },
      {
        front_content: "What is a double taxation treaty?",
        back_content: "An agreement between two countries to avoid taxing the same income twice and to prevent tax evasion."
      },
      {
        front_content: "What is the purpose of withholding tax?",
        back_content: "To collect tax directly from the source of income before the recipient receives it, ensuring tax compliance."
      },
      {
        front_content: "What is a tax haven?",
        back_content: "A jurisdiction offering little or no tax liability and limited financial transparency, often used for tax avoidance."
      },
      {
        front_content: "What is transfer pricing?",
        back_content: "The setting of prices for transactions between related entities, often subject to strict regulations to prevent tax base erosion."
      },
      {
        front_content: "What is VAT (Value Added Tax)?",
        back_content: "A consumption tax placed on products at each stage of production where value is added, ultimately paid by the end consumer."
      },
      {
        front_content: "What is capital gains tax?",
        back_content: "Tax on the profit realized from the sale of non-inventory assets like stocks, bonds, property, or other capital assets."
      },
      {
        front_content: "What is the difference between direct and indirect taxes?",
        back_content: "Direct taxes are levied on income and wealth of individuals or organizations (e.g., income tax, corporate tax). Indirect taxes are levied on goods and services (e.g., VAT, sales tax)."
      },
      {
        front_content: "What is a progressive tax system?",
        back_content: "A tax system where the tax rate increases as the taxable income increases, designed to distribute tax burden based on ability to pay."
      },
      {
        front_content: "What is tax depreciation?",
        back_content: "The allocation of the cost of tangible assets over their useful lives for tax purposes, often following different rules than accounting depreciation."
      },
      {
        front_content: "What is the BEPS Action Plan?",
        back_content: "Base Erosion and Profit Shifting Action Plan by OECD - a set of measures to tackle tax avoidance strategies that exploit gaps in tax rules to artificially shift profits."
      },
      {
        front_content: "What is the arm's length principle in taxation?",
        back_content: "The principle that transactions between related entities should be priced as if they were between independent entities under comparable circumstances."
      },
      {
        front_content: "What is a tax credit?",
        back_content: "A direct reduction in tax liability (dollar-for-dollar reduction), as opposed to a tax deduction which reduces taxable income."
      },
      {
        front_content: "What is the difference between tax residency and tax domicile?",
        back_content: "Tax residency typically depends on physical presence in a country, while tax domicile relates to a person's permanent home or where they have their closest ties."
      },

      // Audit
      {
        front_content: "What is the purpose of an audit?",
        back_content: "To provide an independent opinion on whether financial statements are presented fairly, in all material respects, in accordance with the applicable financial reporting framework."
      },
      {
        front_content: "What is audit materiality?",
        back_content: "The threshold above which missing or incorrect information could influence the economic decisions of users taken on the basis of the financial statements."
      },
      {
        front_content: "What is the difference between internal and external audit?",
        back_content: "Internal audit focuses on evaluating and improving an organization's risk management, controls, and governance processes. External audit provides an independent opinion on financial statements."
      },
      {
        front_content: "What are the three phases of an audit?",
        back_content: "1. Planning - understanding the entity and risk assessment\n2. Execution - performing audit procedures\n3. Reporting - forming and communicating an opinion"
      },
      {
        front_content: "What are audit assertions?",
        back_content: "Claims or representations by management that are embodied in financial statements. Main categories include: Existence/Occurrence, Completeness, Rights/Obligations, Valuation, Presentation/Disclosure."
      },
      {
        front_content: "What is an unqualified audit opinion?",
        back_content: "A clean opinion indicating that financial statements present fairly, in all material respects, the financial position of the entity in accordance with applicable accounting standards."
      },
      {
        front_content: "What is sampling in auditing?",
        back_content: "The application of audit procedures to less than 100% of items to form conclusions about the entire population."
      },
      {
        front_content: "What is the concept of professional skepticism in auditing?",
        back_content: "An attitude that includes a questioning mind, being alert to conditions that may indicate possible misstatement, and critical assessment of audit evidence."
      },
      {
        front_content: "What is an audit trail?",
        back_content: "A chronological record that provides documentary evidence of the sequence of activities that have affected a specific operation, procedure, or event."
      },
      {
        front_content: "What is a management letter in auditing?",
        back_content: "A letter from auditors to management highlighting deficiencies in internal control or other issues noted during the audit, along with recommendations for improvement."
      },
      {
        front_content: "What is substantive testing in auditing?",
        back_content: "Audit procedures designed to detect material misstatements at the assertion level, including tests of details and substantive analytical procedures."
      },
      {
        front_content: "What is a walkthrough in auditing?",
        back_content: "Tracing a transaction from origin through the entity's information systems until it is reflected in financial reports, used to confirm understanding of systems and controls."
      },
      {
        front_content: "What is the purpose of engagement quality control review?",
        back_content: "An objective evaluation of significant judgments made and conclusions reached by the engagement team before the auditor's report is issued."
      },
      {
        front_content: "What is the auditor's responsibility regarding fraud?",
        back_content: "To obtain reasonable assurance that financial statements are free from material misstatement, whether due to fraud or error, by identifying and assessing risks and responding appropriately."
      },
      {
        front_content: "What is the expectation gap in auditing?",
        back_content: "The difference between what the public and users of financial statements believe auditors are responsible for and what auditors actually are responsible for according to professional standards."
      }
    ];

    // Batch insert default flashcards for the user
    const batchSize = 20;
    for (let i = 0; i < defaultFlashcards.length; i += batchSize) {
      const batch = defaultFlashcards.slice(i, i + batchSize).map(card => ({
        ...card,
        user_id: userId,
        difficulty: 3, // Medium difficulty by default
        repetition_count: 0,
        next_review_date: new Date().toISOString(),
        mastery_level: 0,
        easiness_factor: 2.5 // Default easiness factor
      }));

      const { error } = await supabase.from('flashcards').insert(batch);
      if (error) {
        console.error('Error inserting default flashcards batch:', error);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error loading default flashcards:', error);
    return false;
  }
};
