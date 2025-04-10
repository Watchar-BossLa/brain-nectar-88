/**
 * Chemistry Service
 * Provides functionality for chemistry learning features
 */

/**
 * Fetch chemistry topics
 * @returns {Promise<Array>} Array of chemistry topics
 */
export const getChemistryTopics = async () => {
  // This would typically be a fetch call to an API
  return [
    {
      id: 'general-chemistry',
      name: 'General Chemistry',
      description: 'Fundamental principles and concepts',
      subtopics: [
        { id: 'atomic-structure', name: 'Atomic Structure' },
        { id: 'periodic-table', name: 'Periodic Table & Trends' },
        { id: 'chemical-bonding', name: 'Chemical Bonding' },
        { id: 'stoichiometry', name: 'Stoichiometry' },
        { id: 'states-of-matter', name: 'States of Matter' }
      ]
    },
    {
      id: 'organic-chemistry',
      name: 'Organic Chemistry',
      description: 'Carbon-based compounds and reactions',
      subtopics: [
        { id: 'functional-groups', name: 'Functional Groups' },
        { id: 'reaction-mechanisms', name: 'Reaction Mechanisms' },
        { id: 'stereochemistry', name: 'Stereochemistry' },
        { id: 'aromatic-compounds', name: 'Aromatic Compounds' },
        { id: 'carbonyl-chemistry', name: 'Carbonyl Chemistry' }
      ]
    },
    {
      id: 'physical-chemistry',
      name: 'Physical Chemistry',
      description: 'Energy, equilibrium, and kinetics',
      subtopics: [
        { id: 'thermodynamics', name: 'Thermodynamics' },
        { id: 'chemical-equilibrium', name: 'Chemical Equilibrium' },
        { id: 'reaction-kinetics', name: 'Reaction Kinetics' },
        { id: 'electrochemistry', name: 'Electrochemistry' },
        { id: 'quantum-chemistry', name: 'Quantum Chemistry' }
      ]
    },
    {
      id: 'inorganic-chemistry',
      name: 'Inorganic Chemistry',
      description: 'Non-carbon-based compounds',
      subtopics: [
        { id: 'coordination-compounds', name: 'Coordination Compounds' },
        { id: 'transition-metals', name: 'Transition Metals' },
        { id: 'main-group-elements', name: 'Main Group Elements' },
        { id: 'solid-state-chemistry', name: 'Solid State Chemistry' },
        { id: 'acid-base-chemistry', name: 'Acid-Base Chemistry' }
      ]
    },
    {
      id: 'analytical-chemistry',
      name: 'Analytical Chemistry',
      description: 'Methods for chemical analysis',
      subtopics: [
        { id: 'chromatography', name: 'Chromatography' },
        { id: 'spectroscopy', name: 'Spectroscopic Methods' },
        { id: 'mass-spectrometry', name: 'Mass Spectrometry' },
        { id: 'electroanalytical', name: 'Electroanalytical Methods' },
        { id: 'titrations', name: 'Titrations & Equilibria' }
      ]
    }
  ];
};

/**
 * Fetch molecular structures
 * @param {string} query - Search query for molecules
 * @returns {Promise<Array>} Array of molecular structures
 */
