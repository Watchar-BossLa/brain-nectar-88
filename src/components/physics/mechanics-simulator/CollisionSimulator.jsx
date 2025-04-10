import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const CollisionSimulator = ({ isRunning }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rendererRef = useRef(null);
  const object1Ref = useRef(null);
  const object2Ref = useRef(null);
  const [collisionData, setCollisionData] = useState({
    momentumBefore: { x: 0, y: 0 },
    momentumAfter: { x: 0, y: 0 },
    energyBefore: 0,
    energyAfter: 0
  });
  
  // Initialize the physics engine
  useEffect(() => {
    // Module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    
    // Create an engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0 } // No gravity for horizontal collisions
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
        showAngleIndicator: true
      }
    });
    rendererRef.current = render;
    
    // Create walls
    const wallTop = Bodies.rectangle(400, 0, 800, 20, { isStatic: true, render: { fillStyle: '#94a3b8' } });
    const wallBottom = Bodies.rectangle(400, 400, 800, 20, { isStatic: true, render: { fillStyle: '#94a3b8' } });
    const wallLeft = Bodies.rectangle(0, 200, 20, 400, { isStatic: true, render: { fillStyle: '#94a3b8' } });
    const wallRight = Bodies.rectangle(800, 200, 20, 400, { isStatic: true, render: { fillStyle: '#94a3b8' } });
    
    // Create two objects for collision
    const object1 = Bodies.circle(200, 200, 30, {
      restitution: 1, // Elastic collision
      friction: 0,
      frictionAir: 0,
      mass: 5,
      render: {
        fillStyle: '#3b82f6'
      }
    });
    object1Ref.current = object1;
    
    const object2 = Bodies.circle(600, 200, 30, {
      restitution: 1, // Elastic collision
      friction: 0,
      frictionAir: 0,
      mass: 5,
      render: {
        fillStyle: '#ef4444'
      }
    });
    object2Ref.current = object2;
    
    // Add all bodies to the world
    World.add(engine.world, [wallTop, wallBottom, wallLeft, wallRight, object1, object2]);
    
    // Run the renderer
    Render.run(render);
    
    // Set initial velocities
    Matter.Body.setVelocity(object1, { x: 5, y: 0 });
    Matter.Body.setVelocity(object2, { x: -5, y: 0 });
    
    // Calculate initial momentum and energy
    calculatePhysics();
    
    // Add collision detection
    Matter.Events.on(engine, 'collisionStart', (event) => {
      // Calculate physics after collision
      setTimeout(calculatePhysics, 100);
    });
    
    return () => {
      // Clean up
      Matter.Events.off(engine, 'collisionStart');
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
        
        if (isRunning) {
          requestAnimationFrame(runner);
        }
      };
      
      requestAnimationFrame(runner);
    }
  }, [isRunning]);
  
  // Reset the simulation
  useEffect(() => {
    if (!isRunning && engineRef.current && object1Ref.current && object2Ref.current) {
      // Reset positions
      Matter.Body.setPosition(object1Ref.current, { x: 200, y: 200 });
      Matter.Body.setPosition(object2Ref.current, { x: 600, y: 200 });
      
      // Reset velocities
      Matter.Body.setVelocity(object1Ref.current, { x: 5, y: 0 });
      Matter.Body.setVelocity(object2Ref.current, { x: -5, y: 0 });
      
      // Reset collision data
      calculatePhysics();
    }
  }, [isRunning]);
  
  // Calculate momentum and energy
  const calculatePhysics = () => {
    if (!object1Ref.current || !object2Ref.current) return;
    
    const obj1 = object1Ref.current;
    const obj2 = object2Ref.current;
    
    // Calculate momentum (p = mv)
    const momentum1 = {
      x: obj1.mass * obj1.velocity.x,
      y: obj1.mass * obj1.velocity.y
    };
    
    const momentum2 = {
      x: obj2.mass * obj2.velocity.x,
      y: obj2.mass * obj2.velocity.y
    };
    
    const totalMomentum = {
      x: momentum1.x + momentum2.x,
      y: momentum1.y + momentum2.y
    };
    
    // Calculate kinetic energy (KE = 0.5 * m * v^2)
    const energy1 = 0.5 * obj1.mass * (obj1.velocity.x ** 2 + obj1.velocity.y ** 2);
    const energy2 = 0.5 * obj2.mass * (obj2.velocity.x ** 2 + obj2.velocity.y ** 2);
    const totalEnergy = energy1 + energy2;
    
    setCollisionData(prev => ({
      ...prev,
      momentumAfter: totalMomentum,
      energyAfter: totalEnergy
    }));
  };
  
  return (
    <div className="relative w-full">
      <div className="w-full h-[400px]" ref={canvasRef} id="simulation-canvas"></div>
      
      {/* Physics data overlay */}
      <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-md text-xs">
        <div>Total Momentum: {Math.round(Math.sqrt(collisionData.momentumAfter.x**2 + collisionData.momentumAfter.y**2) * 100) / 100} kg·m/s</div>
        <div>Total Energy: {Math.round(collisionData.energyAfter * 100) / 100} J</div>
      </div>
    </div>
  );
};

export default CollisionSimulator;
