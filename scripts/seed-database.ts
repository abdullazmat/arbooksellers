import dbConnect from '../lib/db';
import Product from '../models/Product';
import User from '../models/User';

const products = [
  {
    title: 'The Noble Quran - Arabic & English',
    author: 'Translation by Dr. Muhammad Taqi-ud-Din',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      '/quran-islamic-books.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.9,
    reviews: 1250,
    category: 'quran',
    language: 'Multilingual',
    inStock: true,
    stockQuantity: 50,
    description: 'Complete Quran with accurate English translation and Arabic text',
    fullDescription: 'This beautiful edition of the Noble Quran features the original Arabic text alongside an accurate English translation by Dr. Muhammad Taqi-ud-Din Al-Hilali and Dr. Muhammad Muhsin Khan. The translation is known for its clarity and adherence to the original meaning, making it an excellent choice for both Arabic speakers and English readers seeking to understand the Quran. The book includes helpful footnotes and references to provide context and deeper understanding of the verses.',
    specifications: {
      publisher: 'Darussalam Publishers',
      pages: 1056,
      isbn: '978-9960-892-64-2',
      dimensions: '6.5 x 9.5 inches',
      weight: '2.8 lbs',
      binding: 'Hardcover'
    },
    tags: ['quran', 'translation', 'arabic', 'english', 'holy book'],
    featured: true
  },
  {
    title: 'Sahih Al-Bukhari Complete Set',
    author: 'Imam Al-Bukhari',
    price: 89.99,
    originalPrice: 120.00,
    images: [
      '/sahih-bukhari-books.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.8,
    reviews: 890,
    category: 'hadith',
    language: 'Multilingual',
    inStock: true,
    stockQuantity: 25,
    description: 'The most authentic collection of Prophet Muhammad\'s sayings',
    fullDescription: 'Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari. It is considered the most authentic book after the Quran by the majority of Muslims. This complete set contains all 7,563 hadith, carefully authenticated and organized by topic. Each hadith includes the chain of narration and has been verified for authenticity according to the strictest standards.',
    specifications: {
      publisher: 'Darussalam Publishers',
      pages: 4200,
      isbn: '978-9960-717-31-3',
      dimensions: '7 x 10 inches',
      weight: '12 lbs',
      binding: 'Hardcover Set (9 Volumes)'
    },
    tags: ['hadith', 'bukhari', 'authentic', 'prophet', 'sayings'],
    featured: true
  },
  {
    title: 'The Sealed Nectar - Biography of Prophet Muhammad',
    author: 'Safiur Rahman Mubarakpuri',
    price: 24.99,
    originalPrice: 34.99,
    images: [
      '/the-sealed-nectar-book.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.7,
    reviews: 756,
    category: 'seerah',
    language: 'English',
    inStock: true,
    stockQuantity: 40,
    description: 'Award-winning biography of Prophet Muhammad (PBUH)',
    fullDescription: 'The Sealed Nectar is an award-winning biography of Prophet Muhammad (PBUH) that provides a comprehensive and authentic account of his life. This book covers the Prophet\'s life from birth to death, including his childhood, prophethood, migration to Medina, and the establishment of the first Islamic state. The author has meticulously researched and presented the information in a clear, engaging manner.',
    specifications: {
      publisher: 'Darussalam Publishers',
      pages: 512,
      isbn: '978-9960-899-55-8',
      dimensions: '6 x 9 inches',
      weight: '1.8 lbs',
      binding: 'Hardcover'
    },
    tags: ['seerah', 'prophet', 'biography', 'muhammad', 'islamic history'],
    featured: true
  },
  {
    title: 'Islamic Studies for Children - Stories of the Prophets',
    author: 'Various Authors',
    price: 19.99,
    originalPrice: 24.99,
    images: [
      '/islamic-children-book-prophets.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.6,
    reviews: 432,
    category: 'children',
    language: 'English',
    inStock: true,
    stockQuantity: 60,
    description: 'Engaging Islamic stories for children with beautiful illustrations',
    fullDescription: 'This beautifully illustrated book contains stories of the prophets from Islamic tradition, specially written for children. Each story is presented in an engaging way that helps children understand Islamic values and morals. The book includes stories of Prophet Adam, Noah, Abraham, Moses, Jesus, and Muhammad (peace be upon them all).',
    specifications: {
      publisher: 'Islamic Foundation',
      pages: 128,
      isbn: '978-086037-123-4',
      dimensions: '8.5 x 11 inches',
      weight: '1.2 lbs',
      binding: 'Hardcover'
    },
    tags: ['children', 'prophets', 'stories', 'education', 'islamic values'],
    featured: false
  },
  {
    title: 'Tafsir Ibn Kathir - Commentary on the Quran',
    author: 'Imam Ibn Kathir',
    price: 149.99,
    originalPrice: 199.99,
    images: [
      '/tafsir-ibn-kathir-commentary.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.9,
    reviews: 234,
    category: 'quran',
    language: 'Multilingual',
    inStock: true,
    stockQuantity: 15,
    description: 'Comprehensive commentary on the Quran by Ibn Kathir',
    fullDescription: 'Tafsir Ibn Kathir is one of the most comprehensive and authentic commentaries on the Quran. This monumental work provides detailed explanations of Quranic verses, including historical context, linguistic analysis, and relevant hadith. The commentary is based on authentic sources and provides deep insights into the meaning and wisdom of the Quran.',
    specifications: {
      publisher: 'Darussalam Publishers',
      pages: 6000,
      isbn: '978-9960-892-75-8',
      dimensions: '7 x 10 inches',
      weight: '15 lbs',
      binding: 'Hardcover Set (10 Volumes)'
    },
    tags: ['tafsir', 'quran', 'commentary', 'ibn kathir', 'islamic scholarship'],
    featured: false
  },
  {
    title: 'Fortress of the Muslim - Book of Invocations',
    author: 'Sa\'id bin Ali bin Wahf Al-Qahtani',
    price: 12.99,
    originalPrice: 16.99,
    images: [
      '/fortress-muslim-duas-book.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.8,
    reviews: 567,
    category: 'general',
    language: 'Multilingual',
    inStock: true,
    stockQuantity: 80,
    description: 'Comprehensive collection of authentic Islamic supplications',
    fullDescription: 'Fortress of the Muslim is a comprehensive collection of authentic supplications (duas) from the Quran and Sunnah. This book contains prayers for various occasions and situations in daily life, including morning and evening supplications, prayers for entering and leaving places, and supplications for different life events.',
    specifications: {
      publisher: 'Darussalam Publishers',
      pages: 256,
      isbn: '978-9960-892-91-8',
      dimensions: '5.5 x 8 inches',
      weight: '0.8 lbs',
      binding: 'Paperback'
    },
    tags: ['duas', 'supplications', 'prayers', 'daily', 'islamic practice'],
    featured: false
  },
  {
    title: 'Islamic Calligraphy - Art of Arabic Writing',
    author: 'Ahmed Hassan',
    price: 34.99,
    originalPrice: 44.99,
    images: [
      '/islamic-calligraphy-quran.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.5,
    reviews: 189,
    category: 'general',
    language: 'English',
    inStock: true,
    stockQuantity: 30,
    description: 'Beautiful Islamic calligraphy art book with Quranic verses',
    fullDescription: 'This stunning book showcases the art of Islamic calligraphy through beautiful reproductions of Quranic verses and Islamic phrases. The book includes historical information about the development of Arabic calligraphy, different styles, and techniques used by master calligraphers throughout Islamic history.',
    specifications: {
      publisher: 'Islamic Art Foundation',
      pages: 180,
      isbn: '978-086037-456-7',
      dimensions: '9 x 12 inches',
      weight: '2.5 lbs',
      binding: 'Hardcover'
    },
    tags: ['calligraphy', 'art', 'arabic', 'quranic verses', 'islamic art'],
    featured: false
  },
  {
    title: 'Islamic Studies - A Comprehensive Guide',
    author: 'Dr. Muhammad Hamidullah',
    price: 45.99,
    originalPrice: 59.99,
    images: [
      '/islamic-studies-books.png',
      '/placeholder.svg?height=400&width=400',
      '/placeholder.svg?height=400&width=400'
    ],
    rating: 4.7,
    reviews: 321,
    category: 'general',
    language: 'English',
    inStock: true,
    stockQuantity: 35,
    description: 'Comprehensive guide to Islamic studies and theology',
    fullDescription: 'This comprehensive guide covers various aspects of Islamic studies including theology, jurisprudence, history, and contemporary issues. Written by renowned Islamic scholar Dr. Muhammad Hamidullah, this book provides a thorough understanding of Islamic principles and their application in modern times.',
    specifications: {
      publisher: 'Islamic Research Institute',
      pages: 480,
      isbn: '978-086037-789-2',
      dimensions: '6 x 9 inches',
      weight: '1.6 lbs',
      binding: 'Hardcover'
    },
    tags: ['islamic studies', 'theology', 'jurisprudence', 'scholarship', 'education'],
    featured: false
  }
];

async function seedDatabase() {
  try {
    await dbConnect();
    
    // Drop the existing collection to avoid index conflicts
    await Product.collection.drop();
    console.log('Dropped existing products collection');
    
    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Inserted ${insertedProducts.length} products`);
    
    // Create a default admin user
    const adminEmail = 'admin@islamicbooks.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890'
      });
      
      await adminUser.save();
      console.log('Created admin user');
    } else {
      console.log('Admin user already exists');
    }
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 