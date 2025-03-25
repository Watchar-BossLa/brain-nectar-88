
import React from 'react';
import { motion } from 'framer-motion';
import { QualificationType } from '../types';
import QualificationHeader from './QualificationHeader';
import QualificationProgress from './QualificationProgress';
import QualificationMetadata from './QualificationMetadata';
import QualificationStructureAccordion from './QualificationStructureAccordion';
import { useQualificationModules } from '../hooks/useQualificationModules';

interface QualificationCardProps {
  qualification: QualificationType;
  getStatusBadge: (status: string) => React.ReactNode;
}

const QualificationCard: React.FC<QualificationCardProps> = ({ 
  qualification, 
  getStatusBadge
}) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const modulesData = useQualificationModules(qualification.id);

  return (
    <motion.div 
      variants={item}
      className="border border-border rounded-lg overflow-hidden"
    >
      <div className={`${qualification.color} h-2`}></div>
      <div className="p-6">
        <QualificationHeader qualification={qualification} />
        <QualificationProgress qualification={qualification} />
        <QualificationMetadata qualification={qualification} />
        
        {modulesData && (
          <QualificationStructureAccordion
            qualificationId={qualification.id}
            modules={modulesData.modules}
            getStatusBadge={getStatusBadge}
            accordionName={modulesData.accordionName}
            websiteName={modulesData.websiteName}
          />
        )}
      </div>
    </motion.div>
  );
};

export default QualificationCard;
