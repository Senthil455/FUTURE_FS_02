require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Lead = require('./models/Lead');

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Lead.deleteMany({});

  const admin = await User.create({
    username: 'admin',
    email: 'admin@crm.com',
    password: 'admin123',
  });

  console.log(`Admin user created: admin@crm.com / admin123`);

  const sampleLeads = [
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', source: 'website', status: 'new' },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', source: 'referral', status: 'contacted' },
    { name: 'Carol White', email: 'carol@example.com', phone: '555-0103', source: 'social_media', status: 'converted' },
    { name: 'David Brown', email: 'david@example.com', phone: '555-0104', source: 'email_campaign', status: 'new' },
    { name: 'Eva Green', email: 'eva@example.com', phone: '555-0105', source: 'website', status: 'contacted' },
  ];

  const createdLeads = await Lead.insertMany(sampleLeads);

  await Lead.findByIdAndUpdate(createdLeads[1]._id, {
    $push: {
      notes: {
        content: 'Called Bob, interested in the product. Will follow up next week.',
        createdBy: admin._id,
      },
    },
  });

  await Lead.findByIdAndUpdate(createdLeads[2]._id, {
    $push: {
      notes: {
        content: 'Carol signed the contract. Welcome aboard!',
        createdBy: admin._id,
      },
    },
  });

  console.log('Sample leads created with notes');
  console.log('Seeding complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
