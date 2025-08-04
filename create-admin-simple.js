const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food-blog");

// User Schema (simplified for this script)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Add password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
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
      console.log("✅ Admin user already exists");
      console.log("Email:", adminData.email);
      console.log("Password:", adminData.password);
      await mongoose.connection.close();
      return;
    }

    // Create new admin user
    const admin = new User(adminData);
    await admin.save();

    console.log("✅ Admin user created successfully");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin(); 