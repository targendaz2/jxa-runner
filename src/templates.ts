import pupa from 'pupa';
import type {
    FilledTemplate,
    SerializedArgs,
    SerializedFn,
    SerializedImports,
    TemplateData,
} from './types.js';

class Template<D extends TemplateData> {
    constructor(public readonly template: string) {}

    fill(data: D): FilledTemplate {
        return pupa(this.template, data, {
            ignoreMissing: false,
            transform: ({ value }) => (value !== undefined ? value : ''),
        });
    }
}

/** Fills a template using the provided data. */
export function fillTemplate<D extends TemplateData>(
    template: Template<D>,
    data: D,
): FilledTemplate {
    return template.fill(data);
}

/** Template for the JXA entrypoint file. */
export const JxaCodeTemplate = new Template<{
    fn: SerializedFn;
    args?: SerializedArgs;
    imports?: SerializedImports;
}>(`
    {imports}
    const fn = {fn}
    const result = fn({args});
    JSON.stringify({ result });
`);
