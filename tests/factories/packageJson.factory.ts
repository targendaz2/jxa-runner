import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';
import { PackageJson } from 'type-fest';

class PackageJsonFactory extends Factory<PackageJson> {}

const packageJsonFactory = PackageJsonFactory.define(() => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
        firstName,
        lastName,
    });

    const author = `${firstName} ${lastName} <${email}>`;
    return {
        name: faker.helpers.slugify(faker.commerce.productName().toLowerCase()),
        version: faker.system.semver(),
        description: faker.lorem.paragraph(),
        author,
    };
});

export default packageJsonFactory;
