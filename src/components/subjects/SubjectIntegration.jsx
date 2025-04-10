import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, ArrowRight, Network, BookOpen, Lightbulb, ExternalLink } from 'lucide-react';

/**
 * SubjectIntegration component that shows connections between concepts across different subjects
 * @returns {React.ReactElement} SubjectIntegration component
 */
const SubjectIntegration = ({ currentSubject }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('connections');
  const [relatedConcepts, setRelatedConcepts] = useState([]);
  
  // Sample data for related concepts across subjects
  const conceptConnections = {
    mathematics: [
      {
        concept: 'Calculus',
        relatedTo: [
          { subject: 'physics', concept: 'Kinematics', description: 'Calculus is used to derive equations of motion in kinematics.' },
          { subject: 'economics', concept: 'Marginal Analysis', description: 'Derivatives are used to calculate marginal cost and revenue.' },
          { subject: 'chemistry', concept: 'Reaction Rates', description: 'Differential equations model the rate of chemical reactions.' }
        ]
      },
      {
        concept: 'Linear Algebra',
        relatedTo: [
          { subject: 'data science', concept: 'Machine Learning', description: 'Matrices and vectors are fundamental to machine learning algorithms.' },
          { subject: 'physics', concept: 'Quantum Mechanics', description: 'Linear operators represent observables in quantum mechanics.' },
          { subject: 'computer science', concept: 'Computer Graphics', description: 'Transformation matrices are used for 3D rendering.' }
        ]
      },
      {
        concept: 'Statistics',
        relatedTo: [
          { subject: 'data science', concept: 'Data Analysis', description: 'Statistical methods are used to analyze and interpret data.' },
          { subject: 'finance', concept: 'Risk Assessment', description: 'Probability distributions help quantify financial risk.' },
          { subject: 'biology', concept: 'Population Genetics', description: 'Statistical models describe gene frequency in populations.' }
        ]
      }
    ],
    physics: [
      {
        concept: 'Thermodynamics',
        relatedTo: [
          { subject: 'chemistry', concept: 'Chemical Equilibrium', description: 'Thermodynamic principles govern chemical equilibrium.' },
          { subject: 'engineering', concept: 'Heat Engines', description: 'Thermodynamic cycles are the basis for heat engines.' },
          { subject: 'biology', concept: 'Metabolism', description: 'Energy transformations in living organisms follow thermodynamic laws.' }
        ]
      },
      {
        concept: 'Electromagnetism',
        relatedTo: [
          { subject: 'chemistry', concept: 'Chemical Bonding', description: 'Electromagnetic forces determine molecular structure.' },
          { subject: 'engineering', concept: 'Electrical Circuits', description: 'Electromagnetic principles are applied in circuit design.' },
          { subject: 'medicine', concept: 'MRI Technology', description: 'Magnetic resonance imaging uses electromagnetic properties of atoms.' }
        ]
      }
    ],
    chemistry: [
      {
        concept: 'Atomic Structure',
        relatedTo: [
          { subject: 'physics', concept: 'Quantum Mechanics', description: 'Quantum theory explains electron configuration in atoms.' },
          { subject: 'biology', concept: 'Biochemistry', description: 'Atomic properties determine biomolecule behavior.' },
          { subject: 'materials science', concept: 'Material Properties', description: 'Atomic structure influences material characteristics.' }
        ]
      },
      {
        concept: 'Chemical Reactions',
        relatedTo: [
          { subject: 'biology', concept: 'Cellular Respiration', description: 'Series of chemical reactions produce energy in cells.' },
          { subject: 'environmental science', concept: 'Pollution Control', description: 'Understanding reactions helps mitigate environmental impact.' },
          { subject: 'food science', concept: 'Cooking Processes', description: 'Cooking involves various chemical reactions.' }
        ]
      }
    ],
    'data science': [
      {
        concept: 'Machine Learning',
        relatedTo: [
          { subject: 'mathematics', concept: 'Optimization', description: 'Mathematical optimization is key to training ML models.' },
          { subject: 'statistics', concept: 'Regression Analysis', description: 'Statistical methods form the basis of many ML algorithms.' },
          { subject: 'computer science', concept: 'Algorithms', description: 'Efficient algorithms are essential for ML implementation.' }
        ]
      },
      {
        concept: 'Data Visualization',
        relatedTo: [
          { subject: 'design', concept: 'Visual Communication', description: 'Design principles enhance data visualization effectiveness.' },
          { subject: 'psychology', concept: 'Perception', description: 'Understanding perception improves visualization design.' },
          { subject: 'business', concept: 'Decision Making', description: 'Visualizations support data-driven business decisions.' }
        ]
      }
    ],
    finance: [
      {
        concept: 'Investment Analysis',
        relatedTo: [
          { subject: 'mathematics', concept: 'Probability Theory', description: 'Probability models help assess investment risks.' },
          { subject: 'economics', concept: 'Market Efficiency', description: 'Economic theories explain market behavior.' },
          { subject: 'psychology', concept: 'Behavioral Finance', description: 'Psychological factors influence investment decisions.' }
        ]
      },
      {
        concept: 'Financial Statements',
        relatedTo: [
          { subject: 'accounting', concept: 'Bookkeeping', description: 'Accounting principles govern financial statement preparation.' },
          { subject: 'business', concept: 'Performance Evaluation', description: 'Financial statements measure business performance.' },
          { subject: 'law', concept: 'Regulatory Compliance', description: 'Legal requirements dictate financial reporting standards.' }
        ]
      }
    ]
  };
  
  // Find related concepts based on current subject
  useEffect(() => {
    if (currentSubject && conceptConnections[currentSubject.toLowerCase()]) {
      setRelatedConcepts(conceptConnections[currentSubject.toLowerCase()]);
    } else {
      // If no current subject or not found, show mathematics by default
      setRelatedConcepts(conceptConnections.mathematics);
    }
  }, [currentSubject]);
  
  // Filter concepts based on search query
  const filteredConcepts = searchQuery 
    ? relatedConcepts.filter(item => 
        item.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relatedTo.some(related => 
          related.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
          related.subject.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : relatedConcepts;
  
  // Get all subjects
  const allSubjects = Object.keys(conceptConnections);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cross-Subject Connections</CardTitle>
        <CardDescription>
          Discover how concepts in {currentSubject || 'this subject'} relate to other fields of study
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="connections">
                <Network className="h-4 w-4 mr-2" />
                Connections
              </TabsTrigger>
              <TabsTrigger value="applications">
                <Lightbulb className="h-4 w-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="resources">
                <BookOpen className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>
            
            {/* Connections Tab */}
            <TabsContent value="connections" className="space-y-4">
              {filteredConcepts.length > 0 ? (
                filteredConcepts.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">{item.concept}</h3>
                      <Badge variant="outline" className="ml-2">
                        {currentSubject || 'Mathematics'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 pl-4">
                      {item.relatedTo.map((related, idx) => (
                        <div key={idx} className="border rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Badge className="capitalize bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                {related.subject}
                              </Badge>
                              <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                              <span className="font-medium">{related.concept}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {related.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {index < filteredConcepts.length - 1 && <Separator className="my-4" />}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No concepts found matching your search criteria.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Applications Tab */}
            <TabsContent value="applications">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Real-World Applications</h3>
                <p className="text-muted-foreground">
                  Discover how concepts from {currentSubject || 'this subject'} are applied in various fields and industries.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Industry Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Engineering and Design
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Healthcare and Medicine
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Technology and Computing
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Finance and Business
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Research Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Interdisciplinary Studies
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Emerging Technologies
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Sustainable Development
                        </li>
                        <li className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                          Social Impact
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  Explore More Applications
                </Button>
              </div>
            </TabsContent>
            
            {/* Resources Tab */}
            <TabsContent value="resources">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Interdisciplinary Resources</h3>
                <p className="text-muted-foreground">
                  Access learning materials that bridge {currentSubject || 'this subject'} with other disciplines.
                </p>
                
                <div className="space-y-3 mt-4">
                  <Card>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Interdisciplinary Courses</h4>
                        <p className="text-sm text-muted-foreground">
                          Courses that combine multiple subjects
                        </p>
                      </div>
                      <Button size="sm">Browse</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Research Papers</h4>
                        <p className="text-sm text-muted-foreground">
                          Academic papers spanning multiple disciplines
                        </p>
                      </div>
                      <Button size="sm">Browse</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Interactive Tutorials</h4>
                        <p className="text-sm text-muted-foreground">
                          Hands-on learning across subject boundaries
                        </p>
                      </div>
                      <Button size="sm">Browse</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Expert Interviews</h4>
                        <p className="text-sm text-muted-foreground">
                          Insights from professionals working across disciplines
                        </p>
                      </div>
                      <Button size="sm">Browse</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectIntegration;
