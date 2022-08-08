export type PresentationDefinition = {
  id: string;
  name?: string;
  purpose?: string;
  format?: unknown;
  input_descriptors: InputDescriptor[];
};

export type InputDescriptor = {
  id: string;
  name?: string;
  purpose?: string;
  format?: unknown;
  constraints?: Constraint;
};

export type Constraint = {
  fields?: Field[];
  limit_disclosure: 'required' | 'preferred';
};

export type Field = {
  path: string[];
  id?: string;
  purpose?: string;
  filter?: Filter;
};

// https://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.6
export type Filter = {
  type: 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string';
  enum?: unknown[];
  const?: unknown;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxContains?: number;
  minContains?: number;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  dependentRequired?: Record<string, string[]>;
};