export const getMolecularStructures = async (query = '') => {
  // This would typically be a fetch call to an API
  const molecules = [
    {
      id: 'water',
      name: 'Water',
      formula: 'H₂O',
      description: 'A polar molecule consisting of two hydrogen atoms and one oxygen atom',
      structure: {
        atoms: [
          { symbol: 'O', position: [0, 0, 0] },
          { symbol: 'H', position: [0.757, 0.586, 0] },
          { symbol: 'H', position: [-0.757, 0.586, 0] }
        ],
        bonds: [
          { atomIndices: [0, 1], order: 1 },
          { atomIndices: [0, 2], order: 1 }
        ]
      },
      properties: {
        molecularWeight: 18.02,
        boilingPoint: 100,
        meltingPoint: 0,
        density: 1.0
      }
    },
    {
      id: 'methane',
      name: 'Methane',
      formula: 'CH₄',
      description: 'A tetrahedral molecule with four hydrogen atoms bonded to a central carbon atom',
      structure: {
        atoms: [
          { symbol: 'C', position: [0, 0, 0] },
          { symbol: 'H', position: [0.626, 0.626, 0.626] },
          { symbol: 'H', position: [-0.626, -0.626, 0.626] },
          { symbol: 'H', position: [-0.626, 0.626, -0.626] },
          { symbol: 'H', position: [0.626, -0.626, -0.626] }
        ],
        bonds: [
          { atomIndices: [0, 1], order: 1 },
          { atomIndices: [0, 2], order: 1 },
          { atomIndices: [0, 3], order: 1 },
          { atomIndices: [0, 4], order: 1 }
        ]
      },
      properties: {
        molecularWeight: 16.04,
        boilingPoint: -161.5,
        meltingPoint: -182.5,
        density: 0.000656
      }
    },
    {
      id: 'benzene',
      name: 'Benzene',
      formula: 'C₆H₆',
      description: 'A planar aromatic hydrocarbon with a ring of six carbon atoms',
      structure: {
        atoms: [
          { symbol: 'C', position: [0, 1.4, 0] },
          { symbol: 'C', position: [1.212, 0.7, 0] },
          { symbol: 'C', position: [1.212, -0.7, 0] },
          { symbol: 'C', position: [0, -1.4, 0] },
          { symbol: 'C', position: [-1.212, -0.7, 0] },
          { symbol: 'C', position: [-1.212, 0.7, 0] },
          { symbol: 'H', position: [0, 2.49, 0] },
          { symbol: 'H', position: [2.156, 1.245, 0] },
          { symbol: 'H', position: [2.156, -1.245, 0] },
          { symbol: 'H', position: [0, -2.49, 0] },
          { symbol: 'H', position: [-2.156, -1.245, 0] },
          { symbol: 'H', position: [-2.156, 1.245, 0] }
        ],
        bonds: [
          { atomIndices: [0, 1], order: 1.5 },
          { atomIndices: [1, 2], order: 1.5 },
          { atomIndices: [2, 3], order: 1.5 },
          { atomIndices: [3, 4], order: 1.5 },
          { atomIndices: [4, 5], order: 1.5 },
          { atomIndices: [5, 0], order: 1.5 },
          { atomIndices: [0, 6], order: 1 },
          { atomIndices: [1, 7], order: 1 },
          { atomIndices: [2, 8], order: 1 },
          { atomIndices: [3, 9], order: 1 },
          { atomIndices: [4, 10], order: 1 },
          { atomIndices: [5, 11], order: 1 }
        ]
      },
      properties: {
        molecularWeight: 78.11,
        boilingPoint: 80.1,
        meltingPoint: 5.5,
        density: 0.879
      }
    }
  ];
  
  if (!query) return molecules;
  
  return molecules.filter(molecule => 
    molecule.name.toLowerCase().includes(query.toLowerCase()) || 
    molecule.formula.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Fetch chemical reactions
 * @param {string} category - Reaction category
 * @returns {Promise<Array>} Array of chemical reactions
 */
export const getChemicalReactions = async (category = '') => {
  // This would typically be a fetch call to an API
  const reactions = [
    {
      id: 'combustion-methane',
      name: 'Combustion of Methane',
      category: 'combustion',
      equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
      description: 'Complete combustion of methane in oxygen',
      energyChange: -890, // kJ/mol
      conditions: 'Heat or spark required to initiate',
      mechanism: [
        'Initiation: Formation of methyl radical',
        'Propagation: Reaction with oxygen',
        'Termination: Formation of products'
      ]
    },
    {
      id: 'acid-base-neutralization',
      name: 'Acid-Base Neutralization',
      category: 'acid-base',
      equation: 'HCl + NaOH → NaCl + H₂O',
      description: 'Neutralization of hydrochloric acid with sodium hydroxide',
      energyChange: -57.1, // kJ/mol
      conditions: 'Aqueous solution, room temperature',
      mechanism: [
        'Dissociation of HCl into H⁺ and Cl⁻',
        'Dissociation of NaOH into Na⁺ and OH⁻',
        'Combination of H⁺ and OH⁻ to form H₂O'
      ]
    },
    {
      id: 'sn2-reaction',
      name: 'SN2 Reaction',
      category: 'substitution',
      equation: 'CH₃Br + OH⁻ → CH₃OH + Br⁻',
      description: 'Nucleophilic substitution of bromomethane with hydroxide',
      energyChange: -80, // kJ/mol
      conditions: 'Polar aprotic solvent, room temperature',
      mechanism: [
        'Nucleophilic attack by OH⁻ on the carbon',
        'Formation of transition state with partial bonds',
        'Departure of leaving group Br⁻'
      ]
    },
    {
      id: 'aldol-condensation',
      name: 'Aldol Condensation',
      category: 'condensation',
      equation: '2CH₃CHO → CH₃CH(OH)CH₂CHO',
      description: 'Condensation of acetaldehyde to form 3-hydroxybutanal',
      energyChange: -25, // kJ/mol
      conditions: 'Basic conditions, room temperature',
      mechanism: [
        'Formation of enolate ion',
        'Nucleophilic attack on carbonyl carbon',
        'Protonation to form aldol product'
      ]
    }
  ];
  
  if (!category) return reactions;
  
  return reactions.filter(reaction => 
    reaction.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Fetch chemistry lab experiments
 * @returns {Promise<Array>} Array of lab experiments
 */
export const getChemistryLabExperiments = async () => {
  // This would typically be a fetch call to an API
  return [
    {
      id: 'titration',
      name: 'Acid-Base Titration',
      description: 'Determine the concentration of an acid or base using a standard solution',
      difficulty: 'beginner',
      duration: 45, // minutes
      materials: [
        'Burette',
        'Erlenmeyer flask',
        'pH indicator',
        'Unknown acid solution',
        'Standard base solution'
      ],
      procedure: [
        'Fill the burette with the standard base solution',
        'Add a known volume of the unknown acid to the flask',
        'Add a few drops of pH indicator',
        'Slowly add base from the burette until the indicator changes color',
        'Record the volume of base added',
        'Calculate the concentration of the acid'
      ],
      safetyNotes: 'Wear safety goggles and gloves. Avoid contact with acids and bases.'
    },
    {
      id: 'recrystallization',
      name: 'Recrystallization',
      description: 'Purify a solid compound by recrystallization',
      difficulty: 'intermediate',
      duration: 90, // minutes
      materials: [
        'Impure solid sample',
        'Appropriate solvent',
        'Erlenmeyer flask',
        'Hot plate',
        'Filter paper',
        'Buchner funnel'
      ],
      procedure: [
        'Dissolve the impure solid in a minimum amount of hot solvent',
        'Filter the hot solution to remove insoluble impurities',
        'Allow the solution to cool slowly to form crystals',
        'Collect the crystals by vacuum filtration',
        'Wash the crystals with cold solvent',
        'Dry the crystals and determine the yield'
      ],
      safetyNotes: 'Use proper ventilation when working with solvents. Keep away from open flames.'
    },
    {
      id: 'spectroscopy',
      name: 'IR Spectroscopy',
      description: 'Identify functional groups in organic compounds using infrared spectroscopy',
      difficulty: 'advanced',
      duration: 60, // minutes
      materials: [
        'IR spectrometer',
        'Unknown organic compound',
        'Reference compounds',
        'Sample preparation materials'
      ],
      procedure: [
        'Prepare the sample for analysis',
        'Calibrate the IR spectrometer',
        'Obtain the IR spectrum of the unknown compound',
        'Identify characteristic absorption bands',
        'Determine the functional groups present',
        'Compare with reference spectra'
      ],
      safetyNotes: 'Follow proper procedures for handling organic compounds. Dispose of waste properly.'
    }
  ];
};

/**
 * Submit chemistry lab results
 * @param {string} experimentId - ID of the experiment
 * @param {Object} results - Experiment results
 * @returns {Promise<Object>} Feedback on the results
 */
export const submitChemistryLabResults = async (experimentId, results) => {
  // This would typically be a POST request to an API
  return {
    accuracy: 0.92,
    feedback: 'Your experimental results are within acceptable error margins. Good technique!',
    suggestions: [
      'Consider using a more precise measurement technique for the volume',
      'Try to maintain a more consistent temperature during the reaction'
    ],
    nextExperimentId: 'spectroscopy'
  };
};
