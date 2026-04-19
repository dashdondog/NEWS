const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Connect to MongoDB
connectDB();

const app = express();
app.set("trust proxy", true);

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://news-two-jade-76.vercel.app", // Энд өөрийн Vercel хаягийг нэмээрэй
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Device-Id"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/comments", commentRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
