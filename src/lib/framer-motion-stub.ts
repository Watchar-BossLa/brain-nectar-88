
// This is a stub for framer-motion to avoid build errors
// Replace with actual framer-motion imports when the library is installed

export const motion = {
  div: (props: any) => <div {...props}>{props.children}</div>,
  h1: (props: any) => <h1 {...props}>{props.children}</h1>,
  h2: (props: any) => <h2 {...props}>{props.children}</h2>,
  p: (props: any) => <p {...props}>{props.children}</p>,
  span: (props: any) => <span {...props}>{props.children}</span>,
  button: (props: any) => <button {...props}>{props.children}</button>,
  ul: (props: any) => <ul {...props}>{props.children}</ul>,
  li: (props: any) => <li {...props}>{props.children}</li>,
  section: (props: any) => <section {...props}>{props.children}</section>,
  img: (props: any) => <img {...props} />,
  a: (props: any) => <a {...props}>{props.children}</a>,
  nav: (props: any) => <nav {...props}>{props.children}</nav>,
  header: (props: any) => <header {...props}>{props.children}</header>,
  footer: (props: any) => <footer {...props}>{props.children}</footer>,
  main: (props: any) => <main {...props}>{props.children}</main>,
  aside: (props: any) => <aside {...props}>{props.children}</aside>,
  article: (props: any) => <article {...props}>{props.children}</article>,
  form: (props: any) => <form {...props}>{props.children}</form>,
  input: (props: any) => <input {...props} />,
  textarea: (props: any) => <textarea {...props}>{props.children}</textarea>,
  select: (props: any) => <select {...props}>{props.children}</select>,
};

// Animation helpers
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
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
