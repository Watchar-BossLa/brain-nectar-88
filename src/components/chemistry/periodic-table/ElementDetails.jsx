import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const ElementDetails = ({ element }) => {
  const [activeTab, setActiveTab] = useState('properties');
  
  // Define colors for different element categories
  const categoryColors = {
    'alkali metal': 'bg-red-100 border-red-300',
    'alkaline earth metal': 'bg-orange-100 border-orange-300',
    'transition metal': 'bg-yellow-100 border-yellow-300',
    'post-transition metal': 'bg-green-100 border-green-300',
    'metalloid': 'bg-teal-100 border-teal-300',
    'nonmetal': 'bg-blue-100 border-blue-300',
    'halogen': 'bg-indigo-100 border-indigo-300',
    'noble gas': 'bg-purple-100 border-purple-300',
    'lanthanide': 'bg-pink-100 border-pink-300',
    'actinide': 'bg-rose-100 border-rose-300'
  };
  
  const colorClass = categoryColors[element.category] || 'bg-gray-100 border-gray-300';
  
  return (
    <div className="space-y-4">
      {/* Element Header */}
      <div className="flex items-center gap-4">
        <div className={`w-20 h-20 ${colorClass} border rounded-md flex flex-col items-center justify-center p-2`}>
          <div className="text-xs">{element.number}</div>
          <div className="text-3xl font-bold">{element.symbol}</div>
          <div className="text-xs">{element.atomic_mass.toFixed(3)}</div>
        </div>
        <div>
          <h3 className="text-2xl font-bold">{element.name}</h3>
          <p className="text-muted-foreground">{element.category.charAt(0).toUpperCase() + element.category.slice(1)}</p>
        </div>
      </div>
      
      {/* Element Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="structure">Atomic Structure</TabsTrigger>
          <TabsTrigger value="facts">Interesting Facts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Atomic Number</h4>
                  <p>{element.number}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Atomic Mass</h4>
                  <p>{element.atomic_mass.toFixed(3)} u</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Period</h4>
                  <p>{element.period}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Group</h4>
                  <p>{element.group || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Phase at STP</h4>
                  <p>{element.phase}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Density</h4>
                  <p>{element.density ? `${element.density} g/cm³` : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Melting Point</h4>
                  <p>{element.melt ? `${element.melt} K` : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Boiling Point</h4>
                  <p>{element.boil ? `${element.boil} K` : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium mb-2">Chemical Properties</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Electronegativity</h4>
                  <p>{element.electronegativity_pauling || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Electron Affinity</h4>
                  <p>{element.electron_affinity ? `${element.electron_affinity} kJ/mol` : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Ionization Energy</h4>
                  <p>{element.ionization_energies && element.ionization_energies.length > 0 
                    ? `${element.ionization_energies[0]} kJ/mol` 
                    : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Oxidation States</h4>
                  <p>{element.oxidation_states || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Electron Configuration</h4>
                  <p>{element.electron_configuration}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Electron Configuration Semantic</h4>
                  <p>{element.electron_configuration_semantic}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Electrons per Shell</h4>
                  <p>{element.shells.join(', ')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Atomic Radius</h4>
                  <p>{element.atomic_radius ? `${element.atomic_radius} pm` : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center p-4">
            <div className="relative w-64 h-64 border rounded-full flex items-center justify-center">
              {/* Nucleus */}
              <div className="w-16 h-16 bg-red-100 border border-red-300 rounded-full flex items-center justify-center z-10">
                <div className="text-xs text-center">
                  <div>{element.number}p</div>
                  <div>{Math.round(element.atomic_mass - element.number)}n</div>
                </div>
              </div>
              
              {/* Electron shells */}
              {element.shells.map((electrons, index) => (
                <div 
                  key={index}
                  className="absolute border border-blue-200 rounded-full"
                  style={{
                    width: `${(index + 1) * 40}px`,
                    height: `${(index + 1) * 40}px`,
                    opacity: 0.7
                  }}
                >
                  {/* Electrons */}
                  {Array.from({ length: electrons }).map((_, i) => {
                    const angle = (i * 360 / electrons) * (Math.PI / 180);
                    const radius = (index + 1) * 20;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <div
                        key={i}
                        className="absolute w-3 h-3 bg-blue-500 rounded-full"
                        style={{
                          transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                          left: '50%',
                          top: '50%'
                        }}
                      ></div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="facts" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-medium mb-2">Discovery</h4>
              <p>
                {element.name} was discovered by {element.discovered_by || 'unknown'} 
                in {element.discovery_year || 'unknown year'}.
              </p>
              
              <h4 className="text-sm font-medium mt-4 mb-2">Named After</h4>
              <p>{element.named_after || 'N/A'}</p>
              
              <h4 className="text-sm font-medium mt-4 mb-2">Applications</h4>
              <p>{element.applications || 'Information not available.'}</p>
              
              <h4 className="text-sm font-medium mt-4 mb-2">Biological Role</h4>
              <p>{element.biological_role || 'Information not available.'}</p>
              
              <h4 className="text-sm font-medium mt-4 mb-2">Natural Occurrence</h4>
              <p>{element.natural_occurrence || 'Information not available.'}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElementDetails;
