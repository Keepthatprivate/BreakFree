#!/usr/bin/env node
/**
 * Hero Image LCP Optimization Script
 * Creates aggressively optimized versions of hero images for faster LCP
 */
import sharp from 'sharp';
import { stat, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';

const ASSETS_DIR = './attached_assets';
const OUTPUT_DIR = './attached_assets/optimized';

// Hero images that need aggressive optimization
const HERO_IMAGES = [
  {
    input: 'ChatGPT Image 3 nov. 2025, 15_52_05_1762181570565.png',
    output: 'hero-desktop.webp',
    maxWidth: 1600,
    quality: 65, // Aggressive compression for LCP
  },
  {
    input: 'ChatGPT Image 3 nov. 2025, 15_56_30_1762181821528.png',
    output: 'hero-mobile.webp',
    maxWidth: 800, // Mobile screens don't need more
    quality: 60, // Even more aggressive for mobile
  },
];

async function optimizeHeroImage(config) {
  const inputPath = join(ASSETS_DIR, config.input);
  const outputPath = join(OUTPUT_DIR, config.output);

  try {
    const inputStats = await stat(inputPath);
    const inputSize = inputStats.size;

    // Get original dimensions
    const metadata = await sharp(inputPath).metadata();
    console.log(`\nProcessing: ${config.input}`);
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${(inputSize / 1024 / 1024).toFixed(2)}MB`);

    // Aggressive WebP compression
    await sharp(inputPath)
      .resize(config.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({
        quality: config.quality,
        effort: 6, // Maximum compression effort
        smartSubsample: true,
        nearLossless: false,
      })
      .toFile(outputPath);

    const outputStats = await stat(outputPath);
    const outputSize = outputStats.size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    const newMetadata = await sharp(outputPath).metadata();
    console.log(`  Optimized: ${newMetadata.width}x${newMetadata.height}, ${(outputSize / 1024).toFixed(0)}KB`);
    console.log(`  Savings: ${savings}% (target: <120KB for fast LCP)`);

    // Warn if still too large
    if (outputSize > 120000) {
      console.log(`  ⚠️  Warning: Still larger than 120KB target. Consider further optimization.`);
    } else {
      console.log(`  ✅ Size is within target!`);
    }

    return { inputSize, outputSize, savings };
  } catch (error) {
    console.error(`✗ Failed: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Hero Image LCP Optimization\n');
  console.log('Target: <120KB per image for fast mobile 4G loading');
  console.log('=' .repeat(50));

  // Ensure output directory exists
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
  } catch (e) {}

  let totalInputSize = 0;
  let totalOutputSize = 0;

  for (const config of HERO_IMAGES) {
    const result = await optimizeHeroImage(config);
    if (result) {
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log(`Total reduction: ${(totalInputSize / 1024 / 1024).toFixed(2)}MB → ${(totalOutputSize / 1024).toFixed(0)}KB`);
  console.log(`Savings: ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}%`);
}

main().catch(console.error);
