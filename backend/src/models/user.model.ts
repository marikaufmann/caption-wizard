import mongoose from "mongoose";
import { UserType } from "../shared/types";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  return next();
});
const UserModel = mongoose.model<UserType>("User", userSchema);
export default UserModel;
