import express from "express";
import { UserProfile } from "../models/userProfileModel.js";
import { isAuthenticated } from "../authentication/authMiddleware.js";

const router = express.Router();



// Updating user profile
router.put("/", isAuthenticated, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user._id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Update name, bio, phone, email, password, and profile visibility
    userProfile.name = req.body.name;
    userProfile.bio = req.body.bio;
    userProfile.phone = req.body.phone;
    userProfile.email = req.body.email;
    userProfile.password = req.body.password; // new
    userProfile.profileVisibility = req.body.profileVisibility;

    // If the request contains a photo, update the photo field
    if (req.body.photo) {
      userProfile.photo = req.body.photo;
    }

    await userProfile.save();
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Get user profile
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ user: req.user._id });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Checking if the profile is public, the user is viewing their own profile, or the user is an admin
    if (userProfile.profileVisibility === "public" || req.user._id.toString() === userProfile.user.toString() || (req.user && req.user.role === "admin")) {
      return res.status(200).json(userProfile);
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user profile by username
router.get("/:username", isAuthenticated, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ username: req.params.username });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Checking if the profile is public, the user is viewing their own profile, or the user is an admin
    if (userProfile.profileVisibility === "public" || req.user._id.toString() === userProfile.user.toString() || (req.user && req.user.role === "admin")) {
      return res.status(200).json(userProfile);
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all user profiles (admin only)
router.get("/all", isAuthenticated, async (req, res) => {
  if (req.user && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const userProfiles = await UserProfile.find({});
    res.status(200).json(userProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});




export default router;
