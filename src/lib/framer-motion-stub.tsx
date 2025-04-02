
import React from 'react';

// Basic stub for motion components
const createMotionComponent = (tag: keyof JSX.IntrinsicElements) => {
  return React.forwardRef((props: any, ref) => {
    const { initial, animate, exit, transition, ...rest } = props;
    return React.createElement(tag, { ...rest, ref });
  });
};

// Create motion components for common HTML elements
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
  header: createMotionComponent('header'),
  footer: createMotionComponent('footer'),
  section: createMotionComponent('section'),
  article: createMotionComponent('article'),
  aside: createMotionComponent('aside'),
  nav: createMotionComponent('nav'),
  main: createMotionComponent('main'),
  form: createMotionComponent('form'),
  input: createMotionComponent('input'),
  textarea: createMotionComponent('textarea'),
  select: createMotionComponent('select'),
  option: createMotionComponent('option'),
  img: createMotionComponent('img'),
  svg: createMotionComponent('svg'),
  path: createMotionComponent('path'),
  circle: createMotionComponent('circle'),
};

// Stub for AnimatePresence
export const AnimatePresence: React.FC<{ 
  children: React.ReactNode;
  initial?: boolean;
  mode?: 'sync' | 'wait' | 'popLayout';
  onExitComplete?: () => void;
}> = ({ children }) => <>{children}</>;

// Stubs for animation hooks
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
  set: () => {},
});

export const useMotionValue = (initial: number) => ({
  get: () => initial,
  set: () => {},
  onChange: () => () => {},
});

export const useTransform = <T, U>(
  value: { get: () => T },
  inputRange: T[],
  outputRange: U[]
) => ({
  get: () => outputRange[0],
  set: () => {},
});

export const useScroll = () => ({
  scrollX: { get: () => 0, set: () => {} },
  scrollY: { get: () => 0, set: () => {} },
  scrollXProgress: { get: () => 0, set: () => {} },
  scrollYProgress: { get: () => 0, set: () => {} },
});

export const useSpring = (initialValue: number) => ({
  get: () => initialValue,
  set: () => {},
});

export const useInView = (ref: React.RefObject<Element>) => false;

export const useDragControls = () => ({
  start: () => {},
});

export const useVelocity = (value: { get: () => number }) => ({
  get: () => 0,
  set: () => {},
});
