import dbConnect from "../lib/db";
import Product from "../models/Product";
import Category from "../models/Category";

async function migrate() {
  console.log("Starting migration...");
  await dbConnect();

  try {
    // 1. Find the categories
    const accessoriesCategory = await Category.findOne({ name: { $regex: /accessories/i } });
    const jahezCategory = await Category.findOne({ name: { $regex: /jahez addition/i } });

    if (!accessoriesCategory) {
      console.error("Could not find Accessories category. Cannot proceed.");
      process.exit(1);
    }

    if (!jahezCategory) {
      console.log("Could not find Jahez Addition category. Maybe it was already removed?");
      process.exit(0);
    }

    console.log(`Found Accessories ID: ${accessoriesCategory._id}`);
    console.log(`Found Jahez Addition ID: ${jahezCategory._id}`);

    // 2. Update all products having Jahez Addition as their category
    const categoryUpdateResult = await Product.updateMany(
      { category: jahezCategory._id },
      { $set: { category: accessoriesCategory._id } }
    );
    console.log(`Updated ${categoryUpdateResult.modifiedCount} products (Main Category).`);

    // 3. Update all products having Jahez Addition as their subcategory
    const subcategoryUpdateResult = await Product.updateMany(
      { subcategory: jahezCategory._id },
      { $set: { subcategory: accessoriesCategory._id } }
    );
    console.log(`Updated ${subcategoryUpdateResult.modifiedCount} products (Subcategory).`);

    // 4. Delete the Jahez category from the database
    await Category.deleteOne({ _id: jahezCategory._id });
    console.log("Successfully removed 'Jahez Addition' category from the database!");

    console.log("Migration complete.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
