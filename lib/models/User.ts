

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "manager", "user"], default: "user" },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
