const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const {
  getNews,
  getNewsById,
  getTrending,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const { protect, admin } = require("../middleware/authMiddleware");

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/trending", getTrending);
router.get("/", getNews);
router.get("/:id", getNewsById);
router.post("/", protect, admin, upload.single("image"), createNews);
router.put("/:id", protect, admin, upload.single("image"), updateNews);
router.delete("/:id", protect, admin, deleteNews);

module.exports = router;
