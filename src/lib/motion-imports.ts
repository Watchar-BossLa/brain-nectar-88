
// Stub for framer-motion
// This allows us to use motion components without actually importing framer-motion
// which is helpful for development and testing without the full library

import React from 'react';

// Basic component types
export const motion = {
  div: 'div',
  span: 'span',
  button: 'button',
  a: 'a',
  ul: 'ul',
  li: 'li',
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  img: 'img',
  svg: 'svg',
  path: 'path',
  circle: 'circle',
  rect: 'rect'
};

// Basic animation utility
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return React.createElement(React.Fragment, null, children);
};

// Animation hooks
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
  set: () => {}
});

export const useMotionValue = (initialValue: number) => ({
  get: () => initialValue,
  set: () => {},
  onChange: (callback: (value: number) => void): (() => void) => {
    return () => {};
  }
});

export const useTransform = (
  value: any,
  inputRange: number[],
  outputRange: number[]
) => outputRange[0];
