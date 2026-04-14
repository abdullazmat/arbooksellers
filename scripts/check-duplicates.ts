import dbConnect from '../lib/db';
import Product from '../models/Product';
import mongoose from 'mongoose';

async function check() {
  try {
    await dbConnect();
    console.log('Connected to DB');

    const allProducts = await Product.find({}).select('title _id').lean();
    console.log(`Total count in DB: ${allProducts.length}`);

    const titles = allProducts.map(p => p.title);
    const uniqueTitles = new Set(titles);

    console.log(`Unique titles count: ${uniqueTitles.size}`);

    if (titles.length !== uniqueTitles.size) {
      console.log('\nPotential duplicates found (by title):');
      const counts: Record<string, number> = {};
      titles.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });

      Object.entries(counts).forEach(([title, count]) => {
        if (count > 1) {
          console.log(`- "${title}": ${count} times`);
        }
      });
    } else {
      console.log('\nNo duplicate titles found.');
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

check();
