const { defineConfig } = require('../lib/configLoader');
const { describe, it } = require('../lib/interfaces/bdd');

module.exports = defineConfig({
  from: {},
  serviceName: 'test',
  getTestSuites: async () => {
    return [
      describe('some test', async () => {
        console.log('I am a suite');
        it('does stuff', async () => {
          console.log('I am a test');
        });
      }),
    ];
  },
});
