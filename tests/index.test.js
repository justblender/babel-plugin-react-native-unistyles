const path = require("node:path");

const pluginTester = require("babel-plugin-tester");
const plugin = require("../dist");

pluginTester({
  plugin: plugin.default,
  tests: {
    "Should skip injecting `useStyles`": {
      codeFixture: path.join("fixtures", "skip-injection", "input.fixture.js"),
      outputFixture: path.join("fixtures", "skip-injection", "output.fixture.js"),
    },
    "Should inject `useStyles`": {
      codeFixture: path.join("fixtures", "with-injection", "input.fixture.js"),
      outputFixture: path.join("fixtures", "with-injection", "output.fixture.js"),
    },
  },
});
