import webpack from 'webpack';

export type ImportsList = { [key: string]: string | string[] | null };
export type JxaFn<R = any> = (...args: any[]) => R;

export type SerializedArgs = string;
export type SerializedImports = string;
export type SerializedFn = string;

export type FilledTemplate = string;
export type TemplateData = Record<string, any>;

export type CompilerOptions = Partial<InstanceType<typeof webpack.Compiler>>;
export type InputFileSystem = InstanceType<
    typeof webpack.Compiler
>['inputFileSystem'];
export type OutputFileSystem = InstanceType<
    typeof webpack.Compiler
>['outputFileSystem'];
