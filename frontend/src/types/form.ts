export type FieldType = "text" | "checkbox";

export type Mode = "view" | "fill" | "filled";

export interface Field {
  label: string;
  type: FieldType;
  required: boolean;
}

export interface Form {
  _id?: string;
  title: string;
  fields: Field[];
}

export interface ApiResponse {
  _id: string;
  title: string;
  fields: Field[];
  createdAt: string;
}

export interface FormItem {
  _id: string;
  title: string;
  createdAt: string;
  data: any[];
}

export interface SubmissionItem {
  _id: string;
  formTitle: string;
  submittedAt: string;
  data: any;
}

export interface FormsApiResponse {
  data: FormItem[] | SubmissionItem[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface FormListProps {
  mode?: "created" | "submitted";
}

export interface FormSchema {
  _id: string;
  title: string;
  fields: Field[];
  createdAt: string;
}

export interface SubmissionData {
  _id: string;
  formId: string;
  firstName: string;
  lastName: string;
  responses: Record<string, string | boolean>;
  createdAt: string;
}
