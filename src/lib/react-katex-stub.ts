
import React from 'react';

// This is a stub for react-katex to avoid build errors
// Replace with actual react-katex imports when the library is installed

export const InlineMath: React.FC<{ math: string }> = ({ math }) => {
  return <span className="katex-inline">{math}</span>;
};

export const BlockMath: React.FC<{ math: string }> = ({ math }) => {
  return <div className="katex-block">{math}</div>;
};

export const KaTeX: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
