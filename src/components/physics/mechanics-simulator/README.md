# Interactive Mechanics Simulator

The Interactive Mechanics Simulator is a component that allows users to visualize and experiment with various mechanics concepts. It provides simulations for projectile motion, collisions, and simple harmonic motion.

## Features

- **Projectile Motion**: Visualize the trajectory of objects under the influence of gravity
- **Collision Simulator**: Observe momentum and energy conservation in elastic and inelastic collisions
- **Harmonic Motion**: Explore oscillatory motion with springs and pendulums
- **Interactive Controls**: Adjust parameters in real-time to see their effects
- **Physics Data**: View relevant physics data like momentum, energy, and oscillation characteristics

## Components

The Interactive Mechanics Simulator consists of four main components:

1. **MechanicsSimulator**: The main component that integrates all simulations
2. **ProjectileMotion**: Simulation of projectile motion
3. **CollisionSimulator**: Simulation of collisions between objects
4. **HarmonicMotion**: Simulation of simple harmonic motion

## Usage

```jsx
import MechanicsSimulator from '@/components/physics/mechanics-simulator/MechanicsSimulator';

// In your component
const MyComponent = () => {
  return (
    <div>
      <h1>Physics Tools</h1>
      <MechanicsSimulator />
    </div>
  );
};
```

## Props

The MechanicsSimulator component does not accept any props as it manages its own state internally.

Each simulation component (ProjectileMotion, CollisionSimulator, HarmonicMotion) accepts the following prop:

- `isRunning`: A boolean indicating whether the simulation should be running or paused

## Dependencies

- **matter-js**: Used for physics simulations
- **lucide-react**: Used for icons

## Examples

### Basic Usage

```jsx
<MechanicsSimulator />
```

### Integration with Physics Page

```jsx
const [activeSimulator, setActiveSimulator] = useState(null);

const openSimulator = (simulator) => {
  setActiveSimulator(simulator);
};

const closeSimulator = () => {
  setActiveSimulator(null);
};

// In your render function
{activeSimulator === 'mechanics' && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Interactive Mechanics Simulator</h2>
          <Button variant="ghost" onClick={closeSimulator}>
            ✕
          </Button>
        </div>
        <MechanicsSimulator />
      </div>
    </div>
  </div>
)}
```

## Physics Concepts

### Projectile Motion

Projectile motion is the motion of an object thrown or projected into the air, subject only to the acceleration of gravity. The simulator demonstrates:

- Parabolic trajectory
- Effects of launch angle and initial velocity
- Influence of gravity and air resistance

### Collisions

The collision simulator demonstrates the principles of momentum and energy conservation. It shows:

- Elastic collisions (where kinetic energy is conserved)
- Inelastic collisions (where kinetic energy is not conserved)
- Momentum conservation in all types of collisions

### Simple Harmonic Motion

Simple harmonic motion is a type of periodic motion where the restoring force is directly proportional to the displacement. The simulator demonstrates:

- Spring-mass systems
- Pendulum motion
- Concepts of amplitude, period, and frequency
- Effects of damping on oscillations
