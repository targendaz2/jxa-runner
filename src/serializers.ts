import serializeJs from 'serialize-javascript';

export type ImportsList = { [key: string]: string | string[] | null };
type JxaFn<R = any> = (...args: any[]) => R;

interface Serializer<R extends any | any[]> {
    serialize(data: any | any[]): R;
}

export type SerializedArgs = string;

/** Serializes JavaScript function arguments as a single string. */
export const ArgsSerializer: Serializer<SerializedArgs> = {
    serialize(args: any | any[]) {
        if (Array.isArray(args)) {
            return args.map((arg: any) => serializeJs(arg)).toString();
        } else {
            return serializeJs(args);
        }
    },
};

export type SerializedImports = string[];

/** Serializes imports as an array of strings.  */
export const ImportsSerializer: Serializer<SerializedImports> = {
    serialize(imports: ImportsList = {}) {
        return Object.entries(imports).map(([module, values]) => {
            if (typeof values === 'string') {
                return `import ${values} from "${module}";`;
            } else if (Array.isArray(values)) {
                return `import {${values.toString()}} from "${module}";`;
            } else {
                return `import "${module}"`;
            }
        });
    },
};

export type SerializedFn = string;

/** Serializes a JavaScript function as a string. */
export const FnSerializer: Serializer<SerializedFn> = {
    serialize(fn: JxaFn = () => {}) {
        return fn.toString();
    },
};

export function serialize<R extends any | any[]>(
    data: any,
    serializer: Serializer<R>,
) {
    return serializer.serialize(data);
}
