
export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface QuestionData {
  id: string;
  question: string;
  description?: string;
  type: 'text' | 'textarea' | 'radio' | 'slider' | 'checkbox' | 'multiselect' | 'rating';
  options?: QuestionOption[];
  placeholder?: string;
  required: boolean;
  category: 'context' | 'priorities' | 'behaviors' | 'emotional' | 'personal' | 'strengths' | 'goals';
  min?: string;
  max?: string;
}

export interface UserAnswers {
  name: string;
  age: string;
  responses: {
    [key: string]: string | string[] | number;
  };
}
