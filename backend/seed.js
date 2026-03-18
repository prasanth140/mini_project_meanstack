require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const RequestLog = require('./models/RequestLog');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Get the first user to assign ownership
    const user = await User.findOne();
    if (!user) {
      console.log('Error: No user found. Please register an account in the app first!');
      process.exit(1);
    }

    // 2. Clear existing sample data (Optional - keeps it clean)
    await Service.deleteMany({ category: 'internal' });
    // await RequestLog.deleteMany({}); // Don't delete everything, just add to it

    console.log('Creating sample services...');
    const services = await Service.insertMany([
      {
        name: 'Authentication API',
        description: 'Handles user login and JWT generation',
        endpoint: 'https://api.servicehub.io/v1/auth',
        method: 'POST',
        category: 'internal',
        environment: 'production',
        owner: user._id
      },
      {
        name: 'Payment Gateway',
        description: 'Stripe integration for processing transactions',
        endpoint: 'https://api.stripe.com/v1/charges',
        method: 'POST',
        category: 'external',
        environment: 'production',
        owner: user._id
      },
      {
        name: 'Inventory Sync',
        description: 'Warehouse stock synchronization service',
        endpoint: 'https://inventory.local/sync',
        method: 'GET',
        category: 'internal',
        environment: 'dev',
        owner: user._id
      }
    ]);

    console.log('Generating request history for the last 7 days...');
    const logs = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Generate 10-20 requests per day
      const dailyCount = Math.floor(Math.random() * 15) + 10;
      
      for (let j = 0; j < dailyCount; j++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const isSuccess = Math.random() > 0.15; // 85% success rate
        
        logs.push({
          serviceId: service._id,
          serviceName: service.name,
          method: service.method,
          endpoint: service.endpoint,
          status: isSuccess ? 200 : (Math.random() > 0.5 ? 404 : 500),
          responseTime: Math.floor(Math.random() * 400) + 50, // 50-450ms
          timestamp: new Date(date.getTime() + Math.random() * 86400000),
          initiatedBy: user._id
        });
      }
    }

    await RequestLog.insertMany(logs);
    console.log(`Successfully seeded ${services.length} services and ${logs.length} logs!`);
    
    console.log('\n🚀 Dashboard is now ready with live-looking data!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
