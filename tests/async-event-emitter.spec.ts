import { expect, jest, describe, it } from '@jest/globals';

import AsyncEventEmitter from '../src/async-event-emitter';

describe('AsyncEventEmitter', () => {
  describe('#onAny', () => {
    it('should call handlers for any event', async () => {
      const bus = new AsyncEventEmitter();
      const handler1 = jest.fn(() => Promise.resolve(1));
      const handler2 = jest.fn(() => Promise.resolve(2));
      const eventData = { name: 'test' };

      bus.onAny(handler1);
      bus.onAny(handler2);

      await bus.emit('eventName1', eventData);
      await bus.emit('eventName2', eventData);

      expect(handler1).toBeCalledTimes(2);
      expect(handler1).toBeCalledWith(eventData);
      expect(handler2).toBeCalledTimes(2);
      expect(handler2).toBeCalledWith(eventData);
    });
  });

  describe('#emit', () => {
    it('should skip event if there are no event handlers', async () => {
      const bus = new AsyncEventEmitter();
      const eventName = 'eventName';
      const eventData = { name: 'test' };

      const { succeeded, errors, noHandlers } = await bus.emit(eventName, eventData);

      expect(noHandlers).toBeTruthy()
      expect(succeeded).toBeTruthy()
      expect(errors).toHaveLength(0);
    });

    it('should call all handlers', async () => {
      const bus = new AsyncEventEmitter();
      const eventName = 'example:eventName';
      const handler1 = jest.fn(() => Promise.resolve());
      const handler2 = jest.fn(() => Promise.resolve());

      bus.on(eventName, handler1);
      bus.on(eventName, handler2);

      const eventData = { name: 'test' };

      const { succeeded, errors } = await bus.emit(eventName, eventData);

      expect(handler1).toBeCalledWith(eventData);
      expect(handler2).toBeCalledWith(eventData);
      expect(succeeded).toBeTruthy();
      expect(errors).toHaveLength(0);
    });

    it('should collect errors and process event if handler fails', async () => {
      const bus = new AsyncEventEmitter();
      const eventName = 'example:eventName';
      const handler1 = jest.fn(() => Promise.resolve());
      const handlerError = new Error('test error');
      const handler2 = jest.fn(() => Promise.reject(handlerError));
      const handler3 = jest.fn(() => Promise.resolve());

      bus.on(eventName, handler1);
      bus.on(eventName, handler2);
      bus.on(eventName, handler3);

      const eventData = { name: 'test' };
      const { succeeded, errors } = await bus.emit(eventName, eventData);

      expect(handler1).toBeCalled();
      expect(handler2).toBeCalled();
      expect(handler3).toBeCalled();
      expect(succeeded).toBeFalsy()
      expect(errors).toHaveLength(1);
      expect(errors![0].message).toBe(handlerError.message);
    });
  });
});
