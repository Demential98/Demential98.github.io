/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2023: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  ignorePatterns: ["dist", "node_modules"],
  rules: {
    "react/prop-types": "off",
  },
};
