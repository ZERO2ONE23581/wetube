import mongoose from "mongoose";

//Create schema for model
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },

  //ObjectId (id made by mongoose is unique!)
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, //from 1 user
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" }, //from 1 video
});

//Create the Model with schema
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
