import mongoose from "mongoose";
import bcrypt from "bcrypt";

//Create schema for model
const userSchema = new mongoose.Schema({
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  location: { type: String },

  //ObjectId (id made by mongoose is unique!)
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }], //user had more than 1 video.
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], //user has more than 1 comment.
});

//Hash Middleware
userSchema.pre("save", async function () {
  //Bug before; pw is hashed whenever you upload the new video so the user can't login after
  //Bug fixed; code below enables to hash only when it's modified
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

//Create the Model with schema
const User = mongoose.model("User", userSchema);
export default User;
