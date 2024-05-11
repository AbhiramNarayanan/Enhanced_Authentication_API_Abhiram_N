import mongoose from "mongoose";
import VisibilitySchema from "./visibilitySchema.js";

const UserProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    photo: String,
    name: String,
    bio: String,
    phone: String,
    email: String,
    profileVisibility: VisibilitySchema,
  },
  {
    timestamps: true,
  }
);

export const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
