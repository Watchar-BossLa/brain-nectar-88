
/**
 * Note Processing Service
 * 
 * Processes images containing handwritten notes and converts them to structured text.
 * This service handles the communication with recognition APIs and provides utilities
 * for note organization and flashcard generation.
 */

/**
 * Process an image containing handwritten notes and convert to text
 * 
 * @param {string} imageData - Base64 encoded image data
 * @returns {Promise<Object>} Recognition results with structured text
 */
export const recognizeNotes = async (imageData) => {
  try {
    // In a production app, this would call an external API for text recognition
    // For demo purposes, we'll implement a basic simulation
    console.log('Processing notes image...');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // This is where you'd make an actual API call to a service like Google Cloud Vision or Microsoft Azure OCR
    // const response = await fetch('https://api.example.com/text-ocr', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer YOUR_API_KEY'
    //   },
    //   body: JSON.stringify({ image: imageData.split(',')[1] })
    // });
    // const data = await response.json();
    
    // For demo purposes, return sample data
    return simulateNoteRecognition(imageData);
  } catch (error) {
    console.error('Error recognizing notes:', error);
    throw new Error(`Failed to process notes: ${error.message}`);
  }
};

/**
 * Simulate note recognition with predefined patterns
 * 
 * @param {string} imageData - Base64 encoded image data
 * @returns {Object} Simulated recognition results
 * @private
 */
const simulateNoteRecognition = (imageData) => {
  // Extract a simple hash from the image data to determine which note to return
  const hash = imageData.slice(-10).split('').reduce((a, b) => a + b.charCodeAt(0), 0) % 4;
  
  const samples = [
    {
      text: "Accounting Principles\n\n• Assets = Liabilities + Equity\n• Revenue - Expenses = Net Income\n• Cash Flow = Operating + Investing + Financing\n\nRemember: Double-entry system means each transaction affects at least two accounts.",
      confidence: 0.92,
      structure: {
        title: "Accounting Principles",
        bullets: [
          "Assets = Liabilities + Equity",
          "Revenue - Expenses = Net Income",
          "Cash Flow = Operating + Investing + Financing"
        ],
        notes: ["Remember: Double-entry system means each transaction affects at least two accounts."]
      },
      concepts: ["accounting", "balance sheet", "income statement", "cash flow", "double-entry"]
    },
    {
      text: "Financial Mathematics\n\n1. Simple Interest: I = P × r × t\n2. Compound Interest: A = P(1 + r/n)^(nt)\n3. Present Value: PV = FV / (1 + r)^t\n\nExample: $1000 invested at 5% for 3 years gives $1157.63 with annual compounding.",
      confidence: 0.89,
      structure: {
        title: "Financial Mathematics",
        numbered: [
          "Simple Interest: I = P × r × t",
          "Compound Interest: A = P(1 + r/n)^(nt)",
          "Present Value: PV = FV / (1 + r)^t"
        ],
        examples: ["Example: $1000 invested at 5% for 3 years gives $1157.63 with annual compounding."]
      },
      concepts: ["interest", "finance", "time value of money", "compound interest", "present value"]
    },
    {
      text: "Risk Management\n\nTypes of Financial Risk:\n• Market Risk - Changes in market prices\n• Credit Risk - Borrower default\n• Liquidity Risk - Inability to transact\n• Operational Risk - System/process failures\n\nRisk mitigation involves:\n1. Identification\n2. Assessment\n3. Control measures\n4. Monitoring",
      confidence: 0.91,
      structure: {
        title: "Risk Management",
        section: "Types of Financial Risk:",
        bullets: [
          "Market Risk - Changes in market prices",
          "Credit Risk - Borrower default",
          "Liquidity Risk - Inability to transact",
          "Operational Risk - System/process failures"
        ],
        subsection: "Risk mitigation involves:",
        numbered: [
          "Identification",
          "Assessment",
          "Control measures",
          "Monitoring"
        ]
      },
      concepts: ["risk management", "financial risk", "market risk", "credit risk", "risk mitigation"]
    },
    {
      text: "Supply and Demand\n\nLaw of Demand:\n- Price ↑ → Quantity ↓\n- Price ↓ → Quantity ↑\n\nLaw of Supply:\n- Price ↑ → Quantity ↑\n- Price ↓ → Quantity ↓\n\nMarket equilibrium occurs where supply meets demand.",
      confidence: 0.94,
      structure: {
        title: "Supply and Demand",
        section: "Law of Demand:",
        bullets: [
          "Price ↑ → Quantity ↓",
          "Price ↓ → Quantity ↑"
        ],
        subsection: "Law of Supply:",
        bullets: [
          "Price ↑ → Quantity ↑",
          "Price ↓ → Quantity ↓"
        ],
        conclusion: "Market equilibrium occurs where supply meets demand."
      },
      concepts: ["economics", "supply", "demand", "equilibrium", "market price"]
    }
  ];
  
  return samples[hash];
};

/**
 * Extract flashcards from recognized note content
 * 
 * @param {Object} notesData - Recognized notes data
 * @returns {Array<Object>} Array of generated flashcards
 */
