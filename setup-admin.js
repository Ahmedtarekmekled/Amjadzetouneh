#!/usr/bin/env node

const mongoose = require("mongoose");
require("dotenv").config();

// Import the User model
const User = require("./food-blog-backend/src/models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const adminData = {
      username: "amjad",
      email: "amjad@gmail.com",
      password: "admin123",
      isAdmin: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin user already exists");
      console.log("Email:", adminData.email);
      console.log("Password:", adminData.password);
      await mongoose.connection.close();
      return;
    }

    // Create new admin user
    const admin = new User(adminData);
    await admin.save();

    console.log("Admin user created successfully");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin(); 