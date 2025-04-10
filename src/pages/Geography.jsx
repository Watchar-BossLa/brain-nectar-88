import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Mountain, Cloud, Building2, Users, Compass, Map } from 'lucide-react';
import { SubjectIntegration, SubjectDashboard } from '@/components/subjects';
import InteractiveMap from '@/components/geography/interactive-map/InteractiveMap';

/**
 * Geography page component
 * @returns {React.ReactElement} Geography page component
 */
const Geography = () => {
  const [showMap, setShowMap] = useState(false);
  
  const openMap = () => {
    setShowMap(true);
  };
  
  const closeMap = () => {
    setShowMap(false);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Geography</h1>
            <p className="text-muted-foreground">
              Understand the Earth's features, inhabitants, and phenomena
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <SubjectDashboard 
              subject="Geography" 
              description="Understand the Earth's features, inhabitants, and phenomena"
              progress={5}
              topics={[
                {
                  title: "Physical Geography",
                  description: "Study of Earth's natural features and processes",
                  status: "in_progress",
                  subtopics: [
                    { title: "Landforms", completed: true },
                    { title: "Climate", completed: false },
                    { title: "Hydrology", completed: false },
                    { title: "Biogeography", completed: false }
                  ]
                },
                {
                  title: "Human Geography",
                  description: "Study of human activities and their spatial relationships",
                  status: "not_started",
                  subtopics: [
                    { title: "Population Geography", completed: false },
                    { title: "Cultural Geography", completed: false },
                    { title: "Economic Geography", completed: false },
                    { title: "Urban Geography", completed: false }
                  ]
                },
                {
                  title: "Cartography",
                  description: "Art and science of map-making",
                  status: "not_started",
                  subtopics: [
                    { title: "Map Projections", completed: false },
                    { title: "Thematic Mapping", completed: false },
                    { title: "GIS", completed: false },
                    { title: "Remote Sensing", completed: false }
                  ]
                }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-primary" />
                    <CardTitle>Physical Geography</CardTitle>
                  </div>
                  <CardDescription>
                    Study of Earth's natural features and processes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>
                      Landforms
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs text-primary ml-2"
                        onClick={openMap}
                      >
                        View Map
                      </Button>
                    </li>
                    <li>Climate</li>
                    <li>Hydrology</li>
                    <li>Biogeography</li>
                    <li>Geomorphology</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Human Geography</CardTitle>
                  </div>
                  <CardDescription>
                    Study of human activities and their spatial relationships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Population Geography</li>
                    <li>Cultural Geography</li>
                    <li>Economic Geography</li>
                    <li>Urban Geography</li>
                    <li>Political Geography</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    <CardTitle>Cartography</CardTitle>
                  </div>
                  <CardDescription>
                    Art and science of map-making
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Map Projections</li>
                    <li>Thematic Mapping</li>
                    <li>Geographic Information Systems</li>
                    <li>Remote Sensing</li>
                    <li>Digital Cartography</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-primary" />
                    <CardTitle>Climatology</CardTitle>
                  </div>
                  <CardDescription>
                    Study of climate and weather patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Climate Systems</li>
                    <li>Climate Classification</li>
                    <li>Climate Change</li>
                    <li>Meteorology</li>
                    <li>Atmospheric Science</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle>Regional Geography</CardTitle>
                  </div>
                  <CardDescription>
                    Study of specific regions and their characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>North America</li>
                    <li>Europe</li>
                    <li>Asia</li>
                    <li>Africa</li>
                    <li>Oceania</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-primary" />
                    <CardTitle>Geographic Techniques</CardTitle>
                  </div>
                  <CardDescription>
                    Methods and tools for geographic analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Field Methods</li>
                    <li>Spatial Analysis</li>
                    <li>Quantitative Methods</li>
                    <li>Qualitative Methods</li>
                    <li>Geospatial Technology</li>
                  </ul>
                  <Button className="w-full mt-4">Study Now</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Map</CardTitle>
                  <CardDescription>
                    Explore geographic features and regions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Globe className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore interactive maps of physical features, political boundaries, climate zones, and more. Toggle between different map layers and zoom in for detailed information.
                  </p>
                  <Button 
                    onClick={openMap}
                    className="w-full"
                  >
                    Launch Interactive Map
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Climate Data Visualizer</CardTitle>
                  <CardDescription>
                    Visualize climate data and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Cloud className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Visualize climate data including temperature, precipitation, and climate zones. Compare climate patterns across different regions and time periods.
                  </p>
                  <Button className="w-full">Launch Climate Visualizer</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Demographic Analyzer</CardTitle>
                  <CardDescription>
                    Analyze population and demographic data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyze population distribution, density, growth rates, and demographic characteristics. Create thematic maps and charts to visualize demographic patterns.
                  </p>
                  <Button className="w-full">Launch Demographic Analyzer</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Textbooks</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Introduction to Geography: People, Places, and Environment (Dahlman, Renwick)</li>
                      <li>Physical Geography: The Global Environment (de Blij, Muller, Burt)</li>
                      <li>Human Geography: Landscapes of Human Activities (Fellmann, Getis, Getis)</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Online Courses</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Coursera: Introduction to Physical Geography (UC Davis)</li>
                      <li>edX: Exploring Our Earth: Fundamentals of Geoscience (Harvard)</li>
                      <li>Khan Academy: Geography</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Video Tutorials</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Crash Course Geography</li>
                      <li>National Geographic Educational Videos</li>
                      <li>BBC Earth Documentaries</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Practice Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Map Exercises</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>World Map Labeling</li>
                      <li>Topographic Map Reading</li>
                      <li>GIS Exercises</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Data Analysis</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Climate Data Analysis</li>
                      <li>Demographic Data Analysis</li>
                      <li>Spatial Pattern Analysis</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Field Activities</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Local Landform Identification</li>
                      <li>Urban Geography Field Study</li>
                      <li>Weather Observation and Recording</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Cross-Subject Connections</h2>
          <SubjectIntegration currentSubject="Geography" />
        </div>
        
        {/* Interactive Map Modal */}
        {showMap && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Interactive Map</h2>
                  <Button variant="ghost" onClick={closeMap}>
                    ✕
                  </Button>
                </div>
                <InteractiveMap />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Geography;
