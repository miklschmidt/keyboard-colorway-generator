/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  useTabs: true,
  singleQuote: true,
  jsxSingleQuote: false,
  trailingComma: "all",
  printWidth: 120,
};
export default config;
