import express from "express";
import Post from "../models/Post.js";

const router = express.Router();

// Create Post
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
});

// Get Single Post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post);
});

// Update Post
router.put("/:id", async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete Post
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

export default router;
