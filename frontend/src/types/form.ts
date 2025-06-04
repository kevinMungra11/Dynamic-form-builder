export type FieldType = "text" | "checkbox";

export interface Field {
  label: string;
  type: FieldType;
  required: boolean;
}

export interface Form {
  _id?: string; // optional for frontend before backend response
  title: string;
  fields: Field[];
}
