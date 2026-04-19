const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    news: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 50 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

commentSchema.index({ news: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
