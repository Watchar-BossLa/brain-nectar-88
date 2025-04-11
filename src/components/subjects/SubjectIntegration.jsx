import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * SubjectIntegration component for showing connections between subjects
 * @param {Object} props Component props
 * @param {string} props.currentSubject The current subject being viewed
 * @returns {React.ReactElement} SubjectIntegration component
 */
const SubjectIntegration = ({ currentSubject }) => {
  const [viewMode, setViewMode] = useState('list');
  
  // Sample concept connections data
  const conceptConnections = {
    mathematics: [
      {
        concept: 'Calculus',
        relatedTo: [
          { subject: 'physics', concept: 'Kinematics', description: 'Calculus is used to describe motion in physics' },
          { subject: 'economics', concept: 'Marginal Analysis', description: 'Derivatives are used to analyze marginal costs and benefits' },
          { subject: 'data science', concept: 'Optimization Algorithms', description: 'Calculus is used in gradient descent and other optimization methods' }
        ]
      },
      {
        concept: 'Linear Algebra',
        relatedTo: [
          { subject: 'computer science', concept: 'Computer Graphics', description: 'Matrices are used for transformations in 3D graphics' },
          { subject: 'data science', concept: 'Machine Learning', description: 'Linear algebra is fundamental to many ML algorithms' },
          { subject: 'physics', concept: 'Quantum Mechanics', description: 'Linear operators represent observables in quantum systems' }
        ]
      },
      {
        concept: 'Statistics',
        relatedTo: [
          { subject: 'data science', concept: 'Data Analysis', description: 'Statistical methods are core to analyzing data' },
          { subject: 'biology', concept: 'Genetics', description: 'Statistical analysis is used in population genetics' },
          { subject: 'finance', concept: 'Risk Assessment', description: 'Statistical models help quantify financial risk' }
        ]
      }
    ],
    physics: [
      {
        concept: 'Mechanics',
        relatedTo: [
          { subject: 'mathematics', concept: 'Calculus', description: 'Calculus is used to describe motion in physics' },
          { subject: 'engineering', concept: 'Structural Analysis', description: 'Mechanical principles are applied in structural engineering' },
          { subject: 'biology', concept: 'Biomechanics', description: 'Mechanical principles explain how organisms move' }
        ]
      },
      {
        concept: 'Electromagnetism',
        relatedTo: [
          { subject: 'chemistry', concept: 'Chemical Bonding', description: 'Electromagnetic forces govern chemical bonds' },
          { subject: 'computer science', concept: 'Electronic Computing', description: 'Electromagnetic principles enable electronic devices' },
          { subject: 'biology', concept: 'Neural Signaling', description: 'Electrical signals are fundamental to neural communication' }
        ]
      },
      {
        concept: 'Thermodynamics',
        relatedTo: [
          { subject: 'chemistry', concept: 'Chemical Reactions', description: 'Thermodynamic laws govern chemical reactions' },
          { subject: 'biology', concept: 'Metabolism', description: 'Thermodynamics explains energy flow in living systems' },
          { subject: 'engineering', concept: 'Heat Engines', description: 'Thermodynamic principles are applied in engine design' }
        ]
      }
    ],
    chemistry: [
      {
        concept: 'Atomic Structure',
        relatedTo: [
          { subject: 'physics', concept: 'Quantum Mechanics', description: 'Quantum mechanics explains electron behavior in atoms' },
          { subject: 'biology', concept: 'Biochemistry', description: 'Atomic structure determines molecular interactions in cells' },
          { subject: 'materials science', concept: 'Material Properties', description: 'Atomic structure influences material properties' }
        ]
      },
      {
        concept: 'Chemical Bonding',
        relatedTo: [
          { subject: 'physics', concept: 'Electromagnetism', description: 'Electromagnetic forces govern chemical bonds' },
          { subject: 'biology', concept: 'Protein Structure', description: 'Chemical bonds determine protein folding and function' },
          { subject: 'materials science', concept: 'Polymer Science', description: 'Chemical bonding determines polymer properties' }
        ]
      },
      {
        concept: 'Chemical Reactions',
        relatedTo: [
          { subject: 'physics', concept: 'Thermodynamics', description: 'Thermodynamic laws govern chemical reactions' },
          { subject: 'biology', concept: 'Cellular Respiration', description: 'Chemical reactions drive energy production in cells' },
          { subject: 'environmental science', concept: 'Biogeochemical Cycles', description: 'Chemical reactions drive nutrient cycling in ecosystems' }
        ]
      }
    ],
    biology: [
      {
        concept: 'Cell Biology',
        relatedTo: [
          { subject: 'chemistry', concept: 'Biochemistry', description: 'Chemical processes underlie cellular function' },
          { subject: 'physics', concept: 'Thermodynamics', description: 'Energy transformations govern cellular processes' },
          { subject: 'computer science', concept: 'Systems Biology', description: 'Computational models help understand cellular networks' }
        ]
      },
      {
        concept: 'Genetics',
        relatedTo: [
          { subject: 'mathematics', concept: 'Statistics', description: 'Statistical analysis is used in population genetics' },
          { subject: 'computer science', concept: 'Bioinformatics', description: 'Computational methods analyze genetic data' },
          { subject: 'chemistry', concept: 'Molecular Structure', description: 'DNA structure determines genetic information storage' }
        ]
      },
      {
        concept: 'Ecology',
        relatedTo: [
          { subject: 'mathematics', concept: 'Population Dynamics', description: 'Mathematical models describe population changes' },
          { subject: 'environmental science', concept: 'Ecosystem Services', description: 'Ecological principles explain ecosystem functions' },
          { subject: 'data science', concept: 'Ecological Modeling', description: 'Data analysis helps predict ecological changes' }
        ]
      }
    ],
    'data science': [
      {
        concept: 'Machine Learning',
        relatedTo: [
          { subject: 'mathematics', concept: 'Linear Algebra', description: 'Linear algebra is fundamental to many ML algorithms' },
          { subject: 'statistics', concept: 'Statistical Inference', description: 'Statistical methods underpin machine learning models' },
          { subject: 'computer science', concept: 'Algorithms', description: 'Efficient algorithms enable machine learning at scale' }
        ]
      },
      {
        concept: 'Data Analysis',
        relatedTo: [
          { subject: 'mathematics', concept: 'Statistics', description: 'Statistical methods are core to analyzing data' },
          { subject: 'business', concept: 'Business Intelligence', description: 'Data analysis informs business decisions' },
          { subject: 'social sciences', concept: 'Research Methods', description: 'Data analysis techniques are used in social research' }
        ]
      },
      {
        concept: 'Big Data',
        relatedTo: [
          { subject: 'computer science', concept: 'Distributed Systems', description: 'Distributed computing enables big data processing' },
          { subject: 'business', concept: 'Digital Transformation', description: 'Big data drives business transformation' },
          { subject: 'ethics', concept: 'Data Privacy', description: 'Ethical considerations in collecting and using big data' }
        ]
      }
    ],
    finance: [
      {
        concept: 'Investment Management',
        relatedTo: [
          { subject: 'mathematics', concept: 'Statistics', description: 'Statistical models help quantify financial risk' },
          { subject: 'economics', concept: 'Market Efficiency', description: 'Economic theories inform investment strategies' },
          { subject: 'psychology', concept: 'Behavioral Finance', description: 'Psychological factors influence investment decisions' }
        ]
      },
      {
        concept: 'Corporate Finance',
        relatedTo: [
          { subject: 'accounting', concept: 'Financial Statements', description: 'Accounting information informs financial decisions' },
          { subject: 'economics', concept: 'Microeconomics', description: 'Economic principles guide corporate financial decisions' },
          { subject: 'law', concept: 'Corporate Law', description: 'Legal frameworks govern corporate financial activities' }
        ]
      },
      {
        concept: 'Financial Markets',
        relatedTo: [
          { subject: 'economics', concept: 'Macroeconomics', description: 'Economic conditions influence financial markets' },
          { subject: 'data science', concept: 'Predictive Analytics', description: 'Data analysis helps predict market movements' },
          { subject: 'psychology', concept: 'Market Sentiment', description: 'Psychological factors drive market behavior' }
        ]
      }
    ],
    'computer science': [
      {
        concept: 'Algorithms',
        relatedTo: [
          { subject: 'mathematics', concept: 'Discrete Mathematics', description: 'Mathematical principles underpin algorithm design' },
          { subject: 'data science', concept: 'Machine Learning', description: 'Efficient algorithms enable machine learning at scale' },
          { subject: 'biology', concept: 'Bioinformatics', description: 'Algorithms analyze biological data like DNA sequences' }
        ]
      },
      {
        concept: 'Computer Systems',
        relatedTo: [
          { subject: 'physics', concept: 'Electromagnetism', description: 'Electromagnetic principles enable electronic devices' },
          { subject: 'engineering', concept: 'Digital Design', description: 'Engineering principles guide computer hardware design' },
          { subject: 'mathematics', concept: 'Boolean Algebra', description: 'Boolean logic is fundamental to digital circuits' }
        ]
      },
      {
        concept: 'Artificial Intelligence',
        relatedTo: [
          { subject: 'philosophy', concept: 'Philosophy of Mind', description: 'Philosophical questions about consciousness and intelligence' },
          { subject: 'psychology', concept: 'Cognitive Science', description: 'Understanding human cognition informs AI design' },
          { subject: 'mathematics', concept: 'Probability Theory', description: 'Probabilistic reasoning is key to modern AI' }
        ]
      }
    ],
    literature: [
      {
        concept: 'Literary Analysis',
        relatedTo: [
          { subject: 'psychology', concept: 'Cognitive Psychology', description: 'Understanding how readers interpret and process texts' },
          { subject: 'history', concept: 'Historical Context', description: 'Historical events and periods influence literary works' },
          { subject: 'philosophy', concept: 'Aesthetics', description: 'Philosophical theories of beauty and art inform literary criticism' }
        ]
      },
      {
        concept: 'Narrative Structure',
        relatedTo: [
          { subject: 'mathematics', concept: 'Pattern Recognition', description: 'Mathematical patterns can be found in narrative structures' },
          { subject: 'computer science', concept: 'Natural Language Processing', description: 'Computational analysis of narrative patterns' },
          { subject: 'psychology', concept: 'Narrative Psychology', description: 'How stories shape human understanding and memory' }
        ]
      },
      {
        concept: 'Literary Movements',
        relatedTo: [
          { subject: 'history', concept: 'Social Movements', description: 'Literary movements often parallel social and political changes' },
          { subject: 'art', concept: 'Art Movements', description: 'Literary and artistic movements often develop in parallel' },
          { subject: 'philosophy', concept: 'Philosophical Movements', description: 'Philosophical ideas influence literary movements' }
        ]
      }
    ],
    history: [
      {
        concept: 'Historical Methods',
        relatedTo: [
          { subject: 'literature', concept: 'Textual Analysis', description: 'Analyzing historical documents uses literary analysis techniques' },
          { subject: 'archaeology', concept: 'Material Culture', description: 'Physical artifacts provide evidence for historical narratives' },
          { subject: 'data science', concept: 'Data Analysis', description: 'Quantitative methods help analyze historical trends and patterns' }
        ]
      },
      {
        concept: 'Political History',
        relatedTo: [
          { subject: 'political science', concept: 'Governance Systems', description: 'Historical political structures inform political theory' },
          { subject: 'sociology', concept: 'Social Stratification', description: 'Class structures shape political developments' },
          { subject: 'economics', concept: 'Economic Systems', description: 'Economic factors influence political changes' }
        ]
      },
      {
        concept: 'Cultural History',
        relatedTo: [
          { subject: 'anthropology', concept: 'Cultural Practices', description: 'Anthropological methods help understand historical cultures' },
          { subject: 'art', concept: 'Art History', description: 'Artistic expressions reflect historical cultural values' },
          { subject: 'literature', concept: 'Literary History', description: 'Literary works provide insights into historical worldviews' }
        ]
      }
    ],
    geography: [
      {
        concept: 'Physical Geography',
        relatedTo: [
          { subject: 'geology', concept: 'Earth Sciences', description: 'Geological processes shape landforms and landscapes' },
          { subject: 'physics', concept: 'Fluid Dynamics', description: 'Physical principles govern atmospheric and oceanic circulation' },
          { subject: 'environmental science', concept: 'Ecosystem Distribution', description: 'Physical geography influences the distribution of ecosystems' }
        ]
      },
      {
        concept: 'Human Geography',
        relatedTo: [
          { subject: 'sociology', concept: 'Social Organization', description: 'Spatial aspects of human societies and social structures' },
          { subject: 'economics', concept: 'Economic Geography', description: 'Spatial distribution of economic activities and resources' },
          { subject: 'anthropology', concept: 'Cultural Landscapes', description: 'How human cultures interact with and modify their environments' }
        ]
      },
      {
        concept: 'Cartography',
        relatedTo: [
          { subject: 'mathematics', concept: 'Geometry', description: 'Mathematical principles underlie map projections and spatial representations' },
          { subject: 'computer science', concept: 'Geographic Information Systems', description: 'Computational tools for analyzing and visualizing spatial data' },
          { subject: 'art', concept: 'Visual Communication', description: 'Artistic principles guide effective map design and visualization' }
        ]
      }
    ],
    psychology: [
      {
        concept: 'Cognitive Psychology',
        relatedTo: [
          { subject: 'neuroscience', concept: 'Brain Function', description: 'Neural mechanisms underlying cognitive processes' },
          { subject: 'computer science', concept: 'Artificial Intelligence', description: 'Computational models of human cognition inform AI development' },
          { subject: 'philosophy', concept: 'Philosophy of Mind', description: 'Philosophical questions about consciousness and mental processes' }
        ]
      },
      {
        concept: 'Social Psychology',
        relatedTo: [
          { subject: 'sociology', concept: 'Group Dynamics', description: 'How social groups influence individual behavior and identity' },
          { subject: 'economics', concept: 'Behavioral Economics', description: 'Psychological factors in economic decision-making' },
          { subject: 'political science', concept: 'Political Behavior', description: 'Psychological factors in political attitudes and voting' }
        ]
      },
      {
        concept: 'Developmental Psychology',
        relatedTo: [
          { subject: 'biology', concept: 'Genetics', description: 'Genetic influences on psychological development' },
          { subject: 'education', concept: 'Learning Theory', description: 'How developmental stages affect learning processes' },
          { subject: 'anthropology', concept: 'Cultural Development', description: 'Cross-cultural differences in human development' }
        ]
      }
    ],
    economics: [
      {
        concept: 'Microeconomics',
        relatedTo: [
          { subject: 'mathematics', concept: 'Calculus', description: 'Mathematical tools for optimization and marginal analysis' },
          { subject: 'psychology', concept: 'Behavioral Economics', description: 'Psychological factors that influence economic decision-making' },
          { subject: 'business', concept: 'Market Strategy', description: 'How firms make decisions based on market structures and incentives' }
        ]
      },
      {
        concept: 'Macroeconomics',
        relatedTo: [
          { subject: 'history', concept: 'Economic History', description: 'Historical context of economic systems and crises' },
          { subject: 'political science', concept: 'Public Policy', description: 'How government policies affect economic outcomes' },
          { subject: 'sociology', concept: 'Social Institutions', description: 'How social structures influence economic systems' }
        ]
      },
      {
        concept: 'International Economics',
        relatedTo: [
          { subject: 'geography', concept: 'Economic Geography', description: 'Spatial distribution of economic activities and resources' },
          { subject: 'political science', concept: 'International Relations', description: 'Political factors in international economic interactions' },
          { subject: 'cultural studies', concept: 'Cross-Cultural Business', description: 'Cultural factors in international trade and business' }
        ]
      }
    ],
    art: [
      {
        concept: 'Art History',
        relatedTo: [
          { subject: 'history', concept: 'Cultural History', description: 'Art reflects and influences the cultural values of historical periods' },
          { subject: 'sociology', concept: 'Social Movements', description: 'Art movements often emerge from and influence social changes' },
          { subject: 'philosophy', concept: 'Aesthetics', description: 'Philosophical theories about beauty and artistic value' }
        ]
      },
      {
        concept: 'Visual Elements',
        relatedTo: [
          { subject: 'psychology', concept: 'Visual Perception', description: 'How the brain processes visual information and artistic elements' },
          { subject: 'physics', concept: 'Optics', description: 'Physical properties of light and color in visual art' },
          { subject: 'mathematics', concept: 'Geometry', description: 'Mathematical principles in composition, perspective, and proportion' }
        ]
      },
      {
        concept: 'Art Techniques',
        relatedTo: [
          { subject: 'chemistry', concept: 'Material Properties', description: 'Chemical composition and behavior of artistic materials' },
          { subject: 'engineering', concept: 'Structural Design', description: 'Engineering principles in sculpture and architectural art' },
          { subject: 'computer science', concept: 'Digital Imaging', description: 'Computational methods for creating and manipulating digital art' }
        ]
      },
      {
        concept: 'Art Analysis',
        relatedTo: [
          { subject: 'literature', concept: 'Critical Theory', description: 'Theoretical frameworks for analyzing and interpreting artistic works' },
          { subject: 'anthropology', concept: 'Cultural Symbolism', description: 'Cultural meanings and symbols in artistic expression' },
          { subject: 'psychology', concept: 'Emotional Response', description: 'Psychological impact of art on viewers and emotional expression' }
        ]
      },
      {
        concept: 'Art Movements',
        relatedTo: [
          { subject: 'history', concept: 'Historical Context', description: 'How historical events and periods shape artistic movements' },
          { subject: 'philosophy', concept: 'Philosophical Movements', description: 'How philosophical ideas influence artistic expression' },
          { subject: 'literature', concept: 'Literary Movements', description: 'Parallel developments in literary and artistic movements' }
        ]
      }
    ]
  };
  
  // Get the connections for the current subject
  const currentSubjectConnections = conceptConnections[currentSubject.toLowerCase()] || [];
  
  // Get all unique related subjects
  const relatedSubjects = [...new Set(
    currentSubjectConnections.flatMap(concept => 
      concept.relatedTo.map(related => related.subject)
    )
  )];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Cross-Subject Connections</h3>
          <p className="text-sm text-muted-foreground">
            Discover how concepts in {currentSubject} connect to other subjects
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List View
          </Button>
          <Button 
            variant={viewMode === 'graph' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('graph')}
          >
            Graph View
          </Button>
        </div>
      </div>
      
      {viewMode === 'list' ? (
        <Tabs defaultValue={relatedSubjects[0] || 'all'}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Connections</TabsTrigger>
            {relatedSubjects.map(subject => (
              <TabsTrigger key={subject} value={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSubjectConnections.map(concept => (
                <Card key={concept.concept}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{concept.concept}</CardTitle>
                    <CardDescription>
                      {concept.relatedTo.length} connections to other subjects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {concept.relatedTo.map(related => (
                        <li key={`${related.subject}-${related.concept}`} className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">
                            {related.subject.charAt(0).toUpperCase() + related.subject.slice(1)}
                          </Badge>
                          <div>
                            <p className="font-medium">{related.concept}</p>
                            <p className="text-sm text-muted-foreground">{related.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {relatedSubjects.map(subject => (
            <TabsContent key={subject} value={subject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSubjectConnections
                  .filter(concept => concept.relatedTo.some(related => related.subject === subject))
                  .map(concept => (
                    <Card key={concept.concept}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{concept.concept}</CardTitle>
                        <CardDescription>
                          Connections to {subject.charAt(0).toUpperCase() + subject.slice(1)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {concept.relatedTo
                            .filter(related => related.subject === subject)
                            .map(related => (
                              <li key={`${related.subject}-${related.concept}`} className="flex items-start gap-2">
                                <Badge variant="outline" className="mt-0.5">
                                  {related.subject.charAt(0).toUpperCase() + related.subject.slice(1)}
                                </Badge>
                                <div>
                                  <p className="font-medium">{related.concept}</p>
                                  <p className="text-sm text-muted-foreground">{related.description}</p>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link to={`/${subject.replace(/\s+/g, '-')}`}>
                  <Button variant="outline" size="sm">
                    Explore {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Network className="h-12 w-12 mx-auto mb-4" />
          <p>Knowledge Graph visualization will be implemented in the next phase.</p>
        </div>
      )}
      
      <div className="bg-muted p-4 rounded-md flex items-start gap-3">
        <Network className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-medium">Why Cross-Subject Learning Matters</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Many of the most important discoveries and innovations happen at the intersection of different fields.
            Understanding these connections can help you develop a deeper, more integrated knowledge base and
            solve complex problems that span multiple disciplines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectIntegration;
