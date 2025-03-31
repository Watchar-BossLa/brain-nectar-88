
import React from 'react';

// Create stub components to mimic Framer Motion functionality
// This allows the app to compile without framer-motion dependency

type MotionComponentProps = {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  whileHover?: any;
  whileTap?: any;
  whileFocus?: any;
  whileDrag?: any;
  whileInView?: any;
  viewport?: any;
  drag?: boolean | 'x' | 'y';
  dragConstraints?: any;
  onAnimationComplete?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
};

// Create a factory function for motion components
const createMotionComponent = (Component: any) => 
  React.forwardRef<HTMLElement, MotionComponentProps>(
    ({ children, ...props }, ref) => (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    )
  );

// Create the motion object with all HTML elements
export const motion = {
  div: createMotionComponent('div'),
  span: createMotionComponent('span'),
  button: createMotionComponent('button'),
  a: createMotionComponent('a'),
  ul: createMotionComponent('ul'),
  li: createMotionComponent('li'),
  p: createMotionComponent('p'),
  h1: createMotionComponent('h1'),
  h2: createMotionComponent('h2'),
  h3: createMotionComponent('h3'),
  h4: createMotionComponent('h4'),
  h5: createMotionComponent('h5'),
  h6: createMotionComponent('h6'),
  article: createMotionComponent('article'),
  section: createMotionComponent('section'),
  nav: createMotionComponent('nav'),
  aside: createMotionComponent('aside'),
  header: createMotionComponent('header'),
  footer: createMotionComponent('footer'),
  main: createMotionComponent('main'),
  form: createMotionComponent('form'),
  input: createMotionComponent('input'),
  textarea: createMotionComponent('textarea'),
  select: createMotionComponent('select'),
  option: createMotionComponent('option'),
  svg: createMotionComponent('svg'),
  path: createMotionComponent('path'),
  circle: createMotionComponent('circle'),
  rect: createMotionComponent('rect'),
  img: createMotionComponent('img'),
  video: createMotionComponent('video'),
  iframe: createMotionComponent('iframe')
};

// AnimatePresence component stub
export const AnimatePresence: React.FC<{
  children?: React.ReactNode;
  mode?: 'sync' | 'wait' | 'popLayout';
  initial?: boolean;
  onExitComplete?: () => void;
}> = ({ children }) => {
  return <>{children}</>;
};

// Hooks stubs
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  set: () => {},
});

export const useMotionValue = (initial: number) => ({
  get: () => initial,
  set: () => {},
  onChange: () => () => {},
});

export const useTransform = () => 0;
export const useScroll = () => ({
  scrollY: { get: () => 0, onChange: () => () => {} },
  scrollYProgress: { get: () => 0, onChange: () => () => {} },
});
export const useSpring = () => 0;
export const useInView = () => false;
export const useDragControls = () => ({});
export const useVelocity = () => 0;
