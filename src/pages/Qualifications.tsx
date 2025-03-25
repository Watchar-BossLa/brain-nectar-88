
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { 
  QualificationsHeader,
  QualificationCard,
  PersonalizedRecommendation,
  getStatusBadge,
  qualifications,
  accaModules,
  cpaModules,
  cfaModules,
  frmModules,
  cimaModules,
  cmaModules,
  cfpModules,
  caiaModules
} from '@/components/qualifications';

const Qualifications = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <QualificationsHeader />

        <motion.div 
          className="space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {qualifications.map((qualification) => (
            <QualificationCard 
              key={qualification.id} 
              qualification={qualification}
              getStatusBadge={getStatusBadge}
              accaModules={accaModules}
              cpaModules={cpaModules}
              cfaModules={cfaModules}
              frmModules={frmModules}
              cimaModules={cimaModules}
              cmaModules={cmaModules}
              cfpModules={cfpModules}
              caiaModules={caiaModules}
            />
          ))}
        </motion.div>
        
        <PersonalizedRecommendation />
      </div>
    </MainLayout>
  );
};

export default Qualifications;
