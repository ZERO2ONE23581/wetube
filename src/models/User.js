import mongoose from "mongoose";

//Define the shape(schema) of the Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String },
});

//Create the Model with schema
const User = mongoose.model("User", userSchema);
export default User;
