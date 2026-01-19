import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
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
    // Performance optimizations
    target: "esnext",
    minify: "esbuild",
    cssMinify: true,
    // Enable CSS code splitting for route-based CSS loading
    cssCodeSplit: true,
    // Manual chunk splitting for optimal caching and faster initial load
    rollupOptions: {
      output: {
        // Optimize chunk file names for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: (id) => {
          // Core React - small, loads first (critical path)
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
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
          // Radix UI - lazy loaded with components that need it
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
        },
      },
    },
    // Increase chunk size warning to avoid unnecessary splitting
    chunkSizeWarningLimit: 500,
    // Improve source map generation for production debugging
    sourcemap: false,
    // Report compressed size for accurate bundle analysis
    reportCompressedSize: true,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "wouter"],
    exclude: ["@stripe/stripe-js"],
  },
  // Enable esbuild optimizations
  esbuild: {
    // Remove console.log in production
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
    // Minify identifiers
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
