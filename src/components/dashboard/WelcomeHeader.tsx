
import React from 'react';
import { motion } from 'framer-motion';

const WelcomeHeader = () => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-semibold">Welcome back, Alex</h1>
      <p className="text-muted-foreground mt-1">
        Continue your learning journey where you left off.
      </p>
    </motion.div>
  );
};

export default WelcomeHeader;
