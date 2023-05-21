/**
 * Send a message to the Producer service. The consumer uses this in their tests for the Producer to send events to the Producer under test.
 * @param eventName
 */
export const send = (eventName: string) => {
  // TODO implement a function that will send a message to the service using config.from[serviceName].eventDispatcher
};

/**
 * Use this function in tests to assert that the producer service publishes the correct event after it receives an event
 * @param eventName
 * @param opts
 */
export const assertReceived = (eventName: string, opts) => {
  // TODO implement a function that will wait for a message to show up from mockPublish
  // TODO the received message must match the message spec
};

/**
 * Used by the producer service under test to capture messages that would typically be published to a message queue.
 * @param event
 */
export const mockPublish = async (event: unknown): Promise<void> => {
  //
};
