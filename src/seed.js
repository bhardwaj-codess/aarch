const mongoose = require('mongoose');
const Profile = require('./models/Profile'); // adjust the path if needed

// Sample data to seed
const profiles = [
  {
    userId: "68c4595907ce123df53a8d78", // generate a dummy ObjectId or use real user IDs
    name: "Sarah Lightman",
    desc: "Classical-Singer",
    rating: 5,
    reviews: 200,
    time: 2,
    category: "Classical-Singer",
    price: 8500,
    image: "images/cardImage1.jpg", // replace with your actual path/URL

  }
];

// MongoDB connection string
const mongoURI = 'mongodb+srv://abhibhardwaj:Webblaze%40123@firstdb.brtukqy.mongodb.net/AARCH'; // replace 'yourdbname' with your DB name

// Seed function
const seedDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing profiles
    await Profile.deleteMany({});
    console.log("Existing profiles removed");

    // Insert seed data
    await Profile.insertMany(profiles);
    console.log("Seed data inserted successfully");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDB();
