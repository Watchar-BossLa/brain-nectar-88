
import { AccountingStandard } from '../types/standards';

export const enhancedStandards: AccountingStandard[] = [
  {
    id: 'GAAP-ASC-606',
    name: 'ASC 606 - Revenue Recognition',
    description: 'Establishes principles for reporting useful information about the nature, amount, timing, and uncertainty of revenue.',
    framework: 'GAAP',
    category: 'Revenue',
    lastUpdated: '2021-06-15',
    effectiveDate: '2018-12-15',
    content: '<p>The core principle of ASC 606 is that an entity should recognize revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.</p><p>The standard introduces a 5-step approach to revenue recognition:</p><ol><li>Identify the contract(s) with a customer</li><li>Identify the performance obligations in the contract</li><li>Determine the transaction price</li><li>Allocate the transaction price to the performance obligations</li><li>Recognize revenue when (or as) the entity satisfies a performance obligation</li></ol>',
    examples: [
      'Software company with multi-element arrangements',
      'Construction contracts with milestone billings',
      'Subscription services with setup fees'
    ],
    relatedStandards: ['IFRS-15'],
    searchKeywords: ['revenue', 'recognition', 'contract', 'performance obligation', 'transaction price']
  },
  {
    id: 'IFRS-15',
    name: 'IFRS 15 - Revenue from Contracts with Customers',
    description: 'International standard on revenue recognition and accounting for contracts with customers.',
    framework: 'IFRS',
    category: 'Revenue',
    lastUpdated: '2020-05-28',
    effectiveDate: '2018-01-01',
    content: '<p>IFRS 15 establishes a comprehensive framework for determining when to recognize revenue and how much revenue to recognize. The core principle is that an entity recognizes revenue to depict the transfer of promised goods or services to customers in an amount that reflects the consideration to which the entity expects to be entitled in exchange for those goods or services.</p><p>Like ASC 606, IFRS 15 follows a 5-step model for revenue recognition.</p>',
    examples: [
      'Long-term service contracts',
      'Sale of goods with right of return',
      'Licenses of intellectual property'
    ],
    relatedStandards: ['GAAP-ASC-606'],
    searchKeywords: ['revenue', 'contracts', 'customers', 'performance', 'obligation']
  },
  {
    id: 'GAAP-ASC-842',
    name: 'ASC 842 - Leases',
    description: 'Requires lessees to recognize assets and liabilities for most leases and provides enhanced disclosure requirements.',
    framework: 'GAAP',
    category: 'Leases',
    lastUpdated: '2022-02-10',
    effectiveDate: '2019-12-15',
    content: '<p>ASC 842 requires lessees to recognize assets and liabilities for most leases and provides enhanced disclosure requirements. The main objective is to address the off-balance-sheet financing concerns related to lessees\' operating leases.</p><p>The standard introduces a right-of-use (ROU) model that brings substantially all leases onto the balance sheet.</p>',
    examples: [
      'Office building leases',
      'Equipment leases',
      'Retail space leases with variable payments'
    ],
    relatedStandards: ['IFRS-16'],
    searchKeywords: ['lease', 'right-of-use', 'ROU', 'operating lease', 'finance lease']
  },
  {
    id: 'IFRS-16',
    name: 'IFRS 16 - Leases',
    description: 'Specifies how to recognize, measure, present and disclose leases.',
    framework: 'IFRS',
    category: 'Leases',
    lastUpdated: '2021-03-31',
    effectiveDate: '2019-01-01',
    content: '<p>IFRS 16 specifies how to recognize, measure, present and disclose leases. The standard provides a single lessee accounting model, requiring lessees to recognize assets and liabilities for all leases unless the lease term is 12 months or less or the underlying asset has a low value.</p>',
    examples: [
      'Property leases',
      'Equipment leases',
      'Vehicle leases'
    ],
    relatedStandards: ['GAAP-ASC-842'],
    searchKeywords: ['lease', 'right-of-use', 'lessee', 'lessor', 'lease liability']
  },
  {
    id: 'GAAP-ASC-350',
    name: 'ASC 350 - Intangibles—Goodwill and Other',
    description: 'Addresses financial accounting and reporting for goodwill and other intangible assets.',
    framework: 'GAAP',
    category: 'Assets',
    lastUpdated: '2020-12-18',
    effectiveDate: '2002-06-30',
    content: '<p>ASC 350 addresses financial accounting and reporting for goodwill and other intangible assets. The standard provides guidance on how entities should account for goodwill and other intangible assets acquired individually or with a group of other assets.</p>',
    examples: [
      'Goodwill impairment testing',
      'Recognition of intangible assets in business combinations',
      'Accounting for research and development costs'
    ],
    relatedStandards: ['IFRS-3', 'IFRS-36'],
    searchKeywords: ['goodwill', 'intangible', 'impairment', 'asset', 'amortization']
  },
  {
    id: 'IFRS-36',
    name: 'IAS 36 - Impairment of Assets',
    description: 'Ensures that assets are carried at no more than their recoverable amount and defines how recoverable amount is determined.',
    framework: 'IFRS',
    category: 'Assets',
    lastUpdated: '2021-01-15',
    effectiveDate: '2004-03-31',
    content: '<p>IAS 36 seeks to ensure that an entity\'s assets are not carried at more than their recoverable amount. An asset is carried at more than its recoverable amount if its carrying amount exceeds the amount to be recovered through use or sale of the asset.</p><p>If this is the case, the asset is described as impaired and the standard requires the entity to recognize an impairment loss.</p>',
    examples: [
      'Goodwill impairment testing',
      'Property, plant and equipment impairment',
      'Intangible asset impairment'
    ],
    relatedStandards: ['GAAP-ASC-350'],
    searchKeywords: ['impairment', 'assets', 'recoverable amount', 'goodwill', 'intangible']
  },
  {
    id: 'GAAP-ASC-230',
    name: 'ASC 230 - Statement of Cash Flows',
    description: 'Provides guidance on cash flow statement preparation and classification of cash receipts and payments.',
    framework: 'GAAP',
    category: 'Financial Statements',
    lastUpdated: '2019-11-10',
    effectiveDate: '2016-01-01',
    content: '<p>ASC 230 establishes standards for cash flow reporting. It requires a statement of cash flows as part of a full set of financial statements for all business entities.</p><p>The statement classifies cash receipts and payments according to whether they stem from operating, investing, or financing activities.</p>',
    examples: [
      'Classification of interest and dividends',
      'Reporting non-cash transactions',
      'Direct vs. indirect method'
    ],
    relatedStandards: ['IFRS-7'],
    searchKeywords: ['cash flow', 'statement', 'operating', 'investing', 'financing']
  },
  {
    id: 'IFRS-7',
    name: 'IAS 7 - Statement of Cash Flows',
    description: 'Requires presentation of information about historical changes in cash and cash equivalents by means of a statement of cash flows.',
    framework: 'IFRS',
    category: 'Financial Statements',
    lastUpdated: '2022-01-10',
    effectiveDate: '1994-01-01',
    content: '<p>IAS 7 requires an entity to present a statement of cash flows as an integral part of its primary financial statements.</p><p>Cash flows are classified and presented into operating activities, investing activities or financing activities.</p>',
    examples: [
      'Operating activities classification',
      'Treatment of interest and dividends',
      'Foreign currency cash flows'
    ],
    relatedStandards: ['GAAP-ASC-230'],
    searchKeywords: ['cash flow', 'statement', 'operating', 'investing', 'financing']
  }
];
