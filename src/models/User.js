import mongoose from "mongoose";
import bcrypt from "bcrypt";

//Define the shape(schema) of the Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
});

//Hash Middleware
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

//Create the Model with schema
const User = mongoose.model("User", userSchema);
export default User;
