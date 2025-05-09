import { accaModules } from '../accaDetails';
import { cpaModules } from '../cpaDetails';
import { cfaModules } from '../cfaDetails';
import { frmModules } from '../frmDetails';
import { cimaModules } from '../cimaDetails';
import { cmaModules } from '../cmaDetails';
import { cfpModules } from '../cfpDetails';
import { caiaModules } from '../caiaDetails';
import { bsmathModules } from '../bsmathDetails';
import { mathstatModules } from '../mathstatDetails';
import { actuaryModules } from '../actuaryDetails';
import { datascienceModules } from '../datascienceDetails';
import { QualificationLevel } from '../types';

interface QualificationModulesData {
  modules: QualificationLevel[];
  accordionName: string;
  websiteName: string;
}

/**
 * Custom hook to get qualification modules data based on qualification ID
 */
export const useQualificationModules = (qualificationId: string): QualificationModulesData | null => {
  switch (qualificationId) {
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
    case 'bsmath':
      return {
        modules: bsmathModules,
        accordionName: 'BS Mathematics Structure',
        websiteName: 'Mathematics Department Website'
      };
    case 'mathstat':
      return {
        modules: mathstatModules,
        accordionName: 'Mathematical Statistics Certification Structure',
        websiteName: 'Statistical Society Website'
      };
    case 'actuary':
      return {
        modules: actuaryModules,
        accordionName: 'Actuarial Science Structure',
        websiteName: 'Society of Actuaries Website'
      };
    case 'datascience':
      return {
        modules: datascienceModules,
        accordionName: 'Data Science Certification Structure',
        websiteName: 'Data Science Association Website'
      };
    default:
      return null;
  }
};
