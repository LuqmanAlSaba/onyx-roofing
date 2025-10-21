const config = {
  plugins: [
    "@tailwindcss/postcss",
    // CSS minification and optimization
    [
      "cssnano",
      {
        preset: [
          "advanced",
          {
            // Advanced optimizations
            discardComments: {
              removeAll: true, // Remove all comments
            },
            reduceIdents: false, // Prevent breaking CSS animations
            zindex: false, // Don't modify z-index values
            autoprefixer: false, // Disable autoprefixer (Next.js handles this)
            // Additional optimizations
            normalizeWhitespace: true,
            colormin: true,
            convertValues: true,
            discardDuplicates: true,
            discardEmpty: true,
            discardOverridden: true,
            mergeLonghand: true,
            mergeRules: true,
            minifyFontValues: true,
            minifyGradients: true,
            minifyParams: true,
            minifySelectors: true,
            normalizeCharset: true,
            normalizeDisplayValues: true,
            normalizePositions: true,
            normalizeRepeatStyle: true,
            normalizeString: true,
            normalizeTimingFunctions: true,
            normalizeUnicode: true,
            normalizeUrl: true,
            orderedValues: true,
            reduceInitial: true,
            reduceTransforms: true,
            svgo: true,
            uniqueSelectors: true,
          },
        ],
      },
    ],
  ],
};

export default config;
