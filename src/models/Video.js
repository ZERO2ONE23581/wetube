import mongoose from "mongoose";

//Create schema for model
const videoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true }, //녹화비디오 mp4 url
  thumbUrl: { type: String, required: true }, //썸네일 jpg파일 url
  title: { type: String, required: true, trim: true, maxlength: 50, uppercase: true },
  description: { type: String, required: true, trim: true, maxlength: 50 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },

  //ObjectId (id made by mongoose is unique!)
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }, //from 1 user.
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], //video has more than 1 comment.
});

//Statics
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

//Create the Model with schema
const Video = mongoose.model("Video", videoSchema);
export default Video;
