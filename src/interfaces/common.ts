export type TestSuite = {
  title: string;
  func: () => Promise<void>;
  tests: Test[];
};

export type Test = {
  title: string;
  func: () => Promise<TestResult>;
};

export type TestPass = {
  passed: true;
  durationMs: number;
  skipped: boolean;
};

export type TestFailure = {
  passed: false;
  timedOut: boolean;
  missingEvents: string[];
};

type TestResult = TestPass | TestFailure;

const suites: TestSuite[] = [];

class EventSpecError extends Error {
  missingEvents: string[];
  constructor(message: string, missingEvents: string[]) {
    super(message);
    this.missingEvents = missingEvents;
  }
}

export const createTestSuite = (title: string, func: () => Promise<void>) => {
  const suite = {
    title,
    func,
    tests: [],
  };
  suites.push(suite);
  return suite;
};

export const createTest = (title: string, func: () => Promise<void>) => {
  const suite = suites[suites.length - 1];
  // suites are created sequentially, so the latest suite is always the one we want to add tests to.
  if (!suite) {
    throw new Error('Test must be declared within a test suite');
  }
  suite.tests.push({
    title,
    func: withTestResult(func),
  });
};

const withTestResult =
  (func: () => Promise<void>) => async (): Promise<TestResult> => {
    const start = new Date();
    try {
      const timeout = setTimeout(() => {
        // todo figure out how to timeout
        // todo figure out how to get the config to set timeout period
      }, 10_000);
      await func();
      clearTimeout(timeout);
      const end = new Date();
      return {
        passed: true,
        skipped: false,
        durationMs: end.getTime() - start.getTime(),
      };
    } catch (e) {
      if (e instanceof EventSpecError) {
        return {
          passed: false,
          timedOut: false,
          missingEvents: e.missingEvents,
        };
      }
    }
  };
