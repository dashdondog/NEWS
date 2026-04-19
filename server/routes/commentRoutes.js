const express = require("express");
const router = express.Router();
const {
  getComments,
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/:newsId", getComments);
router.post("/:newsId", createComment);
router.delete("/:id", protect, admin, deleteComment);

module.exports = router;
