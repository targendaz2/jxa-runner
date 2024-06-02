import serializeJs from 'serialize-javascript';
import type {
    ImportsList,
    JxaFn,
    SerializedArgs,
    SerializedFn,
    SerializedImports,
} from './types.js';

interface Serializer<R extends any | any[]> {
    serialize(data: any | any[]): R;
}

/** Serializes data using the provided serializer. */
export function serialize<R extends any | any[]>(
    data: any,
    serializer: Serializer<R>,
) {
    return serializer.serialize(data);
}

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

/** Serializes imports as an array of strings.  */
export const ImportsSerializer: Serializer<SerializedImports> = {
    serialize(imports: ImportsList = {}) {
        return Object.entries(imports)
            .map(([module, values]) => {
                if (typeof values === 'string') {
                    // default import format
                    return `import ${values} from "${module}";`;
                } else if (Array.isArray(values)) {
                    // named import format
                    return `import {${values.toString()}} from "${module}";`;
                } else {
                    // module import format
                    return `import "${module}"`;
                }
            })
            .join('\n');
    },
};

/** Serializes a JavaScript function as a string. */
export const FnSerializer: Serializer<SerializedFn> = {
    serialize(fn: JxaFn = () => {}) {
        return fn.toString();
    },
};
