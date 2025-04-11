import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Palette, Image, Info, Clock, User, Globe } from 'lucide-react';

/**
 * StyleAnalyzer component for analyzing art styles and techniques
 * @returns {React.ReactElement} StyleAnalyzer component
 */
const StyleAnalyzer = () => {
  // State for selected artwork
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  
  // Sample artwork data
  const artworks = [
    {
      id: 1,
      title: 'Starry Night',
      artist: 'Vincent van Gogh',
      year: 1889,
      style: 'Post-Impressionism',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      description: 'This painting depicts the view from the east-facing window of van Gogh\'s asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.'
    },
    {
      id: 2,
      title: 'The Persistence of Memory',
      artist: 'Salvador Dalí',
      year: 1931,
      style: 'Surrealism',
      image: 'https://uploads6.wikiart.org/images/salvador-dali/the-persistence-of-memory-1931.jpg',
      description: 'The soft, melting watches express the relativity of space and time, a central theme in Einstein\'s theory of relativity.'
    },
    {
      id: 3,
      title: 'Composition with Red, Blue, and Yellow',
      artist: 'Piet Mondrian',
      year: 1930,
      style: 'De Stijl',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/1200px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg',
      description: 'This painting exemplifies Mondrian\'s abstract style, characterized by primary colors and straight lines.'
    }
  ];
  
  // Select an artwork for analysis
  const handleSelectArtwork = (artwork) => {
    setSelectedArtwork(artwork);
  };
  
  // Render artwork selection
  const renderArtworkSelection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {artworks.map(artwork => (
          <Card 
            key={artwork.id} 
            className={`cursor-pointer transition-all ${selectedArtwork?.id === artwork.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
            onClick={() => handleSelectArtwork(artwork)}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={artwork.image} 
                alt={artwork.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <h3 className="font-medium">{artwork.title}</h3>
              <p className="text-sm text-muted-foreground">{artwork.artist}, {artwork.year}</p>
              <Badge variant="outline" className="mt-2">{artwork.style}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render style analysis
  const renderStyleAnalysis = () => {
    if (!selectedArtwork) {
      return (
        <div className="text-center py-12">
          <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Artwork Selected</h3>
          <p className="text-muted-foreground">
            Select an artwork from the gallery to analyze its style and techniques.
          </p>
        </div>
      );
    }
    
    // Sample analysis data for the selected artwork
    const analysisData = {
      'Starry Night': {
        style: {
          name: 'Post-Impressionism',
          confidence: 0.95,
          characteristics: [
            'Bold, vibrant colors',
            'Visible brushstrokes',
            'Emphasis on emotional impact',
            'Distortion of forms for expressive effect'
          ],
          relatedStyles: ['Impressionism', 'Expressionism'],
          historicalContext: 'Post-Impressionism emerged in the 1880s as artists sought to extend Impressionism while rejecting its limitations. It emphasized symbolic and emotional content, abstract qualities, and formal order.'
        },
        techniques: [
          { name: 'Impasto', confidence: 0.92, description: 'Thick application of paint that creates texture and dimension' },
          { name: 'Swirling Brushstrokes', confidence: 0.98, description: 'Curved, flowing brushstrokes that create a sense of movement' },
          { name: 'Complementary Colors', confidence: 0.90, description: 'Use of opposite colors on the color wheel to create visual tension and vibrancy' }
        ],
        colorPalette: [
          { color: '#0C1445', name: 'Deep Blue', percentage: 40 },
          { color: '#4A6DB5', name: 'Medium Blue', percentage: 25 },
          { color: '#FFDF00', name: 'Yellow', percentage: 15 },
          { color: '#78A355', name: 'Green', percentage: 10 },
          { color: '#8B5A3C', name: 'Brown', percentage: 10 }
        ]
      },
      'The Persistence of Memory': {
        style: {
          name: 'Surrealism',
          confidence: 0.97,
          characteristics: [
            'Dreamlike imagery',
            'Unexpected juxtapositions',
            'Symbolic elements',
            'Meticulous detail in unrealistic scenes'
          ],
          relatedStyles: ['Dada', 'Metaphysical Art'],
          historicalContext: 'Surrealism began in the 1920s as a literary and artistic movement influenced by Freudian psychoanalysis, emphasizing the importance of dreams and the unconscious mind.'
        },
        techniques: [
          { name: 'Trompe l\'oeil', confidence: 0.94, description: 'Realistic depiction that creates optical illusion' },
          { name: 'Juxtaposition', confidence: 0.96, description: 'Placement of unrelated objects together to create new meaning' },
          { name: 'Metamorphosis', confidence: 0.93, description: 'Transformation of objects into other forms' }
        ],
        colorPalette: [
          { color: '#E8D9B5', name: 'Sand Beige', percentage: 45 },
          { color: '#7A9EAF', name: 'Pale Blue', percentage: 20 },
          { color: '#C17F33', name: 'Burnt Orange', percentage: 15 },
          { color: '#2D2D2D', name: 'Dark Gray', percentage: 10 },
          { color: '#8B5A3C', name: 'Brown', percentage: 10 }
        ]
      },
      'Composition with Red, Blue, and Yellow': {
        style: {
          name: 'De Stijl',
          confidence: 0.99,
          characteristics: [
            'Geometric abstraction',
            'Primary colors only',
            'Horizontal and vertical lines',
            'Asymmetrical balance'
          ],
          relatedStyles: ['Constructivism', 'Bauhaus'],
          historicalContext: 'De Stijl (The Style) was founded in 1917 in the Netherlands. The movement advocated pure abstraction by reducing forms to vertical and horizontal lines, using only primary colors along with black and white.'
        },
        techniques: [
          { name: 'Geometric Abstraction', confidence: 0.99, description: 'Reduction of visual elements to geometric forms' },
          { name: 'Color Blocking', confidence: 0.97, description: 'Use of solid areas of color' },
          { name: 'Asymmetrical Balance', confidence: 0.95, description: 'Creating visual equilibrium without symmetry' }
        ],
        colorPalette: [
          { color: '#FFFFFF', name: 'White', percentage: 60 },
          { color: '#FF0000', name: 'Red', percentage: 15 },
          { color: '#0000FF', name: 'Blue', percentage: 15 },
          { color: '#FFFF00', name: 'Yellow', percentage: 5 },
          { color: '#000000', name: 'Black', percentage: 5 }
        ]
      }
    };
    
    const analysis = analysisData[selectedArtwork.title];
    
    if (!analysis) {
      return (
        <div className="text-center py-12">
          <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Analysis Not Available</h3>
          <p className="text-muted-foreground">
            Analysis data for this artwork is not available.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <div className="aspect-square overflow-hidden">
                <img 
                  src={selectedArtwork.image} 
                  alt={selectedArtwork.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-4">
                <h3 className="font-medium">{selectedArtwork.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedArtwork.artist}, {selectedArtwork.year}</p>
                <p className="text-sm mt-2">{selectedArtwork.description}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="style">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="style">
                  <Palette className="h-4 w-4 mr-2" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="techniques">
                  <Image className="h-4 w-4 mr-2" />
                  Techniques
                </TabsTrigger>
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="style">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{analysis.style.name}</CardTitle>
                      <Badge variant="outline" className="px-2 py-1">
                        {(analysis.style.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                    </div>
                    <CardDescription>Artistic style analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Characteristics</h4>
                      <ul className="space-y-1">
                        {analysis.style.characteristics.map((characteristic, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5"></div>
                            <span>{characteristic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Related Styles</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.style.relatedStyles.map((style, index) => (
                          <Badge key={index} variant="secondary">{style}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Historical Context</h4>
                      <p className="text-sm text-muted-foreground">{analysis.style.historicalContext}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="techniques">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Techniques Analysis</CardTitle>
                    <CardDescription>Artistic techniques used in this artwork</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.techniques.map((technique, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">{technique.name}</h4>
                          <Badge variant="outline" className="px-2 py-1">
                            {(technique.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{technique.description}</p>
                        <Progress value={technique.confidence * 100} className="h-1.5" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="colors">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Color Palette Analysis</CardTitle>
                    <CardDescription>Dominant colors used in this artwork</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.colorPalette.map((color, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="h-6 w-6 rounded-full" 
                          style={{ backgroundColor: color.color }}
                        ></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{color.name}</span>
                            <span className="text-sm text-muted-foreground">{color.percentage}%</span>
                          </div>
                          <Progress value={color.percentage} className="h-1.5 mt-1" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">About {analysis.style.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysis.style.historicalContext}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Period: {selectedArtwork.year}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>Key Artist: {selectedArtwork.artist}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Origin: Europe</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Art Style Analyzer</h3>
          <p className="text-sm text-muted-foreground">
            Analyze artistic styles, techniques, and color palettes
          </p>
        </div>
        <Button variant="outline" size="sm" disabled={!selectedArtwork}>
          Upload Your Own Artwork
        </Button>
      </div>
      
      <Tabs defaultValue="gallery">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="gallery">
            <Image className="h-4 w-4 mr-2" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="analysis" disabled={!selectedArtwork}>
            <Palette className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery">
          {renderArtworkSelection()}
        </TabsContent>
        
        <TabsContent value="analysis">
          {renderStyleAnalysis()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleAnalyzer;
