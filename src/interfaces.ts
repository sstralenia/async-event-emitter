export type Handler = (data: any) => Promise<any>;

export type EmitResult = {
  succeeded: boolean;
  noHandlers?: true,
  errors: Error[],
}

export interface IAsyncEventEmitter {
  on(evenName: string, handler: Handler): void
  onAny(handler: Handler): void
  emit(evenName: string, payload: any): Promise<EmitResult>
}