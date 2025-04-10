import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const HarmonicMotion = ({ isRunning }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rendererRef = useRef(null);
  const massRef = useRef(null);
  const anchorRef = useRef(null);
  const constraintRef = useRef(null);
  const [oscillationData, setOscillationData] = useState({
    amplitude: 0,
    period: 0,
    frequency: 0,
    phase: 0
  });
  
  // Initialize the physics engine
  useEffect(() => {
    // Module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Constraint = Matter.Constraint;
    
    // Create an engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0.5 } // Reduced gravity for better visualization
    });
    engineRef.current = engine;
    
    // Create a renderer
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 400,
        wireframes: false,
        background: '#f9fafb',
        showAngleIndicator: false
      }
    });
    rendererRef.current = render;
    
    // Create an anchor point
    const anchor = Bodies.rectangle(400, 100, 20, 20, { 
      isStatic: true,
      render: {
        fillStyle: '#94a3b8'
      }
    });
    anchorRef.current = anchor;
    
    // Create a mass
    const mass = Bodies.circle(400, 300, 30, {
      restitution: 0.8,
      friction: 0.005,
      frictionAir: 0.01,
      render: {
        fillStyle: '#3b82f6'
      }
    });
    massRef.current = mass;
    
    // Create a constraint (spring)
    const constraint = Constraint.create({
      bodyA: anchor,
      bodyB: mass,
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: 0 },
      stiffness: 0.01,
      damping: 0.1,
      length: 200,
      render: {
        type: 'line',
        anchors: false,
        lineWidth: 2,
        strokeStyle: '#64748b'
      }
    });
    constraintRef.current = constraint;
    
    // Add all bodies to the world
    World.add(engine.world, [anchor, mass, constraint]);
    
    // Run the renderer
    Render.run(render);
    
    // Start the oscillation
    startOscillation();
    
    return () => {
      // Clean up
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, []);
  
  // Handle running/paused state
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    
    if (isRunning) {
      // Create a custom runner
      const runner = () => {
        Matter.Engine.update(engine, 1000 / 60);
        
        // Update oscillation data
        if (massRef.current) {
          updateOscillationData();
        }
        
        if (isRunning) {
          requestAnimationFrame(runner);
        }
      };
      
      requestAnimationFrame(runner);
    }
  }, [isRunning]);
  
  // Function to start the oscillation
  const startOscillation = () => {
    if (!massRef.current) return;
    
    // Reset position
    Matter.Body.setPosition(massRef.current, { x: 500, y: 300 });
    
    // Apply an initial displacement
    Matter.Body.setVelocity(massRef.current, { x: 0, y: 0 });
  };
  
  // Reset the simulation
  useEffect(() => {
    if (!isRunning && engineRef.current && massRef.current) {
      // Reset the mass position
      Matter.Body.setPosition(massRef.current, { x: 500, y: 300 });
      Matter.Body.setVelocity(massRef.current, { x: 0, y: 0 });
    }
  }, [isRunning]);
  
  // Update oscillation data
  const updateOscillationData = () => {
    if (!massRef.current || !anchorRef.current) return;
    
    const mass = massRef.current;
    const anchor = anchorRef.current;
    
    // Calculate displacement from equilibrium
    const dx = mass.position.x - anchor.position.x;
    const dy = mass.position.y - anchor.position.y;
    const displacement = Math.sqrt(dx*dx + dy*dy) - constraintRef.current.length;
    
    // Calculate amplitude (maximum displacement)
    const amplitude = Math.max(Math.abs(displacement), oscillationData.amplitude);
    
    // Calculate period and frequency (approximation)
    // T = 2π√(m/k) where m is mass and k is spring constant
    const springConstant = constraintRef.current.stiffness * 1000; // Scale for visualization
    const period = 2 * Math.PI * Math.sqrt(mass.mass / springConstant);
    const frequency = 1 / period;
    
    setOscillationData({
      amplitude: amplitude,
      period: period,
      frequency: frequency,
      phase: 0 // Simplified
    });
  };
  
  // Draw the equilibrium position
  useEffect(() => {
    const render = rendererRef.current;
    if (!render) return;
    
    // Add afterRender callback to draw equilibrium position
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      
      if (anchorRef.current) {
        const anchor = anchorRef.current;
        
        // Draw equilibrium position
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        
        const equilibriumX = anchor.position.x;
        const equilibriumY = anchor.position.y + constraintRef.current.length;
        
        ctx.moveTo(equilibriumX - 50, equilibriumY);
        ctx.lineTo(equilibriumX + 50, equilibriumY);
        
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
    
    return () => {
      Matter.Events.off(render, 'afterRender');
    };
  }, []);
  
  return (
    <div className="relative w-full">
      <div className="w-full h-[400px]" ref={canvasRef} id="simulation-canvas"></div>
      
      {/* Oscillation data overlay */}
      <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-md text-xs">
        <div>Amplitude: {Math.round(oscillationData.amplitude * 100) / 100} m</div>
        <div>Period: {Math.round(oscillationData.period * 1000) / 1000} s</div>
        <div>Frequency: {Math.round(oscillationData.frequency * 1000) / 1000} Hz</div>
      </div>
    </div>
  );
};

export default HarmonicMotion;
