
import React from 'react';

// Stub for react-katex components
export const InlineMath: React.FC<{ math: string }> = ({ math }) => (
  <span className="katex-inline">{math}</span>
);

export const BlockMath: React.FC<{ math: string }> = ({ math }) => (
  <div className="katex-block">{math}</div>
);

export const KaTeX: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);
