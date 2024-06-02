import pupa from 'pupa';
import { SerializedArgs, SerializedFn } from './serializers.js';

type TemplateData = Record<string, any>;
type FilledTemplate = string;

class Template<D extends TemplateData> {
    constructor(public readonly template: string) {}

    fill(data: D): FilledTemplate {
        return pupa(this.template, data, {
            ignoreMissing: false,
            transform: ({ value }) => (value !== undefined ? value : ''),
        });
    }
}

/** Template for the JXA entrypoint file. */
export const JxaCodeTemplate = new Template<{
    fn: SerializedFn;
    args?: SerializedArgs;
    imports?: string;
}>(`
    {imports}
    const fn = {fn}
    const result = fn({args});
    JSON.stringify({ result });
`);

export function fillTemplate<D extends TemplateData>(
    template: Template<D>,
    data: D,
): FilledTemplate {
    return template.fill(data);
}
