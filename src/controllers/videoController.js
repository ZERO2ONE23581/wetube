import Video from "../models/Video";

//rootRouter
export const home = async (req, res) => {
  //PROMISE
  try {
    //1. find the db(model)
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "HOME", videos });
  } catch {
    //2. error handling
    return res.render("server-error");
  }
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
