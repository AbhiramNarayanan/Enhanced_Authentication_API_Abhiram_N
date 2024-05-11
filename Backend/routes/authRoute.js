import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";

const router = express.Router();

// Route for initiating Google OAuth authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route for handling Google OAuth callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  // Redirect user after successful authentication
  res.redirect("/profile");
});





// Route for username/password authentication
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for registering a new user
router.post("/register", async (req, res) => {
  try {
    const { username, password, profileVisibility } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      profileVisibility,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.log('Error: Failed to destroy the session during logout.', err);
        return res.status(500).json({ message: 'Failed to destroy the session during logout.' });
      }
      return res.redirect("/");
    });
  });
});


export default router;
