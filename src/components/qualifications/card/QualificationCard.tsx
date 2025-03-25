
import React from 'react';
import { motion } from 'framer-motion';
import { QualificationType } from '../types';
import QualificationHeader from './QualificationHeader';
import QualificationProgress from './QualificationProgress';
import QualificationMetadata from './QualificationMetadata';
import QualificationStructureAccordion from './QualificationStructureAccordion';
import { accaModules } from '../accaDetails';
import { cpaModules } from '../cpaDetails';
import { cfaModules } from '../cfaDetails';
import { frmModules } from '../frmDetails';
import { cimaModules } from '../cimaDetails';
import { cmaModules } from '../cmaDetails';
import { cfpModules } from '../cfpDetails';
import { caiaModules } from '../caiaDetails';

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

  const getAccordionData = () => {
    switch (qualification.id) {
      case 'acca':
        return {
          modules: accaModules,
          accordionName: 'ACCA Qualification Structure',
          websiteName: 'ACCA Official Website'
        };
      case 'cpa':
        return {
          modules: cpaModules,
          accordionName: 'CPA Exam Structure',
          websiteName: 'AICPA Official Website'
        };
      case 'cfa':
        return {
          modules: cfaModules,
          accordionName: 'CFA Program Structure',
          websiteName: 'CFA Institute Website'
        };
      case 'frm':
        return {
          modules: frmModules,
          accordionName: 'FRM Program Structure',
          websiteName: 'GARP Official Website'
        };
      case 'cima':
        return {
          modules: cimaModules,
          accordionName: 'CIMA Qualification Structure',
          websiteName: 'CIMA Official Website'
        };
      case 'cma':
        return {
          modules: cmaModules,
          accordionName: 'CMA Certification Structure',
          websiteName: 'IMA Official Website'
        };
      case 'cfp':
        return {
          modules: cfpModules,
          accordionName: 'CFP Certification Structure',
          websiteName: 'CFP Board Website'
        };
      case 'caia':
        return {
          modules: caiaModules,
          accordionName: 'CAIA Certification Structure',
          websiteName: 'CAIA Association Website'
        };
      default:
        return null;
    }
  };

  const accordionData = getAccordionData();

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
        
        {accordionData && (
          <QualificationStructureAccordion
            qualificationId={qualification.id}
            modules={accordionData.modules}
            getStatusBadge={getStatusBadge}
            accordionName={accordionData.accordionName}
            websiteName={accordionData.websiteName}
          />
        )}
      </div>
    </motion.div>
  );
};

export default QualificationCard;
