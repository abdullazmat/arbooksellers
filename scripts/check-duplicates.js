const mongoose = require('mongoose');

// Manually defining schema
const ProductSchema = new mongoose.Schema({
  title: String,
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function check() {
  try {
    const uri = "mongodb+srv://codeflamme:codeflamme@main.dkwovzc.mongodb.net/quran_ecommerce?retryWrites=true&w=majority&appName=quran_ecommerce";
    
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Connected!');

    const allProducts = await Product.find({}).select('title').lean();
    console.log(`\n--- DATABASE REPORT ---`);
    console.log(`Actual items in database: ${allProducts.length}`);

    const titles = allProducts.map(p => p.title);
    const uniqueTitles = new Set(titles);
    console.log(`Unique titles: ${uniqueTitles.size}`);

    if (allProducts.length !== uniqueTitles.size) {
      console.log('\nPotential duplicates found:');
      const counts = {};
      titles.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });

      let duplicateCount = 0;
      Object.entries(counts).forEach(([title, count]) => {
        if (count > 1) {
          console.log(`- "${title}": ${count} times`);
          duplicateCount += (count - 1);
        }
      });
      console.log(`\nTotal duplicate entries detected: ${duplicateCount}`);
    } else {
      console.log('\nNo duplicates found by title.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error during diagnostic:', err);
    process.exit(1);
  }
}

check();