export const generateFlashcardsFromNotes = (notesData) => {
  const { text, structure, concepts } = notesData;
  const flashcards = [];
  
  // Create a title-based flashcard
  if (structure.title) {
    flashcards.push({
      frontContent: `What are the key points about ${structure.title}?`,
      backContent: text,
      topicId: concepts[0] || 'notes',
      useLatex: false
    });
  }
  
  // Create bullet point flashcards
  if (structure.bullets) {
    structure.bullets.forEach(bullet => {
      // Check if bullet contains equations or formulas
      const containsEquation = bullet.includes('=') || bullet.includes('+') || bullet.includes('-');
      
      // Split bullet by formula for Q&A format
      if (containsEquation && bullet.includes(':')) {
        const [concept, formula] = bullet.split(':').map(s => s.trim());
        flashcards.push({
          frontContent: `What is the formula for ${concept}?`,
          backContent: formula,
          topicId: concepts[0] || 'formulas',
          useLatex: formula.includes('^') || formula.includes('×')
        });
      } else {
        // For non-formula bullets, create definition cards
        flashcards.push({
          frontContent: `Explain: ${bullet}`,
          backContent: bullet,
          topicId: concepts[0] || 'concepts',
          useLatex: false
        });
      }
    });
  }
  
  // Create numbered list flashcards
  if (structure.numbered) {
    structure.numbered.forEach(item => {
      if (item.includes(':')) {
        const [concept, details] = item.split(':').map(s => s.trim());
        flashcards.push({
          frontContent: concept,
          backContent: details,
          topicId: concepts[0] || 'steps',
          useLatex: details.includes('^') || details.includes('×')
        });
      }
    });
  }
  
  return flashcards;
};

/**
 * Organize notes into structured sections
 * 
 * @param {string} text - Recognized raw text
 * @returns {Object} Structured notes with sections
 */
export const organizeNoteStructure = (text) => {
  if (!text) return { sections: [] };
  
  const lines = text.split('\n').filter(line => line.trim());
  const structure = { sections: [] };
  
  let currentSection = null;
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Check if this line is a heading (no bullet, short, ends with colon or all caps)
    const isHeading = !trimmedLine.startsWith('•') && 
                     !trimmedLine.startsWith('-') && 
                     !trimmedLine.startsWith('*') &&
                     (trimmedLine.length < 50 || 
                      trimmedLine.endsWith(':') || 
                      trimmedLine === trimmedLine.toUpperCase());
    
    // Check if this is a bullet point
    const isBullet = trimmedLine.startsWith('•') || 
                    trimmedLine.startsWith('-') || 
                    trimmedLine.startsWith('*') ||
                    /^\d+\./.test(trimmedLine);
    
    if (isHeading && !isBullet) {
      currentSection = {
        title: trimmedLine.replace(/:$/, ''),
        content: [],
        bullets: []
      };
      structure.sections.push(currentSection);
    } else if (isBullet && currentSection) {
      currentSection.bullets.push(trimmedLine.replace(/^[•\-*]\s*/, ''));
    } else if (currentSection) {
      currentSection.content.push(trimmedLine);
    } else {
      if (!structure.unsorted) structure.unsorted = [];
      structure.unsorted.push(trimmedLine);
    }
  });
  
  return structure;
};

/**
 * Link recognized concepts to existing knowledge graph
 * 
 * @param {Array<string>} concepts - Array of recognized concepts
 * @returns {Array<Object>} Linked concepts with related study materials
 */
export const linkRelatedConcepts = (concepts) => {
  // In a real app, this would query a knowledge graph or database
  // For demo purposes, we'll return sample related materials
  
  const knowledgeBase = {
    accounting: {
      related: ['balance sheet', 'income statement', 'cash flow', 'assets', 'liabilities', 'equity'],
      materials: [
        { type: 'flashcard', id: 'fc123', title: 'Accounting Basics' },
        { type: 'quiz', id: 'qz456', title: 'Accounting Principles Quiz' }
      ]
    },
    finance: {
      related: ['interest', 'present value', 'future value', 'yield', 'risk', 'return'],
      materials: [
        { type: 'flashcard', id: 'fc789', title: 'Financial Mathematics' },
        { type: 'quiz', id: 'qz012', title: 'Time Value of Money Quiz' }
      ]
    },
    economics: {
      related: ['supply', 'demand', 'equilibrium', 'elasticity', 'market', 'price'],
      materials: [
        { type: 'flashcard', id: 'fc345', title: 'Supply and Demand Basics' },
        { type: 'quiz', id: 'qz678', title: 'Microeconomics Principles Quiz' }
      ]
    },
    risk: {
      related: ['market risk', 'credit risk', 'liquidity risk', 'operational risk', 'mitigation'],
      materials: [
        { type: 'flashcard', id: 'fc901', title: 'Risk Management Fundamentals' },
        { type: 'quiz', id: 'qz234', title: 'Financial Risk Assessment Quiz' }
      ]
    }
  };
  
  const linkedConcepts = [];
  
  concepts.forEach(concept => {
    const conceptLower = concept.toLowerCase();
    
    // Find direct matches
    if (knowledgeBase[conceptLower]) {
      linkedConcepts.push({
        concept,
        related: knowledgeBase[conceptLower].related,
        materials: knowledgeBase[conceptLower].materials
      });
      return;
    }
    
    // Find partial matches
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (conceptLower.includes(key) || value.related.some(r => conceptLower.includes(r))) {
        linkedConcepts.push({
          concept,
          related: value.related,
          materials: value.materials
        });
        return;
      }
    }
    
    // No match found
    linkedConcepts.push({
      concept,
      related: [],
      materials: []
    });
  });
  
  return linkedConcepts;
};
