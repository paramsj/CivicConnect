import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

if (fs.existsSync('./.env')) {
    dotenv.config({ path: './.env' });
} else if (fs.existsSync('../.env')) {
    dotenv.config({ path: '../.env' });
} else if (fs.existsSync('../../.env')) {
    dotenv.config({ path: '../../.env' });
} else {
    dotenv.config();
}

import { Report } from '../src/models/report.model.js';
import { User } from '../src/models/user.model.js';

// Jharkhand locations
const jharkhandLocations = [
  { name: "Ranchi", lat: 23.3441, lng: 85.3096 },
  { name: "Jamshedpur", lat: 22.8046, lng: 86.2029 },
  { name: "Dhanbad", lat: 23.7957, lng: 86.4304 },
  { name: "Bokaro Steel City", lat: 23.6693, lng: 86.1511 },
  { name: "Deoghar", lat: 24.4823, lng: 86.6961 },
  { name: "Hazaribagh", lat: 23.9929, lng: 85.3647 },
  { name: "Giridih", lat: 24.1854, lng: 86.3000 },
  { name: "Ramgarh", lat: 23.6309, lng: 85.5193 },
  { name: "Medininagar (Daltonganj)", lat: 24.0167, lng: 84.0833 },
  { name: "Chatra", lat: 24.2092, lng: 84.8728 },
  { name: "Gumla", lat: 23.0436, lng: 84.5408 },
  { name: "Chaibasa", lat: 22.5562, lng: 85.8066 },
  { name: "Dumka", lat: 24.2676, lng: 87.2497 },
  { name: "Godda", lat: 24.8335, lng: 87.2142 },
  { name: "Sahibganj", lat: 25.2425, lng: 87.6464 },
  { name: "Pakur", lat: 24.6340, lng: 87.8492 },
  { name: "Lohardaga", lat: 23.4333, lng: 84.6833 },
  { name: "Simdega", lat: 22.6173, lng: 84.5113 },
  { name: "Khunti", lat: 23.0817, lng: 85.2784 },
  { name: "Saraikela", lat: 22.7000, lng: 85.9167 },
  { name: "Jamtara", lat: 23.9618, lng: 86.8025 },
  { name: "Koderma", lat: 24.4681, lng: 85.5947 },
  { name: "Latehar", lat: 23.7441, lng: 84.4999 },
  { name: "Garhwa", lat: 24.1594, lng: 83.8094 },
  { name: "Palamu", lat: 24.0167, lng: 84.0833 },
];

// Category data
const categoryData = {
  "potholes": {
    department: "Public Works Department",
    defaultSeverity: "high",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758462888/ttjbzvqibhs4kbbmpy37.jpg"
    ]
  },
  "garbage": {
    department: "Sanitation Department",
    defaultSeverity: "high",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758396762/qrpuiiaegsucpgbo3onf.jpg"
    ]
  },
  "construction road": {
    department: "Public Works Department",
    defaultSeverity: "medium",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758396762/qrpuiiaegsucpgbo3onf.jpg"
    ]
  },
  "broken signage": {
    department: "Infrastructure Department",
    defaultSeverity: "medium",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758465350/Untitled_rimghm.jpg"
    ]
  },
  "bad streetlight": {
    department: "Infrastructure Department",
    defaultSeverity: "medium",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758395553/z39vg93xjz8drflfuwmb.jpg"
    ]
  },
  "bad billboard": {
    department: "Advertising & Infrastructure",
    defaultSeverity: "medium",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758369726/wjvy2e3wgodpwpytw52x.jpg"
    ]
  },
  "graffiti": {
    department: "Municipal Art & Cleaning",
    defaultSeverity: "low",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758465426/Untitled_b3h6ix.jpg"
    ]
  },
  "faded signage": {
    department: "Infrastructure Department",
    defaultSeverity: "low",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758465296/Untitled_ozzckl.jpg"
    ]
  },
  "sand on road": {
    department: "Public Works Department",
    defaultSeverity: "low",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758465616/Untitled_lymgeg.jpg"
    ]
  },
  "clutter sidewalk": {
    department: "Sanitation Department",
    defaultSeverity: "low",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758465616/Untitled_lymgeg.jpg"
    ]
  },
  "unkept facade": {
    department: "Urban Planning / General Services",
    defaultSeverity: "low",
    imagePaths: [
        "https://res.cloudinary.com/dhkyxozav/image/upload/v1758465616/Untitled_lymgeg.jpg"
    ]
  }
};

