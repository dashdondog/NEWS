require("dotenv").config();
const mongoose = require("mongoose");
const News = require("../models/News");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await News.updateMany({}, { $set: { views: 0, viewedBy: [] } });
    console.log(`Reset views on ${result.modifiedCount} news articles`);
  } catch (err) {
    console.error("Reset failed:", err);
  } finally {
    await mongoose.disconnect();
  }
})();
