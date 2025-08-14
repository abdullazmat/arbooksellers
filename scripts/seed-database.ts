import dbConnect from '../lib/db';
import Product from '../models/Product';
import User from '../models/User';
import Newsletter from '../models/Newsletter';
import Comment from '../models/Comment';

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
    inStock: true,
    stockQuantity: 50,
    description: 'Complete Quran with accurate English translation and Arabic text',
    fullDescription: 'This beautiful edition of the Noble Quran features the original Arabic text alongside an accurate English translation by Dr. Muhammad Taqi-ud-Din Al-Hilali and Dr. Muhammad Muhsin Khan. The translation is known for its clarity and adherence to the original meaning, making it an excellent choice for both Arabic speakers and English readers seeking to understand the Quran. The book includes helpful footnotes and references to provide context and deeper understanding of the verses.',
    size: '6.5 x 9.5 inches',
    pages: 1056,
    paper: 'Premium Paper',
    binding: 'Hardcover',
    specifications: {
      publisher: 'Darussalam Publishers',
      isbn: '978-9960-892-64-2',
      weight: '2.8 lbs',
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
    inStock: true,
    stockQuantity: 25,
    description: 'The most authentic collection of Prophet Muhammad\'s sayings',
    fullDescription: 'Sahih al-Bukhari is a collection of hadith compiled by Imam Muhammad al-Bukhari. It is considered the most authentic book after the Quran by the majority of Muslims. This complete set contains all 7,563 hadith, carefully authenticated and organized by topic. Each hadith includes the chain of narration and has been verified for authenticity according to the strictest standards.',
    size: '7 x 10 inches',
    pages: 4200,
    paper: 'Bible Paper',
    binding: 'Hardcover Set (9 Volumes)',
    specifications: {
      publisher: 'Darussalam Publishers',
      isbn: '978-9960-717-31-3',
      weight: '12 lbs',
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
    inStock: true,
    stockQuantity: 40,
    description: 'Award-winning biography of Prophet Muhammad (PBUH)',
    fullDescription: 'The Sealed Nectar is an award-winning biography of Prophet Muhammad (PBUH) that provides a comprehensive and authentic account of his life. This book covers the Prophet\'s life from birth to death, including his childhood, prophethood, migration to Medina, and the establishment of the first Islamic state. The author has meticulously researched and presented the information in a clear, engaging manner.',
    size: '6 x 9 inches',
    pages: 512,
    paper: 'Standard Paper',
    binding: 'Hardcover',
    specifications: {
      publisher: 'Darussalam Publishers',
      isbn: '978-9960-899-55-8',
      weight: '1.8 lbs',
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
    inStock: true,
    stockQuantity: 60,
    description: 'Engaging Islamic stories for children with beautiful illustrations',
    fullDescription: 'This beautifully illustrated book contains stories of the prophets from Islamic tradition, specially written for children. Each story is presented in an engaging way that helps children understand Islamic values and morals. The book includes stories of Prophet Adam, Noah, Abraham, Moses, Jesus, and Muhammad (peace be upon them all).',
    size: '8.5 x 11 inches',
    pages: 128,
    paper: 'Glossy Paper',
    binding: 'Hardcover',
    specifications: {
      publisher: 'Islamic Foundation',
      isbn: '978-086037-123-4',
      weight: '1.2 lbs',
    },
    tags: ['children', 'prophets', 'stories', 'education', 'islamic values'],
    featured: true
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
    inStock: true,
    stockQuantity: 15,
    description: 'Comprehensive commentary on the Quran by Ibn Kathir',
    fullDescription: 'Tafsir Ibn Kathir is one of the most comprehensive and authentic commentaries on the Quran. This monumental work provides detailed explanations of Quranic verses, including historical context, linguistic analysis, and relevant hadith. The commentary is based on authentic sources and provides deep insights into the meaning and wisdom of the Quran.',
    size: '7 x 10 inches',
    pages: 6000,
    paper: 'Bible Paper',
    binding: 'Hardcover Set (10 Volumes)',
    specifications: {
      publisher: 'Darussalam Publishers',
      isbn: '978-9960-892-75-8',
      weight: '15 lbs',
    },
    tags: ['tafsir', 'quran', 'commentary', 'ibn kathir', 'islamic scholarship'],
    featured: true
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
    inStock: true,
    stockQuantity: 80,
    description: 'Comprehensive collection of authentic Islamic supplications',
    fullDescription: 'Fortress of the Muslim is a comprehensive collection of authentic supplications (duas) from the Quran and Sunnah. This book contains prayers for various occasions and situations in daily life, including morning and evening supplications, prayers for entering and leaving places, and supplications for different life events.',
    size: '5.5 x 8 inches',
    pages: 256,
    paper: 'Standard Paper',
    binding: 'Paperback',
    specifications: {
      publisher: 'Darussalam Publishers',
      isbn: '978-9960-892-91-8',
      weight: '0.8 lbs',
    },
    tags: ['duas', 'supplications', 'prayers', 'daily', 'islamic practice'],
    featured: true
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
    inStock: true,
    stockQuantity: 30,
    description: 'Beautiful Islamic calligraphy art book with Quranic verses',
    fullDescription: 'This stunning book showcases the art of Islamic calligraphy through beautiful reproductions of Quranic verses and Islamic phrases. The book includes historical information about the development of Arabic calligraphy, different styles, and techniques used by master calligraphers throughout Islamic history.',
    size: '9 x 12 inches',
    pages: 180,
    paper: 'Premium Glossy Paper',
    binding: 'Hardcover',
    specifications: {
      publisher: 'Islamic Art Foundation',
      isbn: '978-086037-456-7',
      weight: '2.5 lbs',
    },
    tags: ['calligraphy', 'art', 'arabic', 'quranic verses', 'islamic art'],
    featured: true
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
    inStock: true,
    stockQuantity: 35,
    description: 'Comprehensive guide to Islamic studies and theology',
    fullDescription: 'This comprehensive guide covers various aspects of Islamic studies including theology, jurisprudence, history, and contemporary issues. Written by renowned Islamic scholar Dr. Muhammad Hamidullah, this book provides a thorough understanding of Islamic principles and their application in modern times.',
    size: '6 x 9 inches',
    pages: 480,
    paper: 'Standard Paper',
    binding: 'Hardcover',
    specifications: {
      publisher: 'Islamic Research Institute',
      isbn: '978-086037-789-2',
      weight: '1.6 lbs',
    },
    tags: ['islamic studies', 'theology', 'jurisprudence', 'scholarship', 'education'],
    featured: true
  }
];

const newsletterSubscriptions = [
  { email: 'ahmed.hassan@example.com', name: 'Ahmed Hassan', subscribed: true, subscribedAt: new Date('2024-01-15'), tags: ['quran', 'hadith'] },
  { email: 'fatima.ali@example.com', name: 'Fatima Ali', subscribed: true, subscribedAt: new Date('2024-02-20'), tags: ['children', 'education'] },
  { email: 'omar.khan@example.com', name: 'Omar Khan', subscribed: true, subscribedAt: new Date('2024-03-10'), tags: ['islamic studies', 'theology'] },
  { email: 'aisha.rahman@example.com', name: 'Aisha Rahman', subscribed: false, subscribedAt: new Date('2024-01-05'), unsubscribedAt: new Date('2024-02-15'), tags: ['general'] },
  { email: 'muhammad.ibrahim@example.com', name: 'Muhammad Ibrahim', subscribed: true, subscribedAt: new Date('2024-03-25'), tags: ['tafsir', 'quran'] }
]

const sampleComments = [
  {
    productId: '6899fcbe4dc62e0d8d82e172', // Quran book
    userId: 'user1',
    userName: 'Ahmed Hassan',
    userEmail: 'ahmed.hassan@example.com',
    content: 'Excellent quality Quran with beautiful calligraphy. The paper quality is superb and the binding is very durable. Highly recommended for daily recitation.',
    rating: 5,
    isApproved: true,
    isEdited: false,
    createdAt: new Date('2024-01-20'),
  },
  {
    productId: '6899fcbe4dc62e0d8d82e172', // Quran book
    userId: 'user2',
    userName: 'Fatima Ali',
    userEmail: 'fatima.ali@example.com',
    content: 'This Quran is perfect for my children. The text is clear and easy to read. They love the beautiful cover design.',
    rating: 4,
    isApproved: true,
    isEdited: false,
    createdAt: new Date('2024-02-15'),
  },
  {
    productId: '6899fcbe4dc62e0d8d82e173', // Hadith collection
    userId: 'user3',
    userName: 'Omar Khan',
    userEmail: 'omar.khan@example.com',
    content: 'Comprehensive collection of authentic hadith. The translation is clear and the commentary is very helpful for understanding.',
    rating: 5,
    isApproved: true,
    isEdited: false,
    createdAt: new Date('2024-03-01'),
  },
  {
    productId: '6899fcbe4dc62e0d8d82e174', // Islamic studies book
    userId: 'user4',
    userName: 'Aisha Rahman',
    userEmail: 'aisha.rahman@example.com',
    content: 'Great book for beginners in Islamic studies. The content is well-organized and easy to follow.',
    rating: 4,
    isApproved: false, // Pending approval
    isEdited: false,
    createdAt: new Date('2024-03-20'),
  },
  {
    productId: '6899fcbe4dc62e0d8d82e175', // Children's book
    userId: 'user5',
    userName: 'Muhammad Ibrahim',
    userEmail: 'muhammad.ibrahim@example.com',
    content: 'My kids absolutely love this book! The stories are engaging and the illustrations are beautiful. Perfect for teaching Islamic values.',
    rating: 5,
    isApproved: true,
    isEdited: true,
    editedAt: new Date('2024-03-22'),
    createdAt: new Date('2024-03-18'),
  }
]

async function seedDatabase() {
  try {
    await dbConnect()
    
    // Drop existing collections
    await Product.collection.drop()
    console.log('Dropped existing products collection')
    
    await Newsletter.collection.drop()
    console.log('Dropped existing newsletter collection')
    
    await Comment.collection.drop()
    console.log('Dropped existing comments collection')
    
    // Insert new data
    const insertedProducts = await Product.insertMany(products)
    console.log(`Inserted ${insertedProducts.length} products`)
    
    const insertedNewsletters = await Newsletter.insertMany(newsletterSubscriptions)
    console.log(`Inserted ${insertedNewsletters.length} newsletter subscriptions`)
    
    const insertedComments = await Comment.insertMany(sampleComments)
    console.log(`Inserted ${insertedComments.length} sample comments`)
    
    // Create admin user if it doesn't exist
    const adminEmail = 'admin@islamicbooks.com'
    let adminUser = await User.findOne({ email: adminEmail })
    
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin123', // This will be hashed by the pre-save hook
        role: 'admin',
        phone: '+92-300-1234567',
        addresses: [
          {
            type: 'home',
            address: '123 Islamic Center',
            city: 'Karachi',
            state: 'Sindh',
            zipCode: '75000',
            country: 'Pakistan',
            isDefault: true,
          },
        ],
      })
      
      await adminUser.save()
      console.log('Created admin user:', adminEmail)
    } else {
      console.log('Admin user already exists:', adminEmail)
    }
    
    console.log('Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase(); 