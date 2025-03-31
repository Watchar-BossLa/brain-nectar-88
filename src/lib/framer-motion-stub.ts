
import React from 'react';

// This is a stub for framer-motion to avoid build errors
// Replace with actual framer-motion imports when the library is installed

export const motion = {
  div: (props: any) => React.createElement('div', props, props.children),
  h1: (props: any) => React.createElement('h1', props, props.children),
  h2: (props: any) => React.createElement('h2', props, props.children),
  p: (props: any) => React.createElement('p', props, props.children),
  span: (props: any) => React.createElement('span', props, props.children),
  button: (props: any) => React.createElement('button', props, props.children),
  ul: (props: any) => React.createElement('ul', props, props.children),
  li: (props: any) => React.createElement('li', props, props.children),
  section: (props: any) => React.createElement('section', props, props.children),
  img: (props: any) => React.createElement('img', props, null),
  a: (props: any) => React.createElement('a', props, props.children),
  nav: (props: any) => React.createElement('nav', props, props.children),
  header: (props: any) => React.createElement('header', props, props.children),
  footer: (props: any) => React.createElement('footer', props, props.children),
  main: (props: any) => React.createElement('main', props, props.children),
  aside: (props: any) => React.createElement('aside', props, props.children),
  article: (props: any) => React.createElement('article', props, props.children),
  form: (props: any) => React.createElement('form', props, props.children),
  input: (props: any) => React.createElement('input', props, null),
  textarea: (props: any) => React.createElement('textarea', props, props.children),
  select: (props: any) => React.createElement('select', props, props.children),
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
