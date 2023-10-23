# Async Event Emitter [![NPM version](https://badge.fury.io/js/aeventemitter.png)](https://www.npmjs.com/package/aeventemitter)

Library that partialy (for now) implements Node.js' `events.EventEmitter` interface but with asynchronous sugar.

## Installation
```bash
npm i --save aeventemitter
# or
yarn add aeventemitter
```

## Usage example
```js
import AsyncEventEmitter from 'aeventemitter';

const eventEmitter = new AsyncEventEmitter();
const EVENT_NAME = 'event-name';

eventEmitter.on(EVENT_NAME, async (payload: any) => {
  // Do your staff
});

eventEmitter.on(EVENT_NAME, async (payload: any) => {
  // Do your another staff
});

const { succeeded, noHandlers, errors } = await eventEmitter.emit(EVENT_NAME, { test: 1 });

console.log(succeeded) // True if all handlers were proceeded
console.log(noHandlers) // True if no handlers for event
console.log(errors) // All errors that appears during event handlers execution
```

## Roadmap

1. Implement whole `events.EventEmitter`'s interface to be compatible with it.
2. Collect execution results like `Promise.all`
3. Add more tests