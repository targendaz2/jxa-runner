# JXA Runner

![GitHub License](https://img.shields.io/github/license/targendaz2/jxa-runner)
![GitHub Release](https://img.shields.io/github/v/release/targendaz2/jxa-runner?label=version)
![NPM Version](https://img.shields.io/npm/v/jxa-runner?logo=npm&logoColor=%23999999)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/targendaz2/jxa-runner/test.yml?logo=github&label=tests&logoColor=%23999999)

JXA Runner runs JavaScript and TypeScript code using the JXA runtime. It's intended to be used for testing JXA code rather than running JXA in production.

## Installation

This package is available on npm as [`jxa-runner`](https://npmjs.com/package/jxa-runner).

```bash
npm install jxa-runner
```

## Usage

### Basic Usage

```typescript
import { run } from 'jxa-runner';

// returns "Hello, world!"
await run(() => 'Hello, world!');

// returns "Hello, John!"
await run((name: string) => `Hello, ${name}!`, {
  args: ['John'],
});
```

### Importing Modules

```typescript
import { run } from 'jxa-runner';
import z from 'zod';

// returns { name: "John", age: 37 }
const result = await run(
  () => {
    const PersonSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    return PersonSchema.parse({ name: 'John', age: 37 });
  },
  {
    imports: {
      zod: 'z',
    },
  },
);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

JXA Runner is licensed under the [MIT License](https://github.com/targendaz2/jxa-runner/blob/main/LICENSE).
