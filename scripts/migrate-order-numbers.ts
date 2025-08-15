import dbConnect from '../lib/db';
import Order from '../models/Order';
import { generateOrderNumber } from '../lib/utils';

async function migrateOrderNumbers() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Find all orders without order numbers or with old format
    const ordersToUpdate = await Order.find({
      $or: [
        { orderNumber: { $exists: false } },
        { orderNumber: { $regex: /^ORD-/ } } // Old format
      ]
    });
    
    console.log(`Found ${ordersToUpdate.length} orders to update`);

    if (ordersToUpdate.length === 0) {
      console.log('All orders already have new format order numbers');
      process.exit(0);
    }

    // Generate and assign new order numbers
    for (const order of ordersToUpdate) {
      const orderNumber = generateOrderNumber();
      
      // Ensure uniqueness by checking if this order number already exists
      let isUnique = false;
      let attempts = 0;
      let finalOrderNumber = orderNumber;
      
      while (!isUnique && attempts < 10) {
        const existingOrder = await Order.findOne({ orderNumber: finalOrderNumber });
        if (!existingOrder) {
          isUnique = true;
        } else {
          finalOrderNumber = generateOrderNumber();
          attempts++;
        }
      }
      
      await Order.findByIdAndUpdate(order._id, { orderNumber: finalOrderNumber });
      console.log(`Updated order ${order._id} with order number: ${finalOrderNumber}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateOrderNumbers();
