const News = require("../models/News");

// GET /api/news
const getNews = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, featured } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (featured === "true") {
      query.featured = true;
    }

    const total = await News.countDocuments(query);
    const news = await News.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      news,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error("Error in newsController:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/news/:id
const getNewsById = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === "admin";

    if (isAdmin) {
      const news = await News.findById(req.params.id).populate("category", "name");
      if (!news) return res.status(404).json({ message: "News not found" });
      return res.json(news);
    }

    const identifier = req.user ? `user:${req.user._id}` : `ip:${req.ip}`;

    const news = await News.findOneAndUpdate(
      { _id: req.params.id, viewedBy: { $ne: identifier } },
      { $inc: { views: 1 }, $push: { viewedBy: identifier } },
      { new: true }
    ).populate("category", "name");

    if (news) {
      return res.json(news);
    }

    const existing = await News.findById(req.params.id).populate("category", "name");
    if (!existing) return res.status(404).json({ message: "News not found" });
    return res.json(existing);
  } catch (error) {
    console.error("Error in newsController:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/news/trending
const getTrending = async (req, res) => {
  try {
    const news = await News.find()
      .populate("category", "name")
      .sort({ views: -1 })
      .limit(5);
    res.json(news);
  } catch (error) {
    console.error("Error in newsController:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/news
const createNews = async (req, res) => {
  try {
    const { title, content, category, author, featured } = req.body;
    const image = req.file ? req.file.path : "";

    const news = await News.create({
      title,
      content,
      image,
      category,
      author,
      featured: featured === "true",
    });

    const populated = await news.populate("category", "name");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error in newsController:", error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/news/:id
const updateNews = async (req, res) => {
  try {
    const { title, content, category, author, featured } = req.body;
    const updateData = { title, content, category, author, featured: featured === "true" };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("category", "name");

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    console.error("Error in newsController:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/news/:id
const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNews,
  getNewsById,
  getTrending,
  createNews,
  updateNews,
  deleteNews,
};
