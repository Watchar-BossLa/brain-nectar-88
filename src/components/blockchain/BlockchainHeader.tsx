
import React from 'react';
import { motion } from 'framer-motion';
import { WalletConnect } from './WalletConnect';

export const BlockchainHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <motion.h1 
        className="text-3xl font-bold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blockchain Features
      </motion.h1>
      <WalletConnect />
    </div>
  );
};
