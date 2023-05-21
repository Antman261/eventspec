import { join } from 'path';
import { TestSuite } from './interfaces/common';
import { RequiredProp } from './utils/requiredProp';

const CONFIG_FILES = ['.eventspecrc.js', '.eventspecrc.ts'] as const;

export type Config = {
  serviceName: string;
  getTestSuites: () => Promise<TestSuite[]>;
  beforeAll?: () => Promise<void>;
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
  afterAll?: () => Promise<void>;
  from: Record<string, FromServiceConfig>;
  maxDiffSize?: number;
  inlineDiffs?: boolean;
  hideDiff?: boolean;
};

type RequiredConfig = 'maxDiffSize' | 'inlineDiffs' | 'hideDiff';

export type FullConfig = RequiredProp<Config, RequiredConfig>;

type FromServiceConfig = {
  beforeAll?: () => Promise<void>;
  beforeEach?: () => Promise<void>;
  afterEach?: () => Promise<void>;
  afterAll?: () => Promise<void>;
  eventDispatcher: (event: Record<string, any>) => Promise<void>;
};

const defaultConfig: Pick<FullConfig, RequiredConfig> = {
  maxDiffSize: 75,
  inlineDiffs: true,
  hideDiff: false,
};

export const loadConfig = async (filepath: string): Promise<FullConfig> => {
  const path = join(process.cwd(), filepath);
  // TODO check if js or ts
  // TODO convert ts to js
  console.log('fp', filepath);
  console.log('path', path);
  const { default: config } = await import(path);

  if (typeof config === 'function') {
    // user can use a defineConfig function for type hinting, which will also run validation
    return config();
  }
  return validateConfig(config);
};

export const defineConfig = (config: Config): Config => {
  return validateConfig(config);
};

function validateConfig(config: unknown): FullConfig {
  // TODO implement
  const completeConfig = {
    ...defaultConfig,
    ...config,
  };
  return completeConfig as FullConfig;
}