// Descriptions
const descriptions = {
  "potholes": [
    "Large pothole on main road causing vehicle damage",
    "Deep pothole filled with water after rain",
    "Multiple potholes in a row making road dangerous",
    "Pothole near school zone posing safety risk",
    "Emergency pothole repair needed immediately"
  ],
  "garbage": [
    "Overflowing garbage bins attracting animals",
    "Garbage scattered across the street",
    "Uncollected waste for several days",
    "Medical waste improperly disposed",
    "Construction debris mixed with household waste"
  ],
  "construction road": [
    "Road construction abandoned midway",
    "Construction materials blocking traffic",
    "Poor quality road work showing cracks",
    "Construction site without safety barriers",
    "Road digging affecting daily commute"
  ],
  "broken signage": [
    "Critical traffic sign completely damaged",
    "Important road direction sign unreadable",
    "Warning sign for dangerous curve fallen",
    "Street name identification board broken",
    "Bus stop information board damaged"
  ],
  "bad streetlight": [
    "Street light not functioning for weeks",
    "Broken street light pole creating hazard",
    "Flickering lights causing disturbance",
    "Street light fallen on ground",
    "Entire street without working lights"
  ],
  "bad billboard": [
    "Large billboard tilting dangerously",
    "Billboard partially collapsed",
    "Torn sections flapping in wind",
    "Illegal billboard blocking road signs",
    "Old billboard needing replacement"
  ],
  "graffiti": [
    "Extensive graffiti on government building",
    "Public bus stop walls defaced",
    "Historical monument vandalized",
    "School boundary walls covered in graffiti",
    "Offensive graffiti requiring removal"
  ],
  "faded signage": [
    "Critical traffic sign completely faded",
    "Important road safety text invisible",
    "Street name identification washed out",
    "Essential public facility directions faded",
    "Bus route information unreadable"
  ],
  "sand on road": [
    "Construction sand scattered on road",
    "Sand blocking drainage system",
    "Loose sand making road slippery",
    "Sand pile abandoned on public road",
    "Wind-blown sand covering street"
  ],
  "clutter sidewalk": [
    "Sidewalk completely blocked by stalls",
    "Construction materials on walkway",
    "Vehicles parked on sidewalk",
    "Garbage collection bins blocking path",
    "Abandoned furniture on sidewalk"
  ],
  "unkept facade": [
    "Government office building deteriorating",
    "Commercial complex walls damaged",
    "Public school facade in poor condition",
    "Residential society wall crumbling",
    "Hospital building exterior needing repair"
  ]
};

// Utility functions
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const addRandomOffset = (coord) => coord + (Math.random() - 0.5) * 0.01;

