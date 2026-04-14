const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function checkSlugs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
            title: String,
            slug: String
        }));
        
        const products = await Product.find({}, 'title slug').limit(10);
        console.log('Sample Products:');
        products.forEach(p => {
            console.log(`Title: ${p.title} | Slug: ${p.slug}`);
        });
        
        const emptySlugs = await Product.countDocuments({ slug: { $exists: false } });
        console.log(`\nProducts with no slug: ${emptySlugs}`);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkSlugs();
