import mongoose from "mongoose";

//Define the shape(schema) of the Model
const videoSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  createdAt: Date,
  hashtags: [{ type: String }], //hashtags는 복수임으로 array 형태
  meta: {
    views: { type: Number },
    rating: { type: Number },
  },
});

//Create the Model with schema
const Video = mongoose.model("Video", videoSchema);
export default Video;
