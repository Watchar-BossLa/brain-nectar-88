
/**
 * Utility functions for exporting financial statements
 */

// Get financial data based on template
export const getFinancialData = (templateId: string) => {
  // In a real application, this would fetch data from a database or API
  return {
    companyName: 'Sample Company, Inc.',
    date: new Date().toLocaleDateString(),
    assets: [
      { name: 'Cash and Cash Equivalents', value: 250000 },
      { name: 'Accounts Receivable', value: 125000 },
      { name: 'Inventory', value: 175000 },
      { name: 'Property, Plant, and Equipment', value: 500000 }
    ],
    liabilities: [
      { name: 'Accounts Payable', value: 75000 },
      { name: 'Short-term Debt', value: 100000 },
      { name: 'Long-term Debt', value: 300000 }
    ],
    equity: [
      { name: 'Common Stock', value: 200000 },
      { name: 'Retained Earnings', value: 375000 }
    ],
    revenues: [
      { name: 'Sales Revenue', value: 750000 },
      { name: 'Service Revenue', value: 250000 }
    ],
    expenses: [
      { name: 'Cost of Goods Sold', value: 400000 },
      { name: 'Operating Expenses', value: 200000 },
      { name: 'Tax Expense', value: 100000 }
    ],
    cashFlows: {
      operating: [
        { name: 'Net Income', value: 300000 },
        { name: 'Depreciation', value: 50000 },
        { name: 'Changes in Working Capital', value: -25000 }
      ],
      investing: [
        { name: 'Capital Expenditures', value: -150000 },
        { name: 'Acquisitions', value: -75000 }
      ],
      financing: [
        { name: 'Debt Repayment', value: -50000 },
        { name: 'Dividends Paid', value: -25000 }
      ]
    }
  };
};

// Export to PDF function
export const exportToPDF = (elementId: string, filename: string = 'financial-statement.pdf') => {
  console.log(`Exporting element with ID ${elementId} to PDF as ${filename}`);
  // In a real application, this would use a library like jsPDF or html2pdf.js
  // to generate a PDF from the element
  alert('PDF export feature is not implemented yet.');
};

// Export to CSV function
export const exportToCSV = (data: any[], filename: string = 'financial-statement.csv') => {
  console.log(`Exporting data to CSV as ${filename}`);
  
  try {
    // Convert the data to CSV format
    const headers = Object.keys(data[0]).filter(key => key !== 'id');
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle strings with commas by wrapping in quotes
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export CSV:', error);
    alert('Failed to export CSV file');
  }
};

// Copy to clipboard function
export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Content copied to clipboard');
      // You could use a toast notification here
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
};
