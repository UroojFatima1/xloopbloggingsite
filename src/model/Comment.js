import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    blogId: { type: String, required: true },
    author: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
