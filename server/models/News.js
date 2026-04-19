const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    author: { type: String, required: true },
    views: { type: Number, default: 0 },
    viewedBy: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("News", newsSchema);