// Generate users function
const generateUsers = (count = 100) => {
  const users = [];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com'];
  const firstNames = [
    'Rajesh', 'Priya', 'Amit', 'Sunita', 'Ravi', 'Meera', 'Suresh', 'Kavita', 'Anil', 'Pooja',
    'Vikash', 'Sita', 'Manoj', 'Rekha', 'Ramesh', 'Geeta', 'Santosh', 'Lata', 'Deepak', 'Usha',
    'Ajay', 'Shanti', 'Mukesh', 'Rita', 'Prakash', 'Manju', 'Rohit', 'Sushma', 'Naresh', 'Kiran',
    'Satish', 'Nisha', 'Ashok', 'Prabha', 'Dinesh', 'Saroj', 'Vinod', 'Kamala', 'Jitendra', 'Pushpa'
  ];
  const lastNames = [
    'Kumar', 'Singh', 'Sharma', 'Gupta', 'Verma', 'Prasad', 'Rai', 'Mishra', 'Pandey', 'Tiwari',
    'Jha', 'Sinha', 'Thakur', 'Mahto', 'Sahu', 'Yadav', 'Mandal', 'Das', 'Roy', 'Bhagat'
  ];

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const domain = getRandomElement(domains);
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    
    users.push({
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`,
      password: 'password123', // Will be hashed by model
      civicSenseScore: Math.floor(Math.random() * 1000) + 50, // Random score between 50-1050
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date())
    });
  }
  
  return users;
};

// Modify generateReportData to assign unique complaintId
const generateReportData = (count = 1500, users = []) => {
  const reports = [];
  const categories = Object.keys(categoryData);
  const progressStates = ['submitted', 'in_progress', 'completed', 'assigned'];
  
  // Date range for reports (last 6 months)
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  const endDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const location = getRandomElement(jharkhandLocations);
    const reportStartDate = getRandomDate(startDate, endDate);
    const progress = getRandomElement(progressStates);
    
    // Get category data
    const catData = categoryData[category];
    
    // Use default severity with some variation (80% default, 20% random)
    let severity = catData.defaultSeverity;
    if (Math.random() < 0.2) {
      const allSeverities = ['low', 'medium', 'high', 'critical'];
      severity = getRandomElement(allSeverities);
    }
    
    // Generate end date only for completed reports
    let reportEndDate = null;
    if (progress === 'completed') {
      const endDateStart = new Date(reportStartDate);
      endDateStart.setDate(endDateStart.getDate() + 1);
      reportEndDate = getRandomDate(endDateStart, endDate);
    }
    
    // Use actual user _id from created users
    const user = getRandomElement(users);
    
    const report = {
      complaintId: i + 1,  // Assign unique complaintId starting from 1
      userId: user._id,  // Use the actual ObjectId
      imageUrl: getRandomElement(catData.imagePaths),
      description: getRandomElement(descriptions[category]),
      location: `${location.name}, Jharkhand`,
      category: category,
      department: catData.department,
      coordinates: {
        lat: addRandomOffset(location.lat),
        lng: addRandomOffset(location.lng)
      },
      severity: severity,
      progress: progress,
      reportStartDate: reportStartDate,
      reportEndDate: reportEndDate
    };
    
    reports.push(report);
  }
  
  return reports;
};

// Seeder function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SIH';
    await mongoose.connect(mongoUri);
    
    console.log('Connected to MongoDB');
    
    // Drop the problematic index if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('userId_1');
      console.log('Dropped userId_1 index');
    } catch (indexError) {
      console.log('Index userId_1 not found or already dropped:', indexError.message);
    }
    
    // Clear existing data
    await Report.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing reports and users');
    
    // Generate and insert users first
    const userData = generateUsers(100);  // Generate 100 users
    const createdUsers = await User.insertMany(userData);
    console.log(`Created ${createdUsers.length} users`);
    
    // Generate and insert seed data with actual user IDs
    const reportData = generateReportData(1500, createdUsers);
    
    // Insert in batches to avoid memory issues
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < reportData.length; i += batchSize) {
      const batch = reportData.slice(i, i + batchSize);
      await Report.insertMany(batch);
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount} reports...`);
    }
    
    console.log(`Successfully seeded ${insertedCount} reports`);
    
    // Update the mongoose-sequence counter to avoid conflicts with future auto-increments
    const maxComplaintId = 1500; // Since we manually set 1-1500
    await mongoose.connection.db.collection('counters').updateOne(
      { _id: 'complaintId' }, // The counter ID used by the plugin
      { $set: { seq: maxComplaintId + 1 } }, // Set to 1501
      { upsert: true }
    );
    console.log('Updated complaintId counter to avoid duplicates');
    
    // Display summary statistics
    const stats = await Report.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          departments: { $addToSet: '$department' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\nSeeding Summary:');
    console.log('================');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} reports (${stat.departments.join(', ')})`);
    });
    
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();