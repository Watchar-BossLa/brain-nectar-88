
interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

export interface ConceptFormData {
  title: string;
  description: string;
  content: string;
  conceptType: string;
  color: string;
  icon: string;
  positionX: number;
  positionY: number;
  metadata: Record<string, any>;
}

export function validateConceptForm(formData: ConceptFormData): ValidationResult {
  const errors = [];

  // Required field validation
  if (!formData.title.trim()) {
    errors.push({
      field: 'title',
      message: 'Concept title is required'
    });
  }

  // Color validation (hex format)
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexColorRegex.test(formData.color)) {
    errors.push({
      field: 'color',
      message: 'Invalid color format. Use hex format (e.g., #4f46e5)'
    });
  }

  // Position validation
  if (typeof formData.positionX !== 'number') {
    errors.push({
      field: 'positionX',
      message: 'X position must be a number'
    });
  }

  if (typeof formData.positionY !== 'number') {
    errors.push({
      field: 'positionY',
      message: 'Y position must be a number'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
