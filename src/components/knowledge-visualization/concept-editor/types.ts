
import { ConceptFormData } from '@/utils/form-validation/conceptValidator';

export interface ConceptEditorProps {
  mapId: string;
  concept?: any; // TODO: Define proper concept type
  onSave?: (concept: any) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
}

export interface ConceptFormProps {
  formData: ConceptFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface TypeIconSelectProps {
  formData: ConceptFormData;
  handleSelectChange: (name: string, value: string) => void;
}

export interface ColorSelectorProps {
  formData: ConceptFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColorChange: (color: string) => void;
}

export interface PositionInputsProps {
  formData: ConceptFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
