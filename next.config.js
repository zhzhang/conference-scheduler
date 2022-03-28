const { withGlobalCss } = require("next-global-css");

const withConfig = withGlobalCss();

module.exports = withConfig({
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
    {
      source: '/',
      destination: '/papers',
      permanent: true,
    },
  ]}
});
