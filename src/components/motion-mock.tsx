
import React from 'react';

// This is a simplified mock for framer-motion components to prevent TypeScript errors
// while we set up the proper dependencies

interface MotionProps {
  children?: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  whileHover?: any;
  whileTap?: any;
  style?: React.CSSProperties;
  [key: string]: any;
}

// Basic mock for motion.div, motion.section, etc.
const createMotionComponent = (Component: string | React.ComponentType<any>) => {
  return React.forwardRef<HTMLElement, MotionProps>(
    ({ children, className, style, ...props }, ref) => {
      const Comp = typeof Component === 'string' ? Component : Component;
      return (
        <Comp ref={ref} className={className} style={style}>
          {children}
        </Comp>
      );
    }
  );
};

// Create motion object with common HTML elements
export const motion = {
  div: createMotionComponent('div'),
  section: createMotionComponent('section'),
  button: createMotionComponent('button'),
  span: createMotionComponent('span'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
  a: createMotionComponent('a'),
  header: createMotionComponent('header'),
  nav: createMotionComponent('nav'),
  main: createMotionComponent('main'),
  footer: createMotionComponent('footer'),
  form: createMotionComponent('form'),
  input: createMotionComponent('input'),
  textarea: createMotionComponent('textarea'),
  p: createMotionComponent('p'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
};

// Mock AnimatePresence
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Export common hooks and utilities
export const useAnimation = () => ({
  start: async () => {},
  stop: () => {},
});

export const useScroll = () => ({
  scrollYProgress: { current: 0 },
});

export const useCycle = <T extends any>(initial: T, ...items: T[]) => {
  const [current, setCurrent] = React.useState(initial);
  const cycle = () => {
    const currentIndex = [initial, ...items].indexOf(current);
    const nextIndex = (currentIndex + 1) % (items.length + 1);
    setCurrent([initial, ...items][nextIndex]);
  };
  return [current, cycle] as const;
};
