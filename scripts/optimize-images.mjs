#!/usr/bin/env node
/**
 * Image optimization script
 * Converts large PNG/JPG images to optimized WebP format
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';

const ASSETS_DIR = './attached_assets';
const OUTPUT_DIR = './attached_assets/optimized';

// Images used on critical landing/intro pages
const CRITICAL_IMAGES = [
  // Intro scene images (desktop and mobile)
  'ChatGPT Image 3 nov. 2025, 15_52_05_1762181570565.png',
  'ChatGPT Image 3 nov. 2025, 15_56_30_1762181821528.png',
  // Landing page logo
  'Design sans titre (1)_1761960133574.png',
  // Landing page hero
  'ChatGPT Image 23 oct. 2025, 11_10_54_1761938952913.png',
];

// Animation/quiz images to optimize
const ANIMATION_IMAGES = [
  'ChatGPT_Image_14_déc._2025__05_34_06_1765687552867.png',
  'ChatGPT_Image_14_déc._2025__05_37_20_1765687591926.png',
  'ChatGPT_Image_14_déc._2025__05_39_29_1765687684108.png',
  'ChatGPT_Image_14_déc._2025__05_42_11_1765690518553.png',
  'ChatGPT_Image_14_déc._2025__05_45_03_1765690612426.png',
  'ChatGPT_Image_14_déc._2025__06_00_32_1765690703534.png',
  'ChatGPT_Image_14_déc._2025__06_19_08_1765691067705.png',
  'ChatGPT_Image_14_déc._2025__06_28_31_1765690633341.png',
  'ChatGPT_Image_14_déc._2025__06_33_56_1765690722405.png',
  'ChatGPT_Image_14_déc._2025__06_33_59_1765690558979.png',
  'ChatGPT_Image_14_déc._2025__06_42_33_1765692120599.png',
  'ChatGPT_Image_14_déc._2025__06_42_38_1765692160088.png',
  'ChatGPT_Image_14_déc._2025__06_43_47_1765691050277.png',
  'ChatGPT_Image_14_déc._2025__06_45_18_1765692041463.png',
  'ChatGPT_Image_14_déc._2025__06_50_17_1765692194116.png',
  'ChatGPT_Image_14_déc._2025__06_51_50_1765692261574.png',
  'ChatGPT_Image_14_déc._2025__06_55_23_1765692234194.png',
  'ChatGPT_Image_14_déc._2025__06_59_25_1765691974697.png',
  'ChatGPT Image 23 oct. 2025, 23_39_37_1765690683401.png',
];

// Testimonial JPG images
const TESTIMONIAL_IMAGES = [
  'professional_woman_s_d4fbbe22-8574-4dfa-8baf-9f8a9459e498_1761875671024.jpg',
  'professional_black_m_06705ed8-4ce6-42c8-b2f7-03a3e39b80b9_1761875630652.jpg',
  'young_woman_casual_s_b2572404-ccb4-4d3e-951b-32cc51ae1e3d_1761875598915.jpg',
  'young_man_casual_sel_fecd2253-1e67-4af1-83fd-4e06f7f9c9f9_1761875556633.jpg',
  'young_woman_casual_s_cb2bd61f-aa43-405e-ad29-f68c4d0cc92a_1761875519153.jpg',
  'young_man_casual_sel_cfbef95c-b1e9-44bd-82b6-66aca8d9e6dd_1761875484287.jpg',
  'young_woman_smiling__c268d950-ca5c-4fe3-b7bc-94fda28ba9c8_1761875446227.jpg',
];

async function optimizeImage(inputPath, outputPath, options = {}) {
  const ext = extname(inputPath).toLowerCase();
  const isJpg = ext === '.jpg' || ext === '.jpeg';

  try {
    const inputStats = await stat(inputPath);
    const inputSize = inputStats.size;

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();

    // Calculate target dimensions (max 1920px width for desktop, preserve aspect ratio)
    let targetWidth = metadata.width;
    const maxWidth = options.maxWidth || 1920;
    if (targetWidth > maxWidth) {
      targetWidth = maxWidth;
    }

    // Convert to WebP with quality optimization
    await sharp(inputPath)
      .resize(targetWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({
        quality: options.quality || 80,
        effort: 6, // Higher effort = better compression
        smartSubsample: true,
      })
      .toFile(outputPath);

    const outputStats = await stat(outputPath);
    const outputSize = outputStats.size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);

    console.log(`✓ ${basename(inputPath)}`);
    console.log(`  ${(inputSize / 1024 / 1024).toFixed(2)}MB → ${(outputSize / 1024).toFixed(0)}KB (${savings}% smaller)`);

    return { inputSize, outputSize, savings };
  } catch (error) {
    console.error(`✗ Failed to optimize ${basename(inputPath)}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');

  // Create output directory
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
  } catch (e) {}

  let totalInputSize = 0;
  let totalOutputSize = 0;

  // Optimize critical images (highest priority - landing page)
  console.log('📍 Optimizing CRITICAL landing page images...\n');
  for (const filename of CRITICAL_IMAGES) {
    const inputPath = join(ASSETS_DIR, filename);
    const outputFilename = basename(filename, extname(filename)) + '.webp';
    const outputPath = join(OUTPUT_DIR, outputFilename);

    const result = await optimizeImage(inputPath, outputPath, {
      quality: 85, // Higher quality for hero images
      maxWidth: 1920
    });

    if (result) {
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
    }
  }

  // Optimize animation images
  console.log('\n🎬 Optimizing animation images...\n');
  for (const filename of ANIMATION_IMAGES) {
    const inputPath = join(ASSETS_DIR, filename);
    const outputFilename = basename(filename, extname(filename)) + '.webp';
    const outputPath = join(OUTPUT_DIR, outputFilename);

    const result = await optimizeImage(inputPath, outputPath, {
      quality: 75, // Slightly lower for animation frames
      maxWidth: 1200
    });

    if (result) {
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
    }
  }

  // Optimize testimonial images
  console.log('\n👤 Optimizing testimonial images...\n');
  for (const filename of TESTIMONIAL_IMAGES) {
    const inputPath = join(ASSETS_DIR, filename);
    const outputFilename = basename(filename, extname(filename)) + '.webp';
    const outputPath = join(OUTPUT_DIR, outputFilename);

    const result = await optimizeImage(inputPath, outputPath, {
      quality: 80,
      maxWidth: 400 // Testimonial images are small
    });

    if (result) {
      totalInputSize += result.inputSize;
      totalOutputSize += result.outputSize;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total input size:  ${(totalInputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total output size: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings:     ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}%`);
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
