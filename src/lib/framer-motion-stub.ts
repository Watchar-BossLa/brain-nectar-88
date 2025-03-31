/**
 * This file provides stub implementations of framer-motion functions
 * to avoid errors in components that use it when the library is not installed.
 */

// Animation component stub
export const motion = new Proxy({}, {
  get: (_, prop) => {
    return new Proxy(() => ({}), {
      get: () => () => ({}),
    });
  }
});

// AnimatePresence stub
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return children;
};

// useAnimation stub
export const useAnimation = () => {
  return {
    start: () => Promise.resolve(),
    stop: () => {},
    set: () => {}
  };
};

// useMotionValue stub
export const useMotionValue = (initial: any) => {
  return { get: () => initial, set: () => {}, onChange: () => () => {} };
};

// useScroll stub
export const useScroll = () => {
  return {
    scrollX: { get: () => 0, set: () => {}, onChange: () => () => {} },
    scrollY: { get: () => 0, set: () => {}, onChange: () => () => {} },
    scrollXProgress: { get: () => 0, set: () => {}, onChange: () => () => {} },
    scrollYProgress: { get: () => 0, set: () => {}, onChange: () => () => {} }
  };
};

// useSpring stub
export const useSpring = (initial: any) => {
  return { get: () => initial, set: () => {}, onChange: () => () => {} };
};

// useTransform stub
export const useTransform = () => {
  return { get: () => 0, set: () => {}, onChange: () => () => {} };
};

// Other exports
export const animate = () => Promise.resolve();
export const animatePresence = () => ({});
export const m = motion;
export const useInView = () => [() => {}, false];
export const usePresence = () => [false, () => {}];
export const useReducedMotion = () => false;
export const useCycle = (...args: any[]) => [args[0], () => {}];
export const useViewportScroll = useScroll;
