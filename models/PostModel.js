import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    desc: { type: String },
    likes: [],
    img: { type: String },
  },
  { timestamps: true }
);

var PostModel = mongoose.model("Posts", postSchema);

export default PostModel;