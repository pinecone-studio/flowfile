//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  output: 'export',
  images: {
    unoptimized: true,
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
