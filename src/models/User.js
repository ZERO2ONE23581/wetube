import mongoose from "mongoose";
import bcrypt from "bcrypt";

//Define the shape(schema) of the Model
const userSchema = new mongoose.Schema({
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  location: { type: String },
});

//Hash Middleware
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

//Create the Model with schema
const User = mongoose.model("User", userSchema);
export default User;
