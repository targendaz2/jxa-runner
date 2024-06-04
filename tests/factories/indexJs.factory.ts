import { Factory } from 'fishery';

class IndexJsFactory extends Factory<string> {}

const indexJsFactory = IndexJsFactory.define(() => {
    return 'console.log("Hello, world!");';
});

export default indexJsFactory;
