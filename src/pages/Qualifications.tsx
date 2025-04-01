
import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { 
  QualificationsHeader,
  QualificationCard,
  PersonalizedRecommendation,
  getStatusBadge,
  qualifications
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
            <div key={qualification.id}>
              <QualificationCard 
                qualification={qualification}
                getStatusBadge={getStatusBadge}
              />
            </div>
          ))}
        </motion.div>
        
        <PersonalizedRecommendation />
      </div>
    </MainLayout>
  );
};

export default Qualifications;
