import mongoose from 'mongoose';
import Category from '../models/Category';
import dbConnect from '../lib/db';

const categoriesData = [
  // Main Categories
  {
    name: 'Quran',
    isActive: true,
    sortOrder: 1,
    subcategories: [
      { name: 'Quran with English Translation', isActive: true, sortOrder: 1 },
      { name: 'Quran with Urdu Translation', isActive: true, sortOrder: 2 },
      { name: 'Quran without Translation', isActive: true, sortOrder: 3 },
      { name: 'Quran translation with Tafseer', isActive: true, sortOrder: 4 },
    ]
  },
  {
    name: 'Para Individual',
    isActive: true,
    sortOrder: 2,
    subcategories: [
      { name: 'Tajwedi Para', isActive: true, sortOrder: 1 },
      { name: 'Tajwedi Punj Para', isActive: true, sortOrder: 2 },
      { name: 'Para with Translation', isActive: true, sortOrder: 3 },
      { name: 'Para without Translation', isActive: true, sortOrder: 4 },
    ]
  },
  {
    name: 'Para Set',
    isActive: true,
    sortOrder: 3,
    subcategories: [
      { name: 'Para Set with Translation', isActive: true, sortOrder: 1 },
      { name: 'Para Set without Translation', isActive: true, sortOrder: 2 },
    ]
  },
  {
    name: 'Wazaif',
    isActive: true,
    sortOrder: 4,
    subcategories: [
      { name: 'Punj Surah', isActive: true, sortOrder: 1 },
      { name: 'Majmowa Wazaif', isActive: true, sortOrder: 2 },
      { name: 'Shashda Shareef', isActive: true, sortOrder: 3 },
    ]
  },
  {
    name: 'Qaida & Surah',
    isActive: true,
    sortOrder: 5,
    subcategories: [
      { name: 'Qaida', isActive: true, sortOrder: 1 },
      { name: 'Individual Surahs', isActive: true, sortOrder: 2 },
      { name: 'Namaz & Duas', isActive: true, sortOrder: 3 },
    ]
  },
  {
    name: 'Accessories',
    isActive: true,
    sortOrder: 6,
    subcategories: [
      { name: 'Gift Box', isActive: true, sortOrder: 1 },
      { name: 'Juzdan', isActive: true, sortOrder: 2 },
      { name: 'Rahal', isActive: true, sortOrder: 3 },
      { name: 'Prayer Mat', isActive: true, sortOrder: 4 },
      { name: 'Charts', isActive: true, sortOrder: 5 },
    ]
  },
  {
    name: 'Jahez Addition',
    isActive: true,
    sortOrder: 7,
    subcategories: [
      { name: 'Fancy Quran Pak with Box', isActive: true, sortOrder: 1 },
      { name: 'Fancy Quran Pak without Box', isActive: true, sortOrder: 2 },
    ]
  },
  {
    name: 'Digital Quran',
    isActive: true,
    sortOrder: 8,
    subcategories: [
      { name: 'Pocket Size Surah or Duas', isActive: true, sortOrder: 1 },
      { name: 'Digital Surah', isActive: true, sortOrder: 2 },
      { name: 'Duas', isActive: true, sortOrder: 3 },
    ]
  },
  {
    name: 'Sawab',
    isActive: true,
    sortOrder: 9,
    subcategories: [
      { name: 'Name', isActive: true, sortOrder: 1 },
      { name: 'Contact', isActive: true, sortOrder: 2 },
    ]
  },
];

async function seedCategories() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database successfully');

    // Clear existing categories
    console.log('Clearing existing categories...');
    await Category.deleteMany({});
    console.log('Existing categories cleared');

    // Create categories
    console.log('Creating categories...');
    const createdCategories = [];

    for (const categoryData of categoriesData) {
      // Create main category
      const mainCategory = new Category({
        name: categoryData.name,
        slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        isActive: categoryData.isActive,
        sortOrder: categoryData.sortOrder,
      });
      await mainCategory.save();
      createdCategories.push(mainCategory);
      console.log(`Created main category: ${mainCategory.name}`);

      // Create subcategories
      if (categoryData.subcategories) {
        for (const subcategoryData of categoryData.subcategories) {
          const subcategory = new Category({
            name: subcategoryData.name,
            slug: subcategoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            parent: mainCategory._id,
            isActive: subcategoryData.isActive,
            sortOrder: subcategoryData.sortOrder,
          });
          await subcategory.save();
          createdCategories.push(subcategory);
          console.log(`Created subcategory: ${subcategory.name} under ${mainCategory.name}`);

          // Add subcategory to parent's subcategories array
          mainCategory.subcategories.push(subcategory._id);
        }
        await mainCategory.save();
      }
    }

    console.log(`\nSuccessfully created ${createdCategories.length} categories`);
    console.log('Categories seeded successfully!');
    
    // Display summary
    const mainCategories = createdCategories.filter(cat => !cat.parent);
    const subcategories = createdCategories.filter(cat => cat.parent);
    
    console.log(`\nSummary:`);
    console.log(`- Main categories: ${mainCategories.length}`);
    console.log(`- Subcategories: ${subcategories.length}`);
    console.log(`- Total categories: ${createdCategories.length}`);

  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedCategories();
