export type ImportsList = { [key: string]: string | string[] | null };
export type JxaFn<R = any> = (...args: any[]) => R;

export type SerializedArgs = string;
export type SerializedImports = string;
export type SerializedFn = string;

export type FilledTemplate = string;
export type TemplateData = Record<string, any>;
