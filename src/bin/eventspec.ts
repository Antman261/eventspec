#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { runTests } from '../init';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .command(
    'test',
    'Run consumer-defined tests against this system',
    { config: { alias: 'c', default: './.eventspecrc.js' } },
    async (argv) => {
      await runTests(argv);
    }
  )
  .command(
    'upload',
    "Upload this system's consumer tests for producer systems to run",
    {},
    async (argv) => {
      console.log('Uploading');
    }
  ).argv;
