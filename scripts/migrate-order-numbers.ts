import dbConnect from '../lib/db';
import Order from '../models/Order';
import { generateOrderNumber } from '../lib/utils';

async function migrateOrderNumbers() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Find all orders without order numbers
    const ordersWithoutNumbers = await Order.find({ orderNumber: { $exists: false } });
    console.log(`Found ${ordersWithoutNumbers.length} orders without order numbers`);

    if (ordersWithoutNumbers.length === 0) {
      console.log('All orders already have order numbers');
      process.exit(0);
    }

    // Generate and assign order numbers
    for (const order of ordersWithoutNumbers) {
      const orderNumber = generateOrderNumber();
      await Order.findByIdAndUpdate(order._id, { orderNumber });
      console.log(`Updated order ${order._id} with order number: ${orderNumber}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateOrderNumbers();
