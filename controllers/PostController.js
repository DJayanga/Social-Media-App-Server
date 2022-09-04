import mongoose from "mongoose";
import PostModel from "../models/postModel.js";
import UserModel from "../models/UserModel.js";

// Create and Save a new Post

export const CreatePost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json("Post has been created");
  } catch (error) {
    res.status(500).json({ error });
  }
};

//Get a post

export const GetPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update a post

export const UpdatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Delete a post

export const DeletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch {
    res.status(500).json(error);
  }
};

// Like or Unlike a post

export const LikePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);

    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("The post has been unliked");
    }
  } catch {
    res.status(500).json(error);
  }
};

//Get timeline posts

export const GetTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(currentUserPosts.concat(...followingPosts[0].followingPosts));
      scrollTo((a,b)=>{
        return b.createdAt -a.createdAt;
      })
  } catch {
    res.status(500).json(error);
  }
};
