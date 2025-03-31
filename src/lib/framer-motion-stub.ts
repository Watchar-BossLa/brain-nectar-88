
import React from 'react';

// This is a stub for framer-motion to avoid build errors
// Replace with actual framer-motion imports when the library is installed

export const motion = {
  div: React.forwardRef((props: any, ref) => React.createElement('div', { ...props, ref }, props.children)),
  h1: React.forwardRef((props: any, ref) => React.createElement('h1', { ...props, ref }, props.children)),
  h2: React.forwardRef((props: any, ref) => React.createElement('h2', { ...props, ref }, props.children)),
  p: React.forwardRef((props: any, ref) => React.createElement('p', { ...props, ref }, props.children)),
  span: React.forwardRef((props: any, ref) => React.createElement('span', { ...props, ref }, props.children)),
  button: React.forwardRef((props: any, ref) => React.createElement('button', { ...props, ref }, props.children)),
  ul: React.forwardRef((props: any, ref) => React.createElement('ul', { ...props, ref }, props.children)),
  li: React.forwardRef((props: any, ref) => React.createElement('li', { ...props, ref }, props.children)),
  section: React.forwardRef((props: any, ref) => React.createElement('section', { ...props, ref }, props.children)),
  img: React.forwardRef((props: any, ref) => React.createElement('img', { ...props, ref }, null)),
  a: React.forwardRef((props: any, ref) => React.createElement('a', { ...props, ref }, props.children)),
  nav: React.forwardRef((props: any, ref) => React.createElement('nav', { ...props, ref }, props.children)),
  header: React.forwardRef((props: any, ref) => React.createElement('header', { ...props, ref }, props.children)),
  footer: React.forwardRef((props: any, ref) => React.createElement('footer', { ...props, ref }, props.children)),
  main: React.forwardRef((props: any, ref) => React.createElement('main', { ...props, ref }, props.children)),
  aside: React.forwardRef((props: any, ref) => React.createElement('aside', { ...props, ref }, props.children)),
  article: React.forwardRef((props: any, ref) => React.createElement('article', { ...props, ref }, props.children)),
  form: React.forwardRef((props: any, ref) => React.createElement('form', { ...props, ref }, props.children)),
  input: React.forwardRef((props: any, ref) => React.createElement('input', { ...props, ref }, null)),
  textarea: React.forwardRef((props: any, ref) => React.createElement('textarea', { ...props, ref }, props.children)),
  select: React.forwardRef((props: any, ref) => React.createElement('select', { ...props, ref }, props.children)),
};

// Animation helpers
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children);

export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
});

export const useMotionValue = (initial: any) => ({ get: () => initial, set: () => {} });
export const useTransform = () => 0;
export const useScroll = () => ({ scrollYProgress: { get: () => 0 } });
export const animate = () => {};
export const useInView = () => true;

// Types
export type Variants = {
  [key: string]: any;
};
