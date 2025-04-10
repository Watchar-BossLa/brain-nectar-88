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
import { Scroll, Globe, Search, ZoomIn, ZoomOut, Download, Maximize2, RefreshCw, Filter } from 'lucide-react';

/**
 * HistoricalTimeline component for visualizing historical events and periods
 * @returns {React.ReactElement} HistoricalTimeline component
 */
const HistoricalTimeline = () => {
  const [timelinePeriod, setTimelinePeriod] = useState('ancient');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [showRegions, setShowRegions] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState(['mesopotamia', 'egypt', 'greece', 'rome', 'china', 'india']);
  const [searchQuery, setSearchQuery] = useState('');
  const timelineRef = useRef(null);
  
  // Sample timeline data
  const timelineData = {
    ancient: {
      title: 'Ancient Civilizations (3500 BCE - 500 CE)',
      events: [
        { 
          id: 1, 
          title: 'Sumerian Civilization', 
          startYear: -3500, 
          endYear: -2000, 
          region: 'mesopotamia',
          category: 'civilization',
          description: 'The Sumerians developed one of the earliest urban civilizations in Mesopotamia, with innovations including cuneiform writing, irrigation systems, and city-states.',
          significance: 'Established foundations for urban society, writing, and governance that influenced later civilizations.'
        },
        { 
          id: 2, 
          title: 'Ancient Egyptian Old Kingdom', 
          startYear: -2700, 
          endYear: -2200, 
          region: 'egypt',
          category: 'civilization',
          description: 'Period of the great pyramid builders, including the Step Pyramid of Djoser and the Great Pyramid of Giza.',
          significance: 'Demonstrated advanced engineering, mathematics, and organizational capabilities.'
        },
        { 
          id: 3, 
          title: 'Code of Hammurabi', 
          startYear: -1754, 
          endYear: -1754, 
          region: 'mesopotamia',
          category: 'law',
          description: 'One of the earliest and most complete legal codes, established by the Babylonian king Hammurabi.',
          significance: 'Established principles of justice and governance that influenced later legal systems.'
        },
        { 
          id: 4, 
          title: 'Shang Dynasty', 
          startYear: -1600, 
          endYear: -1046, 
          region: 'china',
          category: 'civilization',
          description: 'The first historically confirmed dynasty in China, known for bronze artifacts and oracle bone script.',
          significance: 'Established foundations for Chinese writing, culture, and governance.'
        },
        { 
          id: 5, 
          title: 'Trojan War', 
          startYear: -1260, 
          endYear: -1180, 
          region: 'greece',
          category: 'conflict',
          description: 'Legendary conflict between Greeks and the city of Troy, immortalized in Homer\'s Iliad.',
          significance: 'Foundational narrative in Greek literature and identity.'
        },
        { 
          id: 6, 
          title: 'Classical Athens', 
          startYear: -500, 
          endYear: -323, 
          region: 'greece',
          category: 'civilization',
          description: 'Golden age of Athenian democracy, philosophy, drama, and art.',
          significance: 'Established foundations for Western philosophy, politics, and arts.'
        },
        { 
          id: 7, 
          title: 'Roman Republic', 
          startYear: -509, 
          endYear: -27, 
          region: 'rome',
          category: 'civilization',
          description: 'Period of representative government in Rome before the establishment of the Empire.',
          significance: 'Developed republican principles of governance that influenced modern democracies.'
        },
        { 
          id: 8, 
          title: 'Maurya Empire', 
          startYear: -322, 
          endYear: -185, 
          region: 'india',
          category: 'civilization',
          description: 'First empire to unify most of the Indian subcontinent, reaching its peak under Emperor Ashoka.',
          significance: 'Spread Buddhism and established principles of governance across South Asia.'
        },
        { 
          id: 9, 
          title: 'Qin Dynasty', 
          startYear: -221, 
          endYear: -206, 
          region: 'china',
          category: 'civilization',
          description: 'First imperial dynasty of China that unified the country under Emperor Qin Shi Huang.',
          significance: 'Standardized writing, measurements, and currency, and began construction of the Great Wall.'
        },
        { 
          id: 10, 
          title: 'Roman Empire', 
          startYear: -27, 
          endYear: 476, 
          region: 'rome',
          category: 'civilization',
          description: 'Period of imperial rule in Rome from Augustus to the fall of the Western Roman Empire.',
          significance: 'Spread Roman law, language, and culture throughout the Mediterranean and Europe.'
        }
      ]
    },
    medieval: {
      title: 'Medieval Period (500 CE - 1500 CE)',
      events: [
        { 
          id: 1, 
          title: 'Byzantine Empire', 
          startYear: 330, 
          endYear: 1453, 
          region: 'europe',
          category: 'civilization',
          description: 'Continuation of the Roman Empire in the East, centered on Constantinople.',
          significance: 'Preserved Greco-Roman culture and served as a buffer between Europe and Asia.'
        },
        { 
          id: 2, 
          title: 'Islamic Golden Age', 
          startYear: 750, 
          endYear: 1258, 
          region: 'middle-east',
          category: 'cultural',
          description: 'Period of scientific, cultural, and economic flourishing in the Islamic world.',
          significance: 'Advanced mathematics, astronomy, medicine, and preserved classical knowledge.'
        },
        { 
          id: 3, 
          title: 'Tang Dynasty', 
          startYear: 618, 
          endYear: 907, 
          region: 'china',
          category: 'civilization',
          description: 'Golden age of Chinese civilization with advancements in arts, technology, and governance.',
          significance: 'Expanded Chinese influence throughout East Asia and along the Silk Road.'
        }
      ]
    },
    modern: {
      title: 'Modern Era (1500 CE - Present)',
      events: [
        { 
          id: 1, 
          title: 'Renaissance', 
          startYear: 1400, 
          endYear: 1600, 
          region: 'europe',
          category: 'cultural',
          description: 'Period of renewed interest in classical learning and arts in Europe.',
          significance: 'Transformed European art, science, and philosophy, laying groundwork for the modern era.'
        },
        { 
          id: 2, 
          title: 'Age of Exploration', 
          startYear: 1450, 
          endYear: 1650, 
          region: 'global',
          category: 'exploration',
          description: 'Period of extensive overseas exploration by European powers.',
          significance: 'Connected global regions and initiated European colonization.'
        },
        { 
          id: 3, 
          title: 'Industrial Revolution', 
          startYear: 1760, 
          endYear: 1840, 
          region: 'europe',
          category: 'economic',
          description: 'Transition to new manufacturing processes in Europe and North America.',
          significance: 'Transformed economic and social systems worldwide.'
        }
      ]
    }
  };
  
  // Region colors for the timeline
  const regionColors = {
    mesopotamia: '#f59e0b',
    egypt: '#10b981',
    greece: '#3b82f6',
    rome: '#ef4444',
    china: '#8b5cf6',
    india: '#ec4899',
    europe: '#6366f1',
    'middle-east': '#f97316',
    global: '#64748b'
  };
  
  // Category icons for the timeline
  const categoryIcons = {
    civilization: '🏛️',
    cultural: '🎭',
    conflict: '⚔️',
    law: '⚖️',
    exploration: '🧭',
    economic: '💰'
  };
  
  // Filter events based on selected regions and search query
  const filteredEvents = timelineData[timelinePeriod].events.filter(event => {
    const matchesRegion = selectedRegions.includes(event.region);
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });
  
  // Get the time range for the current period
  const getTimeRange = () => {
    const events = timelineData[timelinePeriod].events;
    const startYears = events.map(event => event.startYear);
    const endYears = events.map(event => event.endYear);
    const minYear = Math.min(...startYears);
    const maxYear = Math.max(...endYears);
    return { minYear, maxYear };
  };
  
  // Format year for display (BCE/CE)
  const formatYear = (year) => {
    if (year < 0) {
      return `${Math.abs(year)} BCE`;
    } else {
      return `${year} CE`;
    }
  };
  
  // Calculate position on timeline
  const calculatePosition = (year) => {
    const { minYear, maxYear } = getTimeRange();
    const timelineWidth = 100; // percentage
    const position = ((year - minYear) / (maxYear - minYear)) * timelineWidth;
    return `${position}%`;
  };
  
  // Calculate width on timeline for period events
  const calculateWidth = (startYear, endYear) => {
    const { minYear, maxYear } = getTimeRange();
    const timelineWidth = 100; // percentage
    const startPosition = ((startYear - minYear) / (maxYear - minYear)) * timelineWidth;
    const endPosition = ((endYear - minYear) / (maxYear - minYear)) * timelineWidth;
    return `${endPosition - startPosition}%`;
  };
  
  // Handle region selection
  const toggleRegion = (region) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Draw timeline markers
  const generateTimelineMarkers = () => {
    const { minYear, maxYear } = getTimeRange();
    const range = maxYear - minYear;
    const markerCount = 10;
    const markers = [];
    
    for (let i = 0; i <= markerCount; i++) {
      const year = minYear + (range * (i / markerCount));
      markers.push(
        <div 
          key={i} 
          className="absolute transform -translate-x-1/2"
          style={{ left: `${(i / markerCount) * 100}%` }}
        >
          <div className="h-3 border-l border-gray-400"></div>
          <div className="text-xs text-gray-500 mt-1">{formatYear(Math.round(year))}</div>
        </div>
      );
    }
    
    return markers;
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Timeline Controls */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Timeline Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Time Period</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={timelinePeriod === 'ancient' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setTimelinePeriod('ancient')}
                  >
                    <Scroll className="mr-2 h-4 w-4" />
                    Ancient (3500 BCE - 500 CE)
                  </Button>
                  <Button
                    variant={timelinePeriod === 'medieval' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setTimelinePeriod('medieval')}
                  >
                    <Scroll className="mr-2 h-4 w-4" />
                    Medieval (500 CE - 1500 CE)
                  </Button>
                  <Button
                    variant={timelinePeriod === 'modern' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setTimelinePeriod('modern')}
                  >
                    <Scroll className="mr-2 h-4 w-4" />
                    Modern (1500 CE - Present)
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Regions</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(regionColors).map(([region, color]) => (
                    <Badge
                      key={region}
                      variant={selectedRegions.includes(region) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      style={{ backgroundColor: selectedRegions.includes(region) ? color : 'transparent', color: selectedRegions.includes(region) ? 'white' : 'inherit' }}
                      onClick={() => toggleRegion(region)}
                    >
                      {region.charAt(0).toUpperCase() + region.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search">Search Events</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="search"
                    placeholder="Search events..."
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
                <Label htmlFor="show-regions" className="cursor-pointer">Color by Region</Label>
                <Switch
                  id="show-regions"
                  checked={showRegions}
                  onCheckedChange={setShowRegions}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Timeline Visualization */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{timelineData[timelinePeriod].title}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" title="Reset View">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Download Image">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" title="Full Screen">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                ref={timelineRef}
                className="relative mt-8 mb-12 mx-4"
                style={{ height: `${300 * zoomLevel}px`, overflowY: 'auto' }}
              >
                {/* Timeline axis */}
                <div className="absolute left-0 right-0 h-1 bg-gray-300 top-0"></div>
                
                {/* Timeline markers */}
                {generateTimelineMarkers()}
                
                {/* Timeline events */}
                <div className="relative mt-8">
                  {filteredEvents.map((event, index) => {
                    const isPointEvent = event.startYear === event.endYear;
                    const top = index * 60; // Vertical spacing
                    
                    return (
                      <div 
                        key={event.id}
                        className={`absolute ${isPointEvent ? 'transform -translate-x-1/2' : ''}`}
                        style={{ 
                          left: isPointEvent ? calculatePosition(event.startYear) : calculatePosition(event.startYear),
                          width: isPointEvent ? 'auto' : calculateWidth(event.startYear, event.endYear),
                          top: `${top}px`
                        }}
                      >
                        {isPointEvent ? (
                          // Point event (single year)
                          <div className="flex flex-col items-center">
                            <div 
                              className="w-4 h-4 rounded-full border-2 border-white"
                              style={{ backgroundColor: showRegions ? regionColors[event.region] : '#3b82f6' }}
                            ></div>
                            {showLabels && (
                              <div className="mt-1 text-xs font-medium max-w-[150px] text-center">
                                <span className="mr-1">{categoryIcons[event.category]}</span>
                                {event.title}
                                <div className="text-xs text-muted-foreground">{formatYear(event.startYear)}</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Period event (span of years)
                          <div className="flex flex-col">
                            <div 
                              className="h-8 rounded-md px-2 flex items-center text-white text-xs font-medium"
                              style={{ backgroundColor: showRegions ? regionColors[event.region] : '#3b82f6' }}
                            >
                              <span className="mr-1">{categoryIcons[event.category]}</span>
                              {showLabels && event.title}
                            </div>
                            {showLabels && (
                              <div className="text-xs mt-1 text-muted-foreground">
                                {formatYear(event.startYear)} - {formatYear(event.endYear)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {filteredEvents.length} events displayed
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 2))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.5))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Event Details */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">Event List</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="pt-4">
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Filter className="h-12 w-12 mx-auto mb-4" />
                    <p>No events match your current filters.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSelectedRegions(['mesopotamia', 'egypt', 'greece', 'rome', 'china', 'india', 'europe', 'middle-east', 'global']);
                        setSearchQuery('');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  filteredEvents.map(event => (
                    <div key={event.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium flex items-center">
                            <span className="mr-1">{categoryIcons[event.category]}</span>
                            {event.title}
                          </h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatYear(event.startYear)}
                            {event.startYear !== event.endYear && ` - ${formatYear(event.endYear)}`}
                          </div>
                        </div>
                        <Badge 
                          style={{ backgroundColor: regionColors[event.region] }}
                          className="text-white"
                        >
                          {event.region.charAt(0).toUpperCase() + event.region.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{event.description}</p>
                      <div className="mt-2">
                        <span className="text-sm font-medium">Significance: </span>
                        <span className="text-sm text-muted-foreground">{event.significance}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="comparison" className="pt-4">
              <div className="text-center py-12 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4" />
                <p>Comparative timeline analysis will be available in a future update.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoricalTimeline;
