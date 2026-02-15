/**
 * Migration: Product images from DB (base64) to WebP files on disk.
 *
 * - Finds products that have any image in `images` starting with "data:"
 * - Decodes base64 to buffer, converts to WebP via imageProcessor, saves under public/uploads/products/
 * - Updates product.images to the new URLs and saves (removes base64 from DB)
 *
 * Run: npx tsx scripts/migrate-product-images.ts
 * Or:  npm run migrate:images  (if script is added to package.json)
 */

import dbConnect from "../lib/db";
import Product from "../models/Product";
import { processImageToWebP } from "../lib/imageProcessor";

function isBase64Image(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image");
}

function base64ToBuffer(dataUrl: string): Buffer {
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64, "base64");
}

async function migrateProductImages() {
  try {
    await dbConnect();
    console.log("Connected to database.");

    const products = await Product.find({
      images: { $elemMatch: { $regex: /^data:image/ } },
    });

    console.log(`Found ${products.length} product(s) with base64 images.`);

    if (products.length === 0) {
      console.log("Nothing to migrate.");
      process.exit(0);
    }

    let processed = 0;
    let failed = 0;

    for (const product of products) {
      const images = (product.images || []) as string[];
      const newUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!isBase64Image(img)) {
          newUrls.push(img);
          continue;
        }
        try {
          const buffer = base64ToBuffer(img);
          const { url } = await processImageToWebP(buffer, {
            maxWidth: 1200,
            quality: 80,
            productId: product._id.toString(),
          });
          newUrls.push(url);
        } catch (err) {
          console.error(
            `Failed to process image ${i + 1} for product ${product._id}:`,
            err
          );
          failed++;
          // Do not keep base64; blob is removed from DB. Image is lost unless re-uploaded.
        }
      }

      const hadBase64 = images.some(isBase64Image);
      if (!hadBase64) continue;

      product.images = newUrls;
      await product.save();
      processed++;
      console.log(
        `Migrated product ${product._id} (${product.title}). Images: ${images.filter(isBase64Image).length} -> ${newUrls.length} URL(s).`
      );
    }

    console.log(`Done. Processed: ${processed}, failed images: ${failed}.`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateProductImages();
