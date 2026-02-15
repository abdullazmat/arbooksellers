/**
 * Migration: Prepend base URL (https://arbooksellers.com) to all product image paths in DB.
 *
 * - Relative paths like /uploads/products/xxx.webp -> https://arbooksellers.com/uploads/products/xxx.webp
 * - Already full URLs (http/https) -> unchanged
 * - Base64 data URLs (data:...) -> left unchanged
 *
 * Run: npx tsx scripts/migrate-product-image-base-url.ts
 * Or:  npm run migrate:image-base-url
 */

import dbConnect from "../lib/db";
import Product from "../models/Product";
import { IMAGE_BASE_URL } from "../lib/utils";

function toFullImageUrl(value: unknown): string {
  if (typeof value !== "string" || !value) return (value as string) || "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("data:")) return value; // base64, leave as-is
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${IMAGE_BASE_URL}${path}`;
}

async function migrate() {
  try {
    await dbConnect();
    console.log("Connected to database. Base URL:", IMAGE_BASE_URL);

    const products = await Product.find({});
    console.log(`Found ${products.length} product(s).`);

    let updated = 0;

    for (const product of products) {
      const images = (product.images || []) as string[];
      if (images.length === 0) continue;

      const newUrls = images.map(toFullImageUrl);
      const changed = images.some((img, i) => img !== newUrls[i]);

      if (changed) {
        product.images = newUrls;
        await product.save();
        updated++;
        console.log(`Updated ${product._id} (${product.title}): ${images.length} image(s).`);
      }
    }

    console.log(`Done. Updated ${updated} product(s).`);
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrate();
