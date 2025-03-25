
import React from 'react';
import { motion } from 'framer-motion';

const QualificationsHeader: React.FC = () => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-semibold">Qualification Tracks</h1>
      <p className="text-muted-foreground mt-1">
        Professional accounting and finance certifications to advance your career.
      </p>
    </motion.div>
  );
};

export default QualificationsHeader;
