import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, Mountain, Cloud, Building2, Search, ZoomIn, ZoomOut, Download, Maximize2, RefreshCw, Layers } from 'lucide-react';

/**
 * InteractiveMap component for exploring geographic features and regions
 * @returns {React.ReactElement} InteractiveMap component
 */
const InteractiveMap = () => {
  const [mapType, setMapType] = useState('physical');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showBorders, setShowBorders] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  
  // Sample map data
  const mapData = {
    regions: [
      {
        id: 'north-america',
        name: 'North America',
        description: 'The northern continent of the Americas, located entirely in the Northern Hemisphere and almost entirely in the Western Hemisphere.',
        features: [
          { name: 'Rocky Mountains', type: 'mountain', description: 'A major mountain range in western North America.' },
          { name: 'Mississippi River', type: 'river', description: 'The second-longest river in North America.' },
          { name: 'Great Lakes', type: 'lake', description: 'A series of interconnected freshwater lakes in northeastern North America.' }
        ],
        climate: 'Varies from arctic in the north to tropical in the south, with much of the continent experiencing temperate conditions.',
        population: '579 million',
        area: '24.71 million km²'
      },
      {
        id: 'south-america',
        name: 'South America',
        description: 'A continent in the Western Hemisphere, mostly in the Southern Hemisphere, with a relatively small portion in the Northern Hemisphere.',
        features: [
          { name: 'Andes Mountains', type: 'mountain', description: 'The longest continental mountain range in the world.' },
          { name: 'Amazon River', type: 'river', description: 'The largest river by discharge volume of water in the world.' },
          { name: 'Amazon Rainforest', type: 'forest', description: 'The largest rainforest in the world.' }
        ],
        climate: 'Predominantly tropical, with arid regions in the southwest and temperate climates in the south.',
        population: '430 million',
        area: '17.84 million km²'
      },
      {
        id: 'europe',
        name: 'Europe',
        description: 'A continent located entirely in the Northern Hemisphere and mostly in the Eastern Hemisphere.',
        features: [
          { name: 'Alps', type: 'mountain', description: 'The highest and most extensive mountain range system in Europe.' },
          { name: 'Danube River', type: 'river', description: 'Europe\'s second-longest river, flowing through 10 countries.' },
          { name: 'Mediterranean Sea', type: 'sea', description: 'A sea connected to the Atlantic Ocean, surrounded by the Mediterranean Basin.' }
        ],
        climate: 'Predominantly temperate, with Mediterranean climate in the south and subarctic in the north.',
        population: '746 million',
        area: '10.18 million km²'
      },
      {
        id: 'africa',
        name: 'Africa',
        description: 'The second-largest and second-most populous continent, after Asia in both cases.',
        features: [
          { name: 'Sahara Desert', type: 'desert', description: 'The largest hot desert in the world.' },
          { name: 'Nile River', type: 'river', description: 'The longest river in Africa and one of the longest in the world.' },
          { name: 'Mount Kilimanjaro', type: 'mountain', description: 'The highest mountain in Africa.' }
        ],
        climate: 'Varies from tropical to subarctic on its highest peaks, with arid and semi-arid in the north and south.',
        population: '1.3 billion',
        area: '30.37 million km²'
      },
      {
        id: 'asia',
        name: 'Asia',
        description: 'The largest and most populous continent, located primarily in the Eastern and Northern Hemispheres.',
        features: [
          { name: 'Himalayas', type: 'mountain', description: 'The highest mountain range in the world.' },
          { name: 'Yangtze River', type: 'river', description: 'The longest river in Asia and the third-longest in the world.' },
          { name: 'Gobi Desert', type: 'desert', description: 'A large desert region in East Asia.' }
        ],
        climate: 'Extremely diverse, ranging from arctic in the north to tropical in the south.',
        population: '4.6 billion',
        area: '44.58 million km²'
      },
      {
        id: 'oceania',
        name: 'Oceania',
        description: 'A geographic region that includes Australasia, Melanesia, Micronesia, and Polynesia.',
        features: [
          { name: 'Great Barrier Reef', type: 'reef', description: 'The world\'s largest coral reef system.' },
          { name: 'Great Dividing Range', type: 'mountain', description: 'Australia\'s most substantial mountain range.' },
          { name: 'Murray River', type: 'river', description: 'Australia\'s longest river.' }
        ],
        climate: 'Varies from tropical in the north to temperate in the south.',
        population: '42 million',
        area: '8.53 million km²'
      },
      {
        id: 'antarctica',
        name: 'Antarctica',
        description: 'The southernmost continent, containing the geographic South Pole.',
        features: [
          { name: 'Transantarctic Mountains', type: 'mountain', description: 'A major mountain range that divides the continent into East and West Antarctica.' },
          { name: 'Antarctic Ice Sheet', type: 'ice', description: 'The largest single mass of ice on Earth.' },
          { name: 'Mount Erebus', type: 'volcano', description: 'The second-highest volcano in Antarctica and the southernmost active volcano on Earth.' }
        ],
        climate: 'The coldest, windiest, and driest continent, with an extreme desert climate.',
        population: '0 (no permanent residents)',
        area: '14.2 million km²'
      }
    ]
  };
  
  // Filter regions based on search query
  const filteredRegions = mapData.regions.filter(region => {
    return searchQuery === '' || 
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.features.some(feature => feature.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  
  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle region selection
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };
  
  // Draw map on canvas
  useEffect(() => {
    if (!mapRef.current) return;
    
    const ctx = mapRef.current.getContext('2d');
    const { width, height } = mapRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // In a real implementation, this would use a mapping library like Leaflet or Mapbox
    // For this placeholder, we'll draw a simple world map outline
    
    // Draw background
    ctx.fillStyle = mapType === 'physical' ? '#c8e6c9' : '#e3f2fd';
    ctx.fillRect(0, 0, width, height);
    
    // Draw simplified continent outlines
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 2;
    
    // North America
    ctx.beginPath();
    ctx.moveTo(150 * zoomLevel, 120 * zoomLevel);
    ctx.lineTo(220 * zoomLevel, 150 * zoomLevel);
    ctx.lineTo(180 * zoomLevel, 220 * zoomLevel);
    ctx.lineTo(120 * zoomLevel, 180 * zoomLevel);
    ctx.closePath();
    ctx.fillStyle = selectedRegion === 'north-america' ? '#a5d6a7' : '#e0e0e0';
    ctx.fill();
    if (showBorders) ctx.stroke();
    
    // South America
    ctx.beginPath();
    ctx.moveTo(200 * zoomLevel, 230 * zoomLevel);
    ctx.lineTo(220 * zoomLevel, 300 * zoomLevel);
    ctx.lineTo(180 * zoomLevel, 350 * zoomLevel);
    ctx.lineTo(160 * zoomLevel, 280 * zoomLevel);
    ctx.closePath();
    ctx.fillStyle = selectedRegion === 'south-america' ? '#a5d6a7' : '#e0e0e0';
    ctx.fill();
    if (showBorders) ctx.stroke();
    
    // Europe
    ctx.beginPath();
    ctx.moveTo(300 * zoomLevel, 120 * zoomLevel);
    ctx.lineTo(350 * zoomLevel, 130 * zoomLevel);
    ctx.lineTo(330 * zoomLevel, 170 * zoomLevel);
    ctx.lineTo(280 * zoomLevel, 160 * zoomLevel);
    ctx.closePath();
    ctx.fillStyle = selectedRegion === 'europe' ? '#a5d6a7' : '#e0e0e0';
    ctx.fill();
    if (showBorders) ctx.stroke();
    
    // Africa
    ctx.beginPath();
    ctx.moveTo(300 * zoomLevel, 180 * zoomLevel);
    ctx.lineTo(350 * zoomLevel, 190 * zoomLevel);
    ctx.lineTo(330 * zoomLevel, 280 * zoomLevel);
    ctx.lineTo(280 * zoomLevel, 270 * zoomLevel);
    ctx.closePath();
    ctx.fillStyle = selectedRegion === 'africa' ? '#a5d6a7' : '#e0e0e0';
    ctx.fill();
    if (showBorders) ctx.stroke();
    
    // Asia
    ctx.beginPath();
    ctx.moveTo(360 * zoomLevel, 120 * zoomLevel);
    ctx.lineTo(450 * zoomLevel, 150 * zoomLevel);
    ctx.lineTo(430 * zoomLevel, 220 * zoomLevel);
    ctx.lineTo(350 * zoomLevel, 180 * zoomLevel);
    ctx.closePath();
    ctx.fillStyle = selectedRegion === 'asia' ? '#a5d6a7' : '#e0e0e0';
    ctx.fill();
    if (showBorders) ctx.stroke();
    
    // Oceania
    ctx.beginPath();
    ctx.moveTo(450 * zoomLevel, 250 * zoomLevel);
    ctx.lineTo(480 * zoomLevel, 260 * zoomLevel);
    ctx.lineTo(470 * zoomLevel, 290 * zoomLevel);
    ctx.lineTo(440 * zoomLevel, 280 * zoomLevel);
    ctx.closePath();
    ctx.fillStyle = selectedRegion === 'oceania' ? '#a5d6a7' : '#e0e0e0';
    ctx.fill();
    if (showBorders) ctx.stroke();
    
    // Antarctica
    ctx.beginPath();
    ctx.moveTo(200 * zoomLevel, 380 * zoomLevel);
    ctx.lineTo(400 * zoomLevel, 380 * zoomLevel);
    ctx.lineTo(350 * zoomLevel, 400 * zoomLevel);
    ctx.lineTo(250 * zoomLevel, 400 * zoomLevel);
    ctx.closePath();
    ctx.fillStyle = selectedRegion === 'antarctica' ? '#a5d6a7' : '#e0e0e0';
    ctx.fill();
    if (showBorders) ctx.stroke();
    
    // Draw labels if enabled
    if (showLabels) {
      ctx.fillStyle = '#000000';
      ctx.font = `${12 * zoomLevel}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText('North America', 170 * zoomLevel, 160 * zoomLevel);
      ctx.fillText('South America', 190 * zoomLevel, 290 * zoomLevel);
      ctx.fillText('Europe', 310 * zoomLevel, 140 * zoomLevel);
      ctx.fillText('Africa', 310 * zoomLevel, 230 * zoomLevel);
      ctx.fillText('Asia', 400 * zoomLevel, 170 * zoomLevel);
      ctx.fillText('Oceania', 460 * zoomLevel, 270 * zoomLevel);
      ctx.fillText('Antarctica', 300 * zoomLevel, 390 * zoomLevel);
    }
    
    // Draw physical features if physical map is selected
    if (mapType === 'physical') {
      // Mountains
      ctx.fillStyle = '#8d6e63';
      
      // North America - Rocky Mountains
      ctx.beginPath();
      ctx.moveTo(150 * zoomLevel, 150 * zoomLevel);
      ctx.lineTo(160 * zoomLevel, 140 * zoomLevel);
      ctx.lineTo(170 * zoomLevel, 160 * zoomLevel);
      ctx.closePath();
      ctx.fill();
      
      // South America - Andes
      ctx.beginPath();
      ctx.moveTo(180 * zoomLevel, 260 * zoomLevel);
      ctx.lineTo(185 * zoomLevel, 250 * zoomLevel);
      ctx.lineTo(190 * zoomLevel, 320 * zoomLevel);
      ctx.closePath();
      ctx.fill();
      
      // Europe - Alps
      ctx.beginPath();
      ctx.moveTo(310 * zoomLevel, 140 * zoomLevel);
      ctx.lineTo(315 * zoomLevel, 135 * zoomLevel);
      ctx.lineTo(320 * zoomLevel, 145 * zoomLevel);
      ctx.closePath();
      ctx.fill();
      
      // Asia - Himalayas
      ctx.beginPath();
      ctx.moveTo(380 * zoomLevel, 170 * zoomLevel);
      ctx.lineTo(390 * zoomLevel, 160 * zoomLevel);
      ctx.lineTo(400 * zoomLevel, 180 * zoomLevel);
      ctx.closePath();
      ctx.fill();
      
      // Rivers
      ctx.strokeStyle = '#2196f3';
      ctx.lineWidth = 1.5 * zoomLevel;
      
      // North America - Mississippi
      ctx.beginPath();
      ctx.moveTo(170 * zoomLevel, 140 * zoomLevel);
      ctx.lineTo(180 * zoomLevel, 180 * zoomLevel);
      ctx.stroke();
      
      // South America - Amazon
      ctx.beginPath();
      ctx.moveTo(190 * zoomLevel, 270 * zoomLevel);
      ctx.lineTo(220 * zoomLevel, 280 * zoomLevel);
      ctx.stroke();
      
      // Africa - Nile
      ctx.beginPath();
      ctx.moveTo(310 * zoomLevel, 200 * zoomLevel);
      ctx.lineTo(300 * zoomLevel, 250 * zoomLevel);
      ctx.stroke();
      
      // Asia - Yangtze
      ctx.beginPath();
      ctx.moveTo(400 * zoomLevel, 160 * zoomLevel);
      ctx.lineTo(430 * zoomLevel, 170 * zoomLevel);
      ctx.stroke();
    }
    
  }, [mapType, zoomLevel, showLabels, showBorders, selectedRegion]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Map Controls */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Map Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={mapType === 'physical' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setMapType('physical')}
                  >
                    <Mountain className="mr-2 h-4 w-4" />
                    Physical Map
                  </Button>
                  <Button
                    variant={mapType === 'political' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setMapType('political')}
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Political Map
                  </Button>
                  <Button
                    variant={mapType === 'climate' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setMapType('climate')}
                  >
                    <Cloud className="mr-2 h-4 w-4" />
                    Climate Map
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search">Search Locations</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Search regions, features..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="zoom-level">Zoom Level</Label>
                  <span className="text-sm">{zoomLevel.toFixed(1)}x</span>
                </div>
                <Slider
                  id="zoom-level"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[zoomLevel]}
                  onValueChange={(value) => setZoomLevel(value[0])}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-labels" className="cursor-pointer">Show Labels</Label>
                <Switch
                  id="show-labels"
                  checked={showLabels}
                  onCheckedChange={setShowLabels}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-borders" className="cursor-pointer">Show Borders</Label>
                <Switch
                  id="show-borders"
                  checked={showBorders}
                  onCheckedChange={setShowBorders}
                />
              </div>
              
              <div className="pt-2">
                <Label>Regions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {mapData.regions.map(region => (
                    <Badge
                      key={region.id}
                      variant={selectedRegion === region.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleRegionSelect(region.id)}
                    >
                      {region.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Map Visualization */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{mapType.charAt(0).toUpperCase() + mapType.slice(1)} Map</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" title="Reset View">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Download Map">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Full Screen">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas 
                  ref={mapRef} 
                  width="600" 
                  height="400"
                  className="w-full h-auto border rounded-md"
                />
                
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Map Layers
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {filteredRegions.length} regions available
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="km">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="km">Kilometers</SelectItem>
                      <SelectItem value="mi">Miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Region Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Region Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="regions">
            <TabsList>
              <TabsTrigger value="regions">Regions</TabsTrigger>
              <TabsTrigger value="features">Geographic Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="regions" className="pt-4">
              <div className="space-y-4">
                {filteredRegions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                    <p>No regions match your search criteria.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  filteredRegions.map(region => (
                    <div key={region.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{region.name}</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRegionSelect(region.id)}
                        >
                          View on Map
                        </Button>
                      </div>
                      <p className="text-sm mt-2">{region.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Population:</span>
                            <span>{region.population}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Area:</span>
                            <span>{region.area}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Climate:</span>
                            <p className="mt-1">{region.climate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="pt-4">
              <div className="space-y-4">
                {filteredRegions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mountain className="h-12 w-12 mx-auto mb-4" />
                    <p>No features match your search criteria.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  filteredRegions.flatMap(region => 
                    region.features.map(feature => (
                      <div key={`${region.id}-${feature.name}`} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{feature.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{feature.type}</Badge>
                              <span className="text-xs text-muted-foreground">{region.name}</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRegionSelect(region.id)}
                          >
                            View on Map
                          </Button>
                        </div>
                        <p className="text-sm mt-2">{feature.description}</p>
                      </div>
                    ))
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveMap;
