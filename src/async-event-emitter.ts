import { IAsyncEventEmitter, Handler, EmitResult } from './interfaces';

const anyEventSymbol = Symbol('any_event');

class AsyncEventEmitter implements IAsyncEventEmitter {
  private handlers = new Map<string | symbol, Handler[]>();

  /**
   * Stores event handler for events processing
   *
   * @param {string} eventName Event name
   * @param {function} handler Function to trigger
   */
  on(eventName: string, handler: Handler) {
    this.addHandler(eventName, handler);
  }

  /**
   * Stores event handler that triggers on any event
   * @param {function} handler Function to trigger
   */
  onAny(handler: Handler) {
    this.addHandler(anyEventSymbol, handler);
  }

  /**
   *
   * Calls every event handler by event name + all on any event handlers
   */
  async emit(eventName: string, payload: unknown): Promise<EmitResult> {
    const eventHandlers: Handler[] = [];
    const eventHandlersByEventName = this.handlers.get(eventName);
    const eventHandlersByAnyEvent = this.handlers.get(anyEventSymbol);

    eventHandlersByEventName?.forEach(h => eventHandlers.push(h));
    eventHandlersByAnyEvent?.forEach(h => eventHandlers.push(h));

    if (eventHandlers.length === 0) {
      return { succeeded: true, noHandlers: true, errors: [] };
    }

    const errors: Error[] = [];

    for await (let eventHandler of eventHandlers) {
      try {
        await eventHandler(payload);
      } catch (err) {
        errors.push(<Error>err);
      }
    }

    return {
      succeeded: errors.length === 0,
      errors,
    };
  }

  private addHandler(key: string | symbol, handler: Handler) {
    const handlers = this.handlers.get(key) || [];

    handlers.push(handler);

    this.handlers.set(key, handlers);
  }
}

export default AsyncEventEmitter;
