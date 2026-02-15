/**
 * Update product.images in the database to match WebP files on disk.
 * Use this after the image migration has written files to public/uploads/products/
 * but the DB still has base64 or needs to be synced with the file URLs.
 *
 * - Scans public/uploads/products/*.webp
 * - Groups by product ID (from filename: productId-timestamp-uuid.webp)
 * - Updates each product's images array with the URL list
 *
 * Run: npx tsx scripts/update-product-image-urls.ts
 * Or:  npm run update:image-urls
 */

import fs from "fs";
import path from "path";
import dbConnect from "../lib/db";
import Product from "../models/Product";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads/products");
const URL_PREFIX = "/uploads/products";

/** Filename format: productId-timestamp-uuid.webp (productId can be MongoDB Id or "product") */
function parseProductIdFromFilename(filename: string): string | null {
  if (!filename.endsWith(".webp")) return null;
  const base = filename.slice(0, -5);
  const parts = base.split("-");
  if (parts.length < 3) return null;
  const productId = parts[0];
  const timestamp = parts[1];
  if (!/^\d+$/.test(timestamp)) return null;
  return productId;
}

function isMongoId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

async function updateProductImageUrls() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      console.log("Upload directory not found:", UPLOAD_DIR);
      process.exit(1);
    }

    const files = fs.readdirSync(UPLOAD_DIR).filter((f) => f.endsWith(".webp"));
    console.log(`Found ${files.length} WebP file(s) in ${UPLOAD_DIR}`);

    if (files.length === 0) {
      console.log("No .webp files to sync.");
      process.exit(0);
    }

    // Group by productId, sort by timestamp so order is preserved
    const byProduct = new Map<string, { url: string; ts: number }[]>();

    for (const file of files) {
      const productId = parseProductIdFromFilename(file);
      if (!productId || !isMongoId(productId)) continue;

      const match = file.match(/^[^-]+-(\d+)-/);
      const ts = match ? parseInt(match[1], 10) : 0;
      const url = `${URL_PREFIX}/${file}`;

      if (!byProduct.has(productId)) {
        byProduct.set(productId, []);
      }
      byProduct.get(productId)!.push({ url, ts });
    }

    // Sort each product's list by timestamp
    for (const [id, list] of byProduct) {
      list.sort((a, b) => a.ts - b.ts);
    }

    await dbConnect();
    console.log("Connected to database.");

    let updated = 0;
    let skipped = 0;

    for (const [productId, entries] of byProduct) {
      const urls = entries.map((e) => e.url);
      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`Product not found: ${productId}, skipping.`);
        skipped++;
        continue;
      }
      product.images = urls;
      await product.save();
      updated++;
      console.log(`Updated ${productId} (${product.title}): ${urls.length} image(s).`);
    }

    console.log(`Done. Updated: ${updated}, skipped (no product): ${skipped}.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

updateProductImageUrls();
