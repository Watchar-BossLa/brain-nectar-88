import React, { useState, useEffect } from 'react';
import './periodicTable.css';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Info } from 'lucide-react';
import ElementCard from './ElementCard';
import ElementDetails from './ElementDetails';
import PeriodicTrends from './PeriodicTrends';
import { periodicTableData } from './periodicTableData';

const PeriodicTable = () => {
  const [elements, setElements] = useState(periodicTableData);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeView, setActiveView] = useState('table');
  const [showDetails, setShowDetails] = useState(false);

  // Filter elements based on search query and category
  useEffect(() => {
    let filteredElements = periodicTableData;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredElements = filteredElements.filter(element =>
        element.name.toLowerCase().includes(query) ||
        element.symbol.toLowerCase().includes(query) ||
        element.number.toString().includes(query)
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filteredElements = filteredElements.filter(element =>
        element.category === filterCategory
      );
    }

    setElements(filteredElements);
  }, [searchQuery, filterCategory]);

  // Handle element selection
  const handleElementClick = (element) => {
    setSelectedElement(element);
    setShowDetails(true);
  };

  // Close element details
  const closeDetails = () => {
    setShowDetails(false);
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(periodicTableData.map(element => element.category))];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Periodic Table</CardTitle>
        <CardDescription>
          Explore the elements and their properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">Periodic Table</TabsTrigger>
            <TabsTrigger value="trends">Periodic Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-4">
            <div className="relative">
              {/* Periodic Table Grid */}
              <div className="grid grid-cols-18 gap-1 overflow-x-auto pb-4">
                {/* Row 1 */}
                <ElementCard element={elements.find(e => e.number === 1)} onClick={handleElementClick} />
                <div className="col-span-16"></div>
                <ElementCard element={elements.find(e => e.number === 2)} onClick={handleElementClick} />

                {/* Row 2 */}
                <ElementCard element={elements.find(e => e.number === 3)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 4)} onClick={handleElementClick} />
                <div className="col-span-10"></div>
                <ElementCard element={elements.find(e => e.number === 5)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 6)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 7)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 8)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 9)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 10)} onClick={handleElementClick} />

                {/* Row 3 */}
                <ElementCard element={elements.find(e => e.number === 11)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 12)} onClick={handleElementClick} />
                <div className="col-span-10"></div>
                <ElementCard element={elements.find(e => e.number === 13)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 14)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 15)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 16)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 17)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 18)} onClick={handleElementClick} />

                {/* Row 4 */}
                <ElementCard element={elements.find(e => e.number === 19)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 20)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 21)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 22)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 23)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 24)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 25)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 26)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 27)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 28)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 29)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 30)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 31)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 32)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 33)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 34)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 35)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 36)} onClick={handleElementClick} />

                {/* Row 5 */}
                <ElementCard element={elements.find(e => e.number === 37)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 38)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 39)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 40)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 41)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 42)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 43)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 44)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 45)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 46)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 47)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 48)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 49)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 50)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 51)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 52)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 53)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 54)} onClick={handleElementClick} />

                {/* Row 6 */}
                <ElementCard element={elements.find(e => e.number === 55)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 56)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 57)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 72)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 73)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 74)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 75)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 76)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 77)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 78)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 79)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 80)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 81)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 82)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 83)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 84)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 85)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 86)} onClick={handleElementClick} />

                {/* Row 7 */}
                <ElementCard element={elements.find(e => e.number === 87)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 88)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 89)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 104)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 105)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 106)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 107)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 108)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 109)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 110)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 111)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 112)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 113)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 114)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 115)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 116)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 117)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 118)} onClick={handleElementClick} />

                {/* Spacer */}
                <div className="col-span-18 h-4"></div>

                {/* Lanthanides */}
                <div className="col-span-3"></div>
                <ElementCard element={elements.find(e => e.number === 58)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 59)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 60)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 61)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 62)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 63)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 64)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 65)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 66)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 67)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 68)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 69)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 70)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 71)} onClick={handleElementClick} />
                <div className="col-span-1"></div>

                {/* Actinides */}
                <div className="col-span-3"></div>
                <ElementCard element={elements.find(e => e.number === 90)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 91)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 92)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 93)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 94)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 95)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 96)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 97)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 98)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 99)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 100)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 101)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 102)} onClick={handleElementClick} />
                <ElementCard element={elements.find(e => e.number === 103)} onClick={handleElementClick} />
                <div className="col-span-1"></div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {categories.filter(cat => cat !== 'all').map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-sm bg-${category.replace(' ', '-')}`}></div>
                    <span className="text-xs">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </div>
                ))}
              </div>

              {/* Element Details Modal */}
              {showDetails && selectedElement && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Element Details</h2>
                        <Button variant="ghost" onClick={closeDetails}>
                          ✕
                        </Button>
                      </div>
                      <ElementDetails element={selectedElement} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-4">
            <PeriodicTrends elements={periodicTableData} />
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-4">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            Click on any element to view detailed information including physical properties,
            electron configuration, and interesting facts. Use the tabs to switch between the
            periodic table view and periodic trends visualization.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodicTable;
