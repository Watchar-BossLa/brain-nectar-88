
import React from 'react';

// Stub for react-katex components
export const InlineMath = ({ math }: { math: string }) => (
  <span className="katex-inline">{math}</span>
);

export const BlockMath = ({ math }: { math: string }) => (
  <div className="katex-block">{math}</div>
);
