const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Category = require("./models/Category");
const News = require("./models/News");

const connectDB = require("./config/db");

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await News.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: "Admin",
      email: "admin@mnnews.mn",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin user created: admin@mnnews.mn / admin123");

    // Create categories
    const categories = await Category.insertMany([
      { name: "Технологи", description: "Технологийн мэдээ мэдээлэл" },
      { name: "Спорт", description: "Спортын мэдээ" },
      { name: "Боловсрол", description: "Боловсролын мэдээ" },
      { name: "Улс төр", description: "Улс төрийн мэдээ" },
      { name: "Эдийн засаг", description: "Эдийн засгийн мэдээ" },
    ]);

    console.log("Categories created:", categories.map((c) => c.name).join(", "));

    // Create sample news
    const sampleNews = [
      {
        title: "Монголд 5G сүлжээ нэвтрүүлэх төлөвлөгөө",
        content:
          "<p>Монгол Улсад 5G сүлжээг 2026 оноос эхлэн нэвтрүүлэх төлөвлөгөөтэй байна. Харилцаа холбооны зохицуулах хороо болон холбогдох байгууллагууд хамтран ажиллаж байна.</p><p>5G технологи нь өнөөгийн 4G сүлжээнээс 100 дахин хурдан бөгөөд IoT, ухаалаг хот, алсын зайн эмнэлэг зэрэг салбарт шинэ боломж нээх юм.</p>",
        image: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=600",
        category: categories[0]._id,
        author: "Admin",
        featured: true,
        views: 245,
      },
      {
        title: "Монголын шигшээ баг ФИФА-гийн чансааг ахиулав",
        content:
          "<p>Монголын хөлбөмбөгийн шигшээ баг ФИФА-гийн сүүлийн чансаанд байрлалаа 5 алхамаар ахиулж чадлаа. Энэ нь сүүлийн хэдэн тоглолтын амжилттай үр дүнтэй холбоотой юм.</p>",
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600",
        category: categories[1]._id,
        author: "Admin",
        featured: false,
        views: 189,
      },
      {
        title: "Их дээд сургуулиудын элсэлтийн шалгалт эхэллээ",
        content:
          "<p>2026 оны их дээд сургуулиудын элсэлтийн ерөнхий шалгалт энэ сарын 15-наас эхэллээ. Нийт 30,000 гаруй сурагч шалгалтанд бүртгүүлсэн байна.</p>",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600",
        category: categories[2]._id,
        author: "Admin",
        featured: true,
        views: 312,
      },
    ];

    await News.insertMany(sampleNews);
    console.log("Sample news created:", sampleNews.length, "articles");

    console.log("\nSeed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
