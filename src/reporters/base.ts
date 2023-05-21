import supportsColor from 'supports-color';
import logSymbols from 'log-symbols';
import { FullConfig } from '../configLoader';
import { RunnerEmitter } from '../runner';

const useColours = supportsColor.stdout;
const isTty = process.stdout.isTTY && process.stderr.isTTY;
const log = console.log; // save a reference to console log incase tests are testing it

const COLOURS = {
  pass: 90,
  fail: 31,
  'bright pass': 92,
  'bright fail': 91,
  'bright yellow': 93,
  pending: 36,
  suite: 0,
  'error title': 0,
  'error message': 31,
  'error stack': 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  'diff gutter': 90,
  'diff added': 32,
  'diff removed': 31,
  'diff added inline': '30;42',
  'diff removed inline': '30;41',
} as const;

type Colours = keyof typeof COLOURS;

const SYMBOLS = {
  ok: logSymbols.success,
  err: logSymbols.error,
  dot: '.',
  comma: ',',
  bang: '!',
};

const colourString = (str: string, colour: Colours): string => {
  if (!useColours) {
    return str;
  }
  // return '\u001b[' + COLOURS[colour] + 'm' + str + '\u001b[0m';
  return `\u001b[${COLOURS[colour]}m${str}\u001b[0m`;
};

const WINDOW = {
  width: 75,
};

if (isTty) {
  WINDOW.width = process.stdout.getWindowSize()[0];
}

const cursor = {
  hide: function () {
    isTty && process.stdout.write('\u001b[?25l');
  },

  show: function () {
    isTty && process.stdout.write('\u001b[?25h');
  },

  deleteLine: function () {
    isTty && process.stdout.write('\u001b[2K');
  },

  beginningOfLine: function () {
    isTty && process.stdout.write('\u001b[0G');
  },

  CR: function () {
    if (isTty) {
      cursor.deleteLine();
      cursor.beginningOfLine();
    } else {
      process.stdout.write('\r');
    }
  },
} as const;

function showDiff(err) {
  return (
    err &&
    err.showDiff !== false &&
    sameType(err.actual, err.expected) &&
    err.expected !== undefined
  );
}

function stringifyDiffObjs(err) {
  if (!utils.isString(err.actual) || !utils.isString(err.expected)) {
    err.actual = utils.stringify(err.actual);
    err.expected = utils.stringify(err.expected);
  }
}

export const createBaseReporter = (
  config: FullConfig,
  runnerEvents: RunnerEmitter
) => {
  function generateDiff(actual, expected) {
    try {
      const maxLen = config.maxDiffSize;
      let skipped = 0;
      if (maxLen > 0) {
        skipped = Math.max(actual.length - maxLen, expected.length - maxLen);
        actual = actual.slice(0, maxLen);
        expected = expected.slice(0, maxLen);
      }
      let result = config.inlineDiffs
        ? inlineDiff(actual, expected)
        : unifiedDiff(actual, expected);
      if (skipped > 0) {
        result = `${result}\n      [eventspec] output truncated to ${maxLen} characters, see "maxDiffSize" reporter-option\n`;
      }
      return result;
    } catch (err) {
      const msg =
        '\n      ' +
        colourString('+ expected', 'diff added') +
        ' ' +
        colourString(
          '- actual:  failed to generate eventspec diff',
          'diff removed'
        ) +
        '\n';
      return msg;
    }
  }

  const failures = [];
  runnerEvents.on('TEST_PASSED', (test, result) => {
    // &shrug;
  });
  runnerEvents.on('TEST_FAILED', (test, result) => {});
};
