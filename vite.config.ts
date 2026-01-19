import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react({
      // Use automatic JSX runtime for smaller bundle
      jsxRuntime: 'automatic',
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Performance optimizations - target modern browsers for smaller bundles
    target: ['es2020', 'chrome87', 'firefox78', 'safari14', 'edge88'],
    minify: "esbuild",
    cssMinify: true,
    // Enable CSS code splitting for route-based CSS loading
    cssCodeSplit: true,
    // Reduce asset inlining threshold (only inline very small assets)
    assetsInlineLimit: 2048, // 2KB
    // Manual chunk splitting for optimal caching and faster initial load
    rollupOptions: {
      output: {
        // Optimize chunk file names for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        // Smaller chunks for better parallelization
        experimentalMinChunkSize: 5000, // 5KB minimum
        manualChunks: (id) => {
          // Core React - small, loads first (critical path)
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // Scheduler (React internal) - critical path
          if (id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }
          // Router - critical path
          if (id.includes("node_modules/wouter/")) {
            return "vendor-react";
          }
          // Animation - lazy loaded after first paint
          if (id.includes("node_modules/framer-motion/")) {
            return "vendor-animation";
          }
          // Radix UI primitives - load with first component
          if (id.includes("node_modules/@radix-ui/react-primitive") ||
              id.includes("node_modules/@radix-ui/react-slot") ||
              id.includes("node_modules/@radix-ui/react-compose-refs")) {
            return "vendor-radix-core";
          }
          // Radix UI components - lazy loaded
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
          // Payment - only loaded on checkout
          if (id.includes("node_modules/@stripe/")) {
            return "vendor-stripe";
          }
          // Charts - only needed for results page
          if (id.includes("node_modules/recharts/") || id.includes("node_modules/d3-")) {
            return "vendor-charts";
          }
          // React Query - deferred loading
          if (id.includes("node_modules/@tanstack/")) {
            return "vendor-query";
          }
          // Forms - loaded when needed
          if (id.includes("node_modules/react-hook-form/") || id.includes("node_modules/@hookform/")) {
            return "vendor-forms";
          }
          // Zod validation - loaded with forms
          if (id.includes("node_modules/zod/")) {
            return "vendor-forms";
          }
          // Date utilities - loaded with date picker
          if (id.includes("node_modules/date-fns/")) {
            return "vendor-date";
          }
          // Icons - loaded on demand
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }
          // Class utilities (clsx, class-variance-authority, tailwind-merge)
          if (id.includes("node_modules/clsx/") ||
              id.includes("node_modules/class-variance-authority/") ||
              id.includes("node_modules/tailwind-merge/")) {
            return "vendor-utils";
          }
        },
      },
      // Tree-shaking optimizations
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Increase chunk size warning to avoid unnecessary splitting
    chunkSizeWarningLimit: 500,
    // Disable source maps in production for smaller files
    sourcemap: false,
    // Report compressed size for accurate bundle analysis
    reportCompressedSize: true,
    // Enable module preload polyfill for Safari
    modulePreload: {
      polyfill: true,
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "wouter", "clsx", "tailwind-merge"],
    exclude: ["@stripe/stripe-js"],
    // Force optimization of ESM dependencies
    esbuildOptions: {
      target: 'es2020',
    },
  },
  // Enable esbuild optimizations
  esbuild: {
    // Remove console.log in production
    drop: isProduction ? ["console", "debugger"] : [],
    // Minify identifiers
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // Target modern browsers
    target: 'es2020',
    // Legal comments handling
    legalComments: 'none',
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
