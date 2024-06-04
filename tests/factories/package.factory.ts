import { Factory } from 'fishery';
import type { DirectoryJSON } from 'memfs';
import indexJsFactory from './indexJs.factory';
import packageJsonFactory from './packageJson.factory';

class PackageFactory extends Factory<DirectoryJSON> {}

const packageFactory = PackageFactory.define(() => {
    return {
        './package.json': JSON.stringify(packageJsonFactory.build()),
        './src/index.js': indexJsFactory.build(),
    };
});

export default packageFactory;
