const Comment = require("../models/Comment");

// GET /api/comments/:newsId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ news: req.params.newsId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/comments/:newsId
const createComment = async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Нэр болон сэтгэгдэл заавал байх ёстой" });
    }
    const comment = await Comment.create({
      news: req.params.newsId,
      name: name.trim(),
      content: content.trim(),
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/comments/:id  (admin)
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getComments, createComment, deleteComment };
