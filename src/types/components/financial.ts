
import { Dispatch, SetStateAction } from 'react';

/**
 * Financial tool prop types
 */

export interface CashFlowFormProps {
  onDataChange?: (data: any) => void;
  initialData?: any;
  newCashFlowItem: {
    name: string;
    amount: number;
    category: string;
    type: string;
  };
  setNewCashFlowItem: Dispatch<SetStateAction<{
    name: string;
    amount: number;
    category: string;
    type: string;
  }>>;
  addCashFlowItem: () => void;
}
