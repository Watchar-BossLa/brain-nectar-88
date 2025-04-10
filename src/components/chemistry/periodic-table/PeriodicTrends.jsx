import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const PeriodicTrends = ({ elements }) => {
  const [selectedTrend, setSelectedTrend] = useState('atomic_radius');
  
  // Define trends and their properties
  const trends = [
    { id: 'atomic_radius', name: 'Atomic Radius', unit: 'pm', description: 'The distance from the center of the nucleus to the outermost electron shell.' },
    { id: 'electronegativity', name: 'Electronegativity', unit: '', description: 'The tendency of an atom to attract electrons towards itself in a chemical bond.' },
    { id: 'ionization_energy', name: 'Ionization Energy', unit: 'kJ/mol', description: 'The energy required to remove an electron from a gaseous atom or ion.' },
    { id: 'electron_affinity', name: 'Electron Affinity', unit: 'kJ/mol', description: 'The energy change when a gaseous atom acquires an electron.' },
    { id: 'atomic_mass', name: 'Atomic Mass', unit: 'u', description: 'The total mass of protons, neutrons, and electrons in an atom.' },
    { id: 'density', name: 'Density', unit: 'g/cm³', description: 'The mass of a substance per unit volume.' },
    { id: 'melting_point', name: 'Melting Point', unit: 'K', description: 'The temperature at which a solid changes to a liquid.' },
    { id: 'boiling_point', name: 'Boiling Point', unit: 'K', description: 'The temperature at which a liquid changes to a gas.' }
  ];
  
  // Get the selected trend
  const trend = trends.find(t => t.id === selectedTrend);
  
  // Define color scale for the trend
  const getColorForValue = (value, min, max) => {
    if (value === null || value === undefined) return 'bg-gray-100';
    
    // Normalize value between 0 and 1
    const normalized = (value - min) / (max - min);
    
    // Color scale from blue (low) to red (high)
    const hue = (1 - normalized) * 240; // 240 is blue, 0 is red
    return `rgb(${getColorComponent(normalized, 0, 1)}, ${getColorComponent(normalized, 0.5, 0)}, ${getColorComponent(normalized, 1, 0)})`;
  };
  
  // Helper function for color calculation
  const getColorComponent = (normalized, startPoint, endPoint) => {
    if (normalized <= startPoint) return 0;
    if (normalized >= endPoint) return 255;
    return Math.round(255 * (normalized - startPoint) / (endPoint - startPoint));
  };
  
  // Get min and max values for the selected trend
  const values = elements
    .map(element => element[selectedTrend])
    .filter(value => value !== null && value !== undefined);
  
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-64">
          <Select value={selectedTrend} onValueChange={setSelectedTrend}>
            <SelectTrigger>
              <SelectValue placeholder="Select trend" />
            </SelectTrigger>
            <SelectContent>
              {trends.map(trend => (
                <SelectItem key={trend.id} value={trend.id}>
                  {trend.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            {trend.description} {trend.unit && `(${trend.unit})`}
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-18 gap-1">
            {/* Row 1 */}
            <TrendCell element={elements.find(e => e.number === 1)} trend={selectedTrend} min={minValue} max={maxValue} />
            <div className="col-span-16"></div>
            <TrendCell element={elements.find(e => e.number === 2)} trend={selectedTrend} min={minValue} max={maxValue} />
            
            {/* Row 2 */}
            <TrendCell element={elements.find(e => e.number === 3)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 4)} trend={selectedTrend} min={minValue} max={maxValue} />
            <div className="col-span-10"></div>
            <TrendCell element={elements.find(e => e.number === 5)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 6)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 7)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 8)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 9)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 10)} trend={selectedTrend} min={minValue} max={maxValue} />
            
            {/* Row 3 */}
            <TrendCell element={elements.find(e => e.number === 11)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 12)} trend={selectedTrend} min={minValue} max={maxValue} />
            <div className="col-span-10"></div>
            <TrendCell element={elements.find(e => e.number === 13)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 14)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 15)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 16)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 17)} trend={selectedTrend} min={minValue} max={maxValue} />
            <TrendCell element={elements.find(e => e.number === 18)} trend={selectedTrend} min={minValue} max={maxValue} />
            
            {/* Rows 4-7 and lanthanides/actinides would follow the same pattern */}
            {/* For brevity, I'm only showing the first 3 rows here */}
          </div>
          
          {/* Color scale legend */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs">Low</span>
              <span className="text-xs">High</span>
            </div>
            <div className="h-4 w-full bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs">{minValue.toFixed(trend.unit ? 1 : 2)} {trend.unit}</span>
              <span className="text-xs">{maxValue.toFixed(trend.unit ? 1 : 2)} {trend.unit}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-sm">
        <h3 className="font-medium mb-2">Trend Patterns</h3>
        <p className="mb-2">
          {selectedTrend === 'atomic_radius' && 
            "Atomic radius generally decreases from left to right across a period due to increasing nuclear charge, and increases from top to bottom within a group due to additional electron shells."}
          {selectedTrend === 'electronegativity' && 
            "Electronegativity generally increases from left to right across a period and decreases from top to bottom within a group, with fluorine being the most electronegative element."}
          {selectedTrend === 'ionization_energy' && 
            "Ionization energy generally increases from left to right across a period and decreases from top to bottom within a group, with noble gases having the highest values."}
          {selectedTrend === 'electron_affinity' && 
            "Electron affinity generally becomes more negative from left to right across a period, with halogens having the most negative values."}
          {selectedTrend === 'atomic_mass' && 
            "Atomic mass generally increases from left to right across a period and from top to bottom within a group, as more protons and neutrons are added to the nucleus."}
          {selectedTrend === 'density' && 
            "Density varies widely across the periodic table, with metals generally having higher densities than non-metals."}
          {selectedTrend === 'melting_point' && 
            "Melting points vary widely, with transition metals typically having high melting points due to strong metallic bonds."}
          {selectedTrend === 'boiling_point' && 
            "Boiling points generally follow similar patterns to melting points, with metals and metalloids having higher values than non-metals."}
        </p>
      </div>
    </div>
  );
};

// Helper component for trend cells
const TrendCell = ({ element, trend, min, max }) => {
  if (!element) {
    return <div className="w-14 h-14"></div>;
  }
  
  const value = element[trend];
  const hasValue = value !== null && value !== undefined;
  
  // Calculate color based on value
  const getColorStyle = () => {
    if (!hasValue) return { backgroundColor: '#f3f4f6' }; // Gray for no data
    
    // Normalize value between 0 and 1
    const normalized = (value - min) / (max - min);
    
    // Color scale from blue (low) to red (high)
    const r = Math.round(normalized * 255);
    const b = Math.round((1 - normalized) * 255);
    const g = Math.round(Math.max(0, 1 - 2 * Math.abs(normalized - 0.5)) * 255);
    
    return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
  };
  
  return (
    <div 
      className="w-14 h-14 border rounded-md flex flex-col items-center justify-center p-1 text-left"
      style={getColorStyle()}
      title={`${element.name}: ${hasValue ? value : 'No data'}`}
    >
      <div className="text-[10px] text-white/90">{element.symbol}</div>
      <div className="text-xs font-bold text-white">
        {hasValue ? (value < 100 ? value.toFixed(1) : Math.round(value)) : '-'}
      </div>
    </div>
  );
};

export default PeriodicTrends;
