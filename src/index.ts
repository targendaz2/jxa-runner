export function run<T>(jxaFn: (...args: any[]) => T) {
    // Serialize the function
    const serializedFn = jxaFn.toString();
    return serializedFn;
}
