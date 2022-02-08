import Video from "../models/Video";

//rootRouter
export const home = (req, res) => {
  //solution1 Call-back
  console.log("start");
  //mongoose will find {} from db then, activates the function after it's done
  Video.find({}, (error, videos) => {
    console.log("error", error); // error null
    console.log("videos", videos); // videos []
  });
  console.log("finish");
  /// you can see the order in console => start -> finish -> error null, videos []
  res.render("home", { pageTitle: "HOME", videos: [] });
};
export const search = (req, res) => {
  res.send("SEARCH VIDEO");
};
//videoRouter
export const watch = (req, res) => {
  console.log(req.params);
  res.send("WATCH VIDEO");
};
export const upload = (req, res) => {
  res.send("UPLOAD VIDEO");
};
export const editVideo = (req, res) => {
  res.send("EDIT VIDEO");
};
export const deleteVideo = (req, res) => {
  res.send("DELETE VIDEO");
};
