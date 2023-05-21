function listFailures(failures) {
  var multipleErr, multipleTest; // wot r these
  log();
  failures.forEach(function (test, i) {
    // format
    let fmt =
      colourString('  %s) %s:\n', 'error title') +
      colourString('     %s', 'error message') +
      colourString('\n%s\n', 'error stack');

    // msg
    let msg: string = '';
    let err;
    if (test.err && test.err.multiple) {
      if (multipleTest !== test) {
        multipleTest = test;
        multipleErr = [test.err].concat(test.err.multiple);
      }
      err = multipleErr.shift();
    } else {
      err = test.err;
    }
    let message;
    if (typeof err.inspect === 'function') {
      message = err.inspect() + '';
    } else if (err.message && typeof err.message.toString === 'function') {
      message = err.message + '';
    } else {
      message = '';
    }
    let stack = err.stack || message;
    let index = message ? stack.indexOf(message) : -1;

    if (index === -1) {
      msg = message;
    } else {
      index += message.length;
      msg = stack.slice(0, index);
      // remove msg from stack
      stack = stack.slice(index + 1);
    }

    // uncaught
    if (err.uncaught) {
      msg = 'Uncaught ' + msg;
    }
    // explicitly show diff
    if (!config.hideDiff && showDiff(err)) {
      stringifyDiffObjs(err);
      fmt =
        colourString('  %s) %s:\n%s', 'error title') +
        colourString('\n%s\n', 'error stack');
      const match = message.match(/^([^:]+): expected/);
      msg = '\n      ' + colourString(match ? match[1] : msg, 'error message');

      msg += generateDiff(err.actual, err.expected);
    }

    // indent stack trace
    stack = stack.replace(/^/gm, '  ');

    // indented test title
    let testTitle = '';
    test.titlePath().forEach(function (str, index) {
      if (index !== 0) {
        testTitle += '\n     ';
      }
      for (let i = 0; i < index; i++) {
        testTitle += '  ';
      }
      testTitle += str;
    });

    log(fmt, i + 1, testTitle, msg, stack);
  });
}
