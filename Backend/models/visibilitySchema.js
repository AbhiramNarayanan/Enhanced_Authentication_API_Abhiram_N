import mongoose from "mongoose";

const VisibilitySchema = mongoose.Schema({
  profileVisibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
});

export default VisibilitySchema;
