import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface FormFieldInfo {
  label: string;
  required: boolean;
  /** The control's id, so the form can move focus to the first problem. */
  id: string;
}

export interface FormContextValue {
  errors: Record<string, ReactNode>;
  register: (name: string, info: FormFieldInfo) => () => void;
}

/** Lets fields inside a Form find their error by name and tell the form they are required. */
export const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = () => useContext(FormContext);
