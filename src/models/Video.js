import mongoose from "mongoose";

//Define the shape(schema) of the Model
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 50, uppercase: true },
  description: { type: String, required: true, trim: true, maxlength: 50 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }], //hashtags는 복수임으로 array 형태
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

//Middleware ///activates before you save Model
videoSchema.pre("save", async function () {
  console.log(this);
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

//Create the Model with schema
const Video = mongoose.model("Video", videoSchema);
export default Video;
