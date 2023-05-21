import { createRunner } from './runner';
import { loadConfig } from './configLoader';

type Props = {
  config: string;
};

export async function runTests(props: Props) {
  console.log('props', props);
  const config = await loadConfig(props.config);

  // retrieve specs
  const specs = await config.getTestSuites();
  // create runner
  const { run, runnerEvents } = createRunner(config);
  // register reporter
  // register stats collector
  await run(specs);
}
