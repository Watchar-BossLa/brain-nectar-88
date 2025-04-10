import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const ProjectileMotion = ({ isRunning }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const rendererRef = useRef(null);
  const projectileRef = useRef(null);
  const timeoutRef = useRef(null);
  const [trajectory, setTrajectory] = useState([]);
  
  // Initialize the physics engine
  useEffect(() => {
    // Module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    
    // Create an engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 } // Reduced gravity for better visualization
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
    
    // Create a ground
    const ground = Bodies.rectangle(400, 390, 810, 20, { 
      isStatic: true,
      render: {
        fillStyle: '#94a3b8'
      }
    });
    
    // Create a projectile
    const projectile = Bodies.circle(50, 350, 10, {
      restitution: 0.8,
      friction: 0.005,
      render: {
        fillStyle: '#3b82f6'
      }
    });
    projectileRef.current = projectile;
    
    // Add all bodies to the world
    World.add(engine.world, [ground, projectile]);
    
    // Run the renderer
    Render.run(render);
    
    // Launch the projectile
    launchProjectile();
    
    return () => {
      // Clean up
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
        
        // Track trajectory
        if (projectileRef.current) {
          const pos = projectileRef.current.position;
          setTrajectory(prev => [...prev, { x: pos.x, y: pos.y }]);
        }
        
        if (isRunning) {
          requestAnimationFrame(runner);
        }
      };
      
      requestAnimationFrame(runner);
    }
  }, [isRunning]);
  
  // Function to launch the projectile
  const launchProjectile = () => {
    if (!projectileRef.current) return;
    
    // Reset position
    Matter.Body.setPosition(projectileRef.current, { x: 50, y: 350 });
    
    // Clear trajectory
    setTrajectory([]);
    
    // Apply an impulse to launch the projectile
    Matter.Body.applyForce(
      projectileRef.current,
      { x: projectileRef.current.position.x, y: projectileRef.current.position.y },
      { x: 0.05, y: -0.1 }
    );
  };
  
  // Reset the simulation
  useEffect(() => {
    if (!isRunning && engineRef.current && projectileRef.current) {
      // Reset the projectile position
      Matter.Body.setPosition(projectileRef.current, { x: 50, y: 350 });
      Matter.Body.setVelocity(projectileRef.current, { x: 0, y: 0 });
      
      // Clear trajectory
      setTrajectory([]);
    }
  }, [isRunning]);
  
  // Draw the trajectory
  useEffect(() => {
    const render = rendererRef.current;
    if (!render) return;
    
    // Add afterRender callback to draw trajectory
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 2;
      
      trajectory.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
    });
    
    return () => {
      Matter.Events.off(render, 'afterRender');
    };
  }, [trajectory]);
  
  return (
    <div className="w-full h-[400px]" ref={canvasRef} id="simulation-canvas"></div>
  );
};

export default ProjectileMotion;
