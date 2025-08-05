import mongoose from "mongoose";
import Post from "../models/Post";
import User from "../models/User";

const createSamplePosts = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/food-blog");
    console.log("✅ Connected to MongoDB");

    // Find or create admin user
    let adminUser = await User.findOne({ email: "amjad@gmail.com" });
    if (!adminUser) {
      console.log("👤 Creating admin user...");
      adminUser = await User.create({
        username: "amjad",
        email: "amjad@gmail.com",
        password: "admin123",
        isAdmin: true,
      });
      console.log("✅ Admin user created");
    } else {
      console.log("✅ Admin user found");
    }

    // Check if posts already exist
    const existingPosts = await Post.countDocuments();
    if (existingPosts > 0) {
      console.log(`📝 Found ${existingPosts} existing posts`);
      return;
    }

    console.log("📝 Creating sample posts...");

    const samplePosts = [
      {
        title: {
          en: "Delicious Homemade Pizza",
          ar: "بيتزا منزلية لذيذة",
        },
        excerpt: {
          en: "Learn how to make the perfect homemade pizza with fresh ingredients",
          ar: "تعلم كيفية صنع البيتزا المثالية في المنزل بمكونات طازجة",
        },
        content: {
          en: {
            title: "Delicious Homemade Pizza",
            content: "This is a detailed recipe for making homemade pizza...",
            metaTitle: "Homemade Pizza Recipe",
            metaDescription: "Learn to make perfect homemade pizza",
            keywords: ["pizza", "homemade", "recipe", "italian"],
          },
          ar: {
            title: "بيتزا منزلية لذيذة",
            content: "هذه وصفة مفصلة لصنع البيتزا في المنزل...",
            metaTitle: "وصفة البيتزا المنزلية",
            metaDescription: "تعلم صنع البيتزا المثالية في المنزل",
            keywords: ["بيتزا", "منزلية", "وصفة", "إيطالية"],
          },
        },
        categories: ["main-dishes"],
        tags: ["pizza", "italian", "homemade"],
        status: "published",
        prepTime: 30,
        cookTime: 20,
        difficulty: "medium",
        servings: 4,
        calories: 300,
        slug: "delicious-homemade-pizza",
        author: adminUser._id,
      },
      {
        title: {
          en: "Fresh Garden Salad",
          ar: "سلطة حديقة طازجة",
        },
        excerpt: {
          en: "A refreshing salad with fresh vegetables from the garden",
          ar: "سلطة منعشة مع خضروات طازجة من الحديقة",
        },
        content: {
          en: {
            title: "Fresh Garden Salad",
            content: "This is a refreshing salad recipe...",
            metaTitle: "Fresh Garden Salad Recipe",
            metaDescription: "Healthy and refreshing garden salad",
            keywords: ["salad", "healthy", "vegetables", "fresh"],
          },
          ar: {
            title: "سلطة حديقة طازجة",
            content: "هذه وصفة سلطة منعشة...",
            metaTitle: "وصفة سلطة الحديقة الطازجة",
            metaDescription: "سلطة حديقة صحية ومنعشة",
            keywords: ["سلطة", "صحية", "خضروات", "طازجة"],
          },
        },
        categories: ["salads"],
        tags: ["salad", "healthy", "vegetables"],
        status: "published",
        prepTime: 15,
        cookTime: 0,
        difficulty: "easy",
        servings: 2,
        calories: 150,
        slug: "fresh-garden-salad",
        author: adminUser._id,
      },
      {
        title: {
          en: "Chocolate Cake",
          ar: "كيك الشوكولاتة",
        },
        excerpt: {
          en: "A decadent chocolate cake that's perfect for celebrations",
          ar: "كيك شوكولاتة فاخر مثالي للاحتفالات",
        },
        content: {
          en: {
            title: "Chocolate Cake",
            content: "This is a decadent chocolate cake recipe...",
            metaTitle: "Chocolate Cake Recipe",
            metaDescription: "Decadent chocolate cake for celebrations",
            keywords: ["cake", "chocolate", "dessert", "celebration"],
          },
          ar: {
            title: "كيك الشوكولاتة",
            content: "هذه وصفة كيك شوكولاتة فاخر...",
            metaTitle: "وصفة كيك الشوكولاتة",
            metaDescription: "كيك شوكولاتة فاخر للاحتفالات",
            keywords: ["كيك", "شوكولاتة", "حلويات", "احتفال"],
          },
        },
        categories: ["desserts"],
        tags: ["cake", "chocolate", "dessert"],
        status: "published",
        prepTime: 45,
        cookTime: 35,
        difficulty: "medium",
        servings: 8,
        calories: 400,
        slug: "chocolate-cake",
        author: adminUser._id,
      },
    ];

    for (const postData of samplePosts) {
      await Post.create(postData);
      console.log(`✅ Created post: ${postData.title.en}`);
    }

    console.log("🎉 Sample posts created successfully!");
  } catch (error) {
    console.error("❌ Error creating sample posts:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run the script
createSamplePosts(); 