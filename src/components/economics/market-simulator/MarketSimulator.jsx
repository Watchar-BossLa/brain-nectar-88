import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Basic MarketSimulator component for visualizing supply and demand
 * @returns {React.ReactElement} MarketSimulator component
 */
const MarketSimulator = () => {
  // Basic state for supply and demand parameters
  const [demandIntercept, setDemandIntercept] = useState(100);
  const [demandSlope, setDemandSlope] = useState(1.5);
  const [supplyIntercept, setSupplyIntercept] = useState(20);
  const [supplySlope, setSupplySlope] = useState(1.0);
  
  // State for market interventions
  const [taxPerUnit, setTaxPerUnit] = useState(0);
  const [subsidy, setSubsidy] = useState(0);
  const [priceFloor, setPriceFloor] = useState(0);
  const [priceCeiling, setPriceCeiling] = useState(0);
  
  // State for market equilibrium
  const [equilibriumPrice, setEquilibriumPrice] = useState(0);
  const [equilibriumQuantity, setEquilibriumQuantity] = useState(0);
  const [consumerSurplus, setConsumerSurplus] = useState(0);
  const [producerSurplus, setProducerSurplus] = useState(0);
  const [deadweightLoss, setDeadweightLoss] = useState(0);
  
  // State for simulation
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [marketType, setMarketType] = useState('perfect-competition');
  
  // Calculate market equilibrium
  useEffect(() => {
    // Calculate basic equilibrium (without interventions)
    const baseEqPrice = (demandIntercept - supplyIntercept) / (supplySlope + demandSlope);
    const baseEqQuantity = demandIntercept - demandSlope * baseEqPrice;
    
    // Apply market interventions
    let finalPrice = baseEqPrice;
    let finalQuantity = baseEqQuantity;
    
    // Apply tax
    if (taxPerUnit > 0) {
      const taxedSupplyIntercept = supplyIntercept + taxPerUnit;
      finalPrice = (demandIntercept - taxedSupplyIntercept) / (supplySlope + demandSlope);
      finalQuantity = demandIntercept - demandSlope * finalPrice;
    }
    
    // Apply subsidy
    if (subsidy > 0) {
      const subsidizedSupplyIntercept = supplyIntercept - subsidy;
      finalPrice = (demandIntercept - subsidizedSupplyIntercept) / (supplySlope + demandSlope);
      finalQuantity = demandIntercept - demandSlope * finalPrice;
    }
    
    // Apply price floor
    if (priceFloor > finalPrice) {
      finalPrice = priceFloor;
      finalQuantity = Math.min(
        demandIntercept - demandSlope * finalPrice,
        supplyIntercept + supplySlope * finalPrice
      );
    }
    
    // Apply price ceiling
    if (priceCeiling > 0 && priceCeiling < finalPrice) {
      finalPrice = priceCeiling;
      finalQuantity = Math.min(
        demandIntercept - demandSlope * finalPrice,
        supplyIntercept + supplySlope * finalPrice
      );
    }
    
    // Calculate consumer and producer surplus
    const maxWillingnessToPay = demandIntercept / demandSlope;
    const minWillingnessToAccept = supplyIntercept;
    
    const baseCsurplus = 0.5 * (maxWillingnessToPay - baseEqPrice) * baseEqQuantity;
    const basePsurplus = 0.5 * (baseEqPrice - minWillingnessToAccept) * baseEqQuantity;
    
    const newCsurplus = 0.5 * (maxWillingnessToPay - finalPrice) * finalQuantity;
    const newPsurplus = 0.5 * (finalPrice - minWillingnessToAccept) * finalQuantity;
    
    // Calculate deadweight loss
    const dwl = (baseCsurplus + basePsurplus) - (newCsurplus + newPsurplus);
    
    // Update state
    setEquilibriumPrice(finalPrice.toFixed(2));
    setEquilibriumQuantity(finalQuantity.toFixed(2));
    setConsumerSurplus(newCsurplus.toFixed(2));
    setProducerSurplus(newPsurplus.toFixed(2));
    setDeadweightLoss(dwl > 0 ? dwl.toFixed(2) : 0);
    
  }, [demandIntercept, demandSlope, supplyIntercept, supplySlope, taxPerUnit, subsidy, priceFloor, priceCeiling]);
  
  // Generate data points for the supply and demand curves
  const generateCurveData = () => {
    const data = [];
    const maxQuantity = demandIntercept;
    
    for (let q = 0; q <= maxQuantity; q += 5) {
      // Demand curve: P = (demandIntercept - q) / demandSlope
      const demandPrice = (demandIntercept - q) / demandSlope;
      
      // Supply curve: P = (q - supplyIntercept) / supplySlope
      const supplyPrice = (q - supplyIntercept) / supplySlope;
      
      if (demandPrice >= 0 && supplyPrice >= 0) {
        data.push({
          quantity: q,
          demandPrice: demandPrice.toFixed(2),
          supplyPrice: supplyPrice.toFixed(2)
        });
      }
    }
    
    return data;
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setDemandIntercept(100);
    setDemandSlope(1.5);
    setSupplyIntercept(20);
    setSupplySlope(1.0);
    setTaxPerUnit(0);
    setSubsidy(0);
    setPriceFloor(0);
    setPriceCeiling(0);
    setIsRunning(false);
    setCurrentStep(0);
  };
  
  // Run simulation
  const runSimulation = () => {
    setIsRunning(!isRunning);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Market Parameters */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Market Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Market Type</Label>
                <Select value={marketType} onValueChange={setMarketType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select market type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perfect-competition">Perfect Competition</SelectItem>
                    <SelectItem value="monopoly">Monopoly</SelectItem>
                    <SelectItem value="oligopoly">Oligopoly</SelectItem>
                    <SelectItem value="monopolistic-competition">Monopolistic Competition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Demand Intercept: {demandIntercept}</Label>
                <Slider 
                  value={[demandIntercept]} 
                  min={50} 
                  max={200} 
                  step={5}
                  onValueChange={(value) => setDemandIntercept(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Demand Slope: {demandSlope}</Label>
                <Slider 
                  value={[demandSlope]} 
                  min={0.5} 
                  max={3} 
                  step={0.1}
                  onValueChange={(value) => setDemandSlope(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Supply Intercept: {supplyIntercept}</Label>
                <Slider 
                  value={[supplyIntercept]} 
                  min={0} 
                  max={50} 
                  step={5}
                  onValueChange={(value) => setSupplyIntercept(value[0])}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Supply Slope: {supplySlope}</Label>
                <Slider 
                  value={[supplySlope]} 
                  min={0.5} 
                  max={3} 
                  step={0.1}
                  onValueChange={(value) => setSupplySlope(value[0])}
                />
              </div>
              
              <div className="pt-2 flex justify-center gap-2">
                <Button variant="outline" onClick={resetSimulation}>
                  Reset
                </Button>
                <Button onClick={runSimulation}>
                  {isRunning ? 'Pause' : 'Run'} Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Market Visualization */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Supply and Demand Curves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Supply and Demand Graph Visualization</p>
                  <p className="text-sm mt-2">
                    Equilibrium Price: ${equilibriumPrice} | Quantity: {equilibriumQuantity} units
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Consumer Surplus</h3>
                  <div className="bg-blue-100 dark:bg-blue-950 p-2 rounded-md">
                    <span className="font-medium">${consumerSurplus}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Producer Surplus</h3>
                  <div className="bg-green-100 dark:bg-green-950 p-2 rounded-md">
                    <span className="font-medium">${producerSurplus}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="interventions">
        <TabsList>
          <TabsTrigger value="interventions">Market Interventions</TabsTrigger>
          <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Government Interventions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tax per Unit: ${taxPerUnit}</Label>
                  <Slider 
                    value={[taxPerUnit]} 
                    min={0} 
                    max={20} 
                    step={1}
                    onValueChange={(value) => setTaxPerUnit(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Subsidy per Unit: ${subsidy}</Label>
                  <Slider 
                    value={[subsidy]} 
                    min={0} 
                    max={20} 
                    step={1}
                    onValueChange={(value) => setSubsidy(value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Price Floor: ${priceFloor}</Label>
                  <Slider 
                    value={[priceFloor]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => setPriceFloor(value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Price Ceiling: ${priceCeiling}</Label>
                  <Slider 
                    value={[priceCeiling]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => setPriceCeiling(value[0])}
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Deadweight Loss</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-red-100 dark:bg-red-950 p-2 rounded-md">
                      <span className="font-medium">${deadweightLoss}</span>
                    </div>
                    <Badge variant={deadweightLoss > 0 ? "destructive" : "outline"}>
                      {deadweightLoss > 0 ? 'Market Inefficiency' : 'Efficient Market'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Supply and Demand Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-2 text-left">Quantity</th>
                      <th className="p-2 text-left">Demand Price</th>
                      <th className="p-2 text-left">Supply Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generateCurveData().map((point, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                        <td className="p-2">{point.quantity}</td>
                        <td className="p-2">${point.demandPrice}</td>
                        <td className="p-2">${point.supplyPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Market Equilibrium</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">${equilibriumPrice}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{equilibriumQuantity} units</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Market Efficiency</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Surplus:</span>
                      <span className="font-medium">${(parseFloat(consumerSurplus) + parseFloat(producerSurplus)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Deadweight Loss:</span>
                      <span className="font-medium">${deadweightLoss}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Market Insights</h3>
                <div className="space-y-2 text-sm">
                  {taxPerUnit > 0 && (
                    <p>
                      <span className="font-medium">Tax Effect:</span> The ${taxPerUnit} per unit tax has shifted the supply curve upward, 
                      resulting in a higher equilibrium price and lower quantity. This has created a deadweight loss of ${deadweightLoss}.
                    </p>
                  )}
                  
                  {subsidy > 0 && (
                    <p>
                      <span className="font-medium">Subsidy Effect:</span> The ${subsidy} per unit subsidy has shifted the supply curve downward, 
                      resulting in a lower equilibrium price and higher quantity.
                    </p>
                  )}
                  
                  {priceFloor > 0 && priceFloor > equilibriumPrice && (
                    <p>
                      <span className="font-medium">Price Floor Effect:</span> The ${priceFloor} price floor is above the equilibrium price, 
                      creating excess supply in the market and a deadweight loss of ${deadweightLoss}.
                    </p>
                  )}
                  
                  {priceCeiling > 0 && priceCeiling < equilibriumPrice && (
                    <p>
                      <span className="font-medium">Price Ceiling Effect:</span> The ${priceCeiling} price ceiling is below the equilibrium price, 
                      creating excess demand in the market and a deadweight loss of ${deadweightLoss}.
                    </p>
                  )}
                  
                  {taxPerUnit === 0 && subsidy === 0 && 
                   (priceFloor === 0 || priceFloor <= equilibriumPrice) && 
                   (priceCeiling === 0 || priceCeiling >= equilibriumPrice) && (
                    <p>
                      <span className="font-medium">Free Market:</span> The market is currently operating without government interventions, 
                      resulting in an efficient allocation of resources with no deadweight loss.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketSimulator;
