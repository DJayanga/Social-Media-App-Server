import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

// GET a users
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

//Update a User
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res
      .status(403)
      .json("You are not authorized! You can only update your account");
  }
};

//Delete a User
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User has been deleted");
    } catch (error) {
      res.status(500).json({ error });
    }
  } else {
    res
      .status(403)
      .json("You are not authorized! You can only delete your account");
  }
};

// Follow a user
export const followUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("You cannot follow yourself");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};


// Un Follow a user
export const unFollowUser = async (req, res) => {
    const id = req.params.id;
  
    const { currentUserId } = req.body;
  
    if (currentUserId === id) {
      res.status(403).json("You cannot unfollow yourself");
    } else {
      try {
        const unFollowUser = await UserModel.findById(id);
        const unFollowingUser = await UserModel.findById(currentUserId);
  
        if (unFollowUser.followers.includes(currentUserId)) {
          await unFollowUser.updateOne({ $pull: { followers: currentUserId } });
          await unFollowingUser.updateOne({ $pull: { following: id } });
          res.status(200).json("User has been unfollowed");
        } else {
          res.status(403).json("You haven't followed this user");
        }
      } catch (error) {
        res.status(500).json({ error });
      }
    }
  };