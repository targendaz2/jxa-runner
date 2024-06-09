import { Factory } from 'fishery';
import type { DirectoryJSON } from 'memfs';
import packageJsonFactory from './packageJson.factory';

class PackageFactory extends Factory<DirectoryJSON> {}

const packageFactory = PackageFactory.define(() => {
    return {
        './package.json': JSON.stringify(packageJsonFactory.build()),
        './src/index.js': 'console.log("Hello, world!");',
    };
});

export default packageFactory;
