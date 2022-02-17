import mongoose from "mongoose";

//Define the shape(schema) of the Model
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
  //owner == object id
  //ref tells mongoose that the id we're gonna save is from User model
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

//Statics
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
});

//Create the Model with schema
const Video = mongoose.model("Video", videoSchema);
export default Video;
