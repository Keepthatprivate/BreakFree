export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // Apply cssnano optimizations in production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          // Aggressive CSS minification
          discardComments: { removeAll: true },
          // Normalize values (e.g., #ffffff → #fff)
          normalizeWhitespace: true,
          // Merge duplicate rules
          mergeLonghand: true,
          mergeRules: true,
          // Minify selectors
          minifySelectors: true,
          // Minify font values
          minifyFontValues: true,
          // Minify gradients
          minifyGradients: true,
          // Reduce calc() expressions
          calc: true,
          // Optimize z-index values
          zindex: false, // Disable to prevent z-index issues
          // Reduce font-weight values (normal → 400)
          minifyFontValues: { removeQuotes: false },
          // Remove unused at-rules
          discardUnused: true,
          // Reduce duplicates
          uniqueSelectors: true,
        }],
      },
    }),
  },
}
