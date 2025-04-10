import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MechanicsSimulator from '../MechanicsSimulator';

// Mock the child components
jest.mock('../ProjectileMotion', () => {
  return function MockProjectileMotion({ isRunning }) {
    return <div data-testid="projectile-motion">Projectile Motion (isRunning: {isRunning.toString()})</div>;
  };
});

jest.mock('../CollisionSimulator', () => {
  return function MockCollisionSimulator({ isRunning }) {
    return <div data-testid="collision-simulator">Collision Simulator (isRunning: {isRunning.toString()})</div>;
  };
});

jest.mock('../HarmonicMotion', () => {
  return function MockHarmonicMotion({ isRunning }) {
    return <div data-testid="harmonic-motion">Harmonic Motion (isRunning: {isRunning.toString()})</div>;
  };
});

describe('MechanicsSimulator Component', () => {
  test('renders the component', () => {
    render(<MechanicsSimulator />);
    
    // Check if the title is rendered
    expect(screen.getByText('Interactive Mechanics Simulator')).toBeInTheDocument();
    
    // Check if the description is rendered
    expect(screen.getByText('Visualize and experiment with mechanics concepts')).toBeInTheDocument();
    
    // Check if the tabs are rendered
    expect(screen.getByText('Projectile Motion')).toBeInTheDocument();
    expect(screen.getByText('Collisions')).toBeInTheDocument();
    expect(screen.getByText('Harmonic Motion')).toBeInTheDocument();
  });
  
  test('shows projectile motion simulation by default', () => {
    render(<MechanicsSimulator />);
    
    // Check if the projectile motion simulation is rendered
    expect(screen.getByTestId('projectile-motion')).toBeInTheDocument();
    
    // Check that other simulations are not rendered
    expect(screen.queryByTestId('collision-simulator')).not.toBeInTheDocument();
    expect(screen.queryByTestId('harmonic-motion')).not.toBeInTheDocument();
  });
  
  test('switches between simulations when tabs are clicked', () => {
    render(<MechanicsSimulator />);
    
    // Initially, projectile motion should be visible
    expect(screen.getByTestId('projectile-motion')).toBeInTheDocument();
    
    // Click on the Collisions tab
    fireEvent.click(screen.getByText('Collisions'));
    
    // Now collision simulator should be visible and others hidden
    expect(screen.queryByTestId('projectile-motion')).not.toBeInTheDocument();
    expect(screen.getByTestId('collision-simulator')).toBeInTheDocument();
    expect(screen.queryByTestId('harmonic-motion')).not.toBeInTheDocument();
    
    // Click on the Harmonic Motion tab
    fireEvent.click(screen.getByText('Harmonic Motion'));
    
    // Now harmonic motion should be visible and others hidden
    expect(screen.queryByTestId('projectile-motion')).not.toBeInTheDocument();
    expect(screen.queryByTestId('collision-simulator')).not.toBeInTheDocument();
    expect(screen.getByTestId('harmonic-motion')).toBeInTheDocument();
  });
  
  test('toggles simulation running state when play/pause button is clicked', () => {
    render(<MechanicsSimulator />);
    
    // Initially, simulation should not be running
    expect(screen.getByTestId('projectile-motion')).toHaveTextContent('isRunning: false');
    
    // Find and click the play button
    const playButton = screen.getByTitle('Play');
    fireEvent.click(playButton);
    
    // Now simulation should be running
    expect(screen.getByTestId('projectile-motion')).toHaveTextContent('isRunning: true');
    
    // The button should now be a pause button
    const pauseButton = screen.getByTitle('Pause');
    fireEvent.click(pauseButton);
    
    // Simulation should be paused again
    expect(screen.getByTestId('projectile-motion')).toHaveTextContent('isRunning: false');
  });
  
  test('toggles settings visibility when settings button is clicked', () => {
    render(<MechanicsSimulator />);
    
    // Initially, settings should be visible
    expect(screen.getByText('Simulation Settings')).toBeInTheDocument();
    
    // Find and click the settings button
    const settingsButton = screen.getByTitle('Hide Settings');
    fireEvent.click(settingsButton);
    
    // Settings should now be hidden
    expect(screen.queryByText('Simulation Settings')).not.toBeInTheDocument();
    
    // Click the settings button again
    const showSettingsButton = screen.getByTitle('Show Settings');
    fireEvent.click(showSettingsButton);
    
    // Settings should be visible again
    expect(screen.getByText('Simulation Settings')).toBeInTheDocument();
  });
});
