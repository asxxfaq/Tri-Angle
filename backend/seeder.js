const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Staff = require('./models/Staff');
const EventType = require('./models/EventType');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // Clear existing
  await User.deleteMany({});
  await EventType.deleteMany({});
  await Staff.deleteMany({});

  // Admin user
  await User.create({
    name: 'TRI-ANGLE Admin',
    email: 'admin@triangle.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
  });
  console.log('✅ Admin created: admin@triangle.com / admin123');

  // Event types
  const events = await EventType.insertMany([
    { name: 'Marriage', description: 'Full wedding ceremony and reception service', icon: '💍', basePrice: 5000, pricePerStaff: 800 },
    { name: 'House Warming', description: 'Grihapravesha ceremony catering service', icon: '🏠', basePrice: 3000, pricePerStaff: 600 },
    { name: 'Engagement', description: 'Ring ceremony and engagement celebration', icon: '💑', basePrice: 3500, pricePerStaff: 700 },
    { name: 'Birthday Party', description: 'Birthday celebrations and parties', icon: '🎂', basePrice: 2000, pricePerStaff: 500 },
    { name: 'Corporate Event', description: 'Office parties and corporate gatherings', icon: '🏢', basePrice: 4000, pricePerStaff: 750 },
    { name: 'Sadya', description: 'Traditional Kerala feast service', icon: '🌿', basePrice: 4500, pricePerStaff: 850 },
    { name: 'Festival', description: 'Festival celebrations and events', icon: '🎊', basePrice: 2500, pricePerStaff: 600 },
    { name: 'Anniversary', description: 'Anniversary celebration catering', icon: '🥂', basePrice: 2500, pricePerStaff: 600 },
  ]);
  console.log(`✅ ${events.length} event types seeded`);

  // Staff members with team image paths
  const staffData = [];
  const maleNames = ['Arjun K', 'Rohit M', 'Vishnu P', 'Ajith KR', 'Arun S', 'Midhun T', 'Santhosh V', 'Naseem A', 'Fahad PK', 'Rahul KP'];
  const femaleNames = ['Priya N', 'Anjali K', 'Divya S', 'Meera P', 'Nithya R', 'Fathima ZS', 'Reshma TK', 'Aiswarya MK', 'Sneha VP', 'Lakshmi C'];
  const skills = ['Serving', 'Food Preparation', 'Table Setting', 'Beverage Service', 'Guest Handling'];
  const colleges = ['NITK Kasaragod', 'KKTM Kodoli', 'GPTC Kasaragod', 'Govt College Kasaragod', 'MGM College'];

  for (let i = 0; i < 10; i++) {
    staffData.push({
      name: maleNames[i],
      gender: 'male',
      photo: `/images/image${i + 1}.jpg`,
      skills: [skills[i % 5], skills[(i + 1) % 5]],
      experience: `${i + 1} years`,
      age: 19 + (i % 4),
      collegeName: colleges[i % 5],
      status: 'active',
      availability: true,
      rating: 4.3 + Math.random() * 0.5,
      totalBookings: Math.floor(Math.random() * 50),
    });
    staffData.push({
      name: femaleNames[i],
      gender: 'female',
      photo: `/images/image${i + 1}.jpg`,
      skills: [skills[(i + 2) % 5], skills[(i + 3) % 5]],
      experience: `${i + 1} years`,
      age: 18 + (i % 4),
      collegeName: colleges[(i + 2) % 5],
      status: 'active',
      availability: true,
      rating: 4.4 + Math.random() * 0.5,
      totalBookings: Math.floor(Math.random() * 40),
    });
  }

  await Staff.insertMany(staffData);
  console.log(`✅ ${staffData.length} staff members seeded`);

  console.log('\n🎉 Database seeded successfully!');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
