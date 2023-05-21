import { createTest, createTestSuite } from './common';

export const describe = (title: string, func: () => Promise<void>) =>
  createTestSuite(title, func);

export const it = (title: string, func: () => Promise<void>) =>
  createTest(title, func);
