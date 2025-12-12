/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                discardDuplicates: true,
                discardEmpty: true,
                normalizeWhitespace: true,
                minifySelectors: true,
                mergeLonghand: true,
                mergeRules: true,
              },
            ],
          },
        }
      : {}),
  },
};

export default config;
