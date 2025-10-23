import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  image: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
