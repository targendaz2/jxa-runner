# JXA Runner

![GitHub License](https://img.shields.io/github/license/targendaz2/jxa-runner)
![GitHub version](https://img.shields.io/github/package-json/v/targendaz2/jxa-runner?label=version)
![NPM version](https://img.shields.io/npm/v/jxa-runner)
![tests](https://github.com/targendaz2/jxa-runner/actions/workflows/test.yml/badge.svg)

JXA Runner runs JavaScript and TypeScript code using the JXA runtime. It's intended to be used for testing JXA code rather than running JXA in production.

## Installation

JXA Runner is available on the npm registry as `jxa-runner`.

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

### Synchronous Usage

```typescript
import { runSync } from 'jxa-runner';

// returns "Hello, world!"
runSync(() => 'Hello, world!');

// returns "Hello, John!"
runSync((name: string) => `Hello, ${name}!`, {
  args: ['John'],
});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

JXA Runner is licensed under the [MIT License](https://github.com/targendaz2/jxa-runner/blob/main/LICENSE).
