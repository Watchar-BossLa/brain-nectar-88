
import React from 'react';

// Simple mock for react-katex components while we wait for the dependency to install

interface LatexProps {
  math: string;
  block?: boolean;
  errorColor?: string;
  renderError?: (error: Error) => React.ReactNode;
  settings?: any;
  as?: keyof JSX.IntrinsicElements;
}

export const InlineMath: React.FC<{ math: string }> = ({ math }) => {
  return <span className="latex-inline">{math}</span>;
};

export const BlockMath: React.FC<{ math: string }> = ({ math }) => {
  return <div className="latex-block">{math}</div>;
};

export const renderLatexContent = (content: string, isBlock: boolean = false) => {
  return isBlock ? <BlockMath math={content} /> : <InlineMath math={content} />;
};
