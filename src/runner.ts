import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import { Config } from './configLoader';
import { Test, TestFailure, TestPass, TestSuite } from './interfaces/common';

type RunnerEventsEmitter = {
  RUN_STARTED: () => void;
  SUITE_STARTED: (suite: TestSuite) => void;
  TEST_STARTED: (test: Test) => void;
  TEST_PASSED: (test: Test, result: TestPass) => void;
  TEST_FAILED: (test: Test, result: TestFailure) => void;
  SUITE_COMPLETED: (suite: TestSuite) => void;
  RUN_COMPLETED: () => void;
};

export type RunnerEvents = keyof RunnerEventsEmitter;
export type RunnerEmitter = TypedEmitter<RunnerEventsEmitter>;

export const createRunner = (config: Config) => {
  const runnerEvents = new EventEmitter<RunnerEvents>() as RunnerEmitter;
  return {
    runnerEvents,
    run: async (suites: TestSuite[]) => {
      runnerEvents.emit('RUN_STARTED');
      for (const suite of suites) {
        runnerEvents.emit('SUITE_STARTED', suite);
        await suite.func();
        for (const test of suite.tests) {
          runnerEvents.emit('TEST_STARTED', test);
          const result = await test.func();
          if (result.passed) {
            runnerEvents.emit('TEST_PASSED', test, result);
          } else {
            runnerEvents.emit('TEST_FAILED', test, result);
          }
        }
        runnerEvents.emit('SUITE_COMPLETED', suite);
      }
      runnerEvents.emit('RUN_COMPLETED');
    },
  };
};
