// models/User.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        tags: { type: Array, required: false },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        blogType: { type: String, enum:["public", "private"], default: "public" },
    },
    { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
