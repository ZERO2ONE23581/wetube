import Video from "../models/Video";

//ROOT ROUTER
//Home (Read)
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
//VIDEO ROUTER
//Watch (Read)
export const watch = (req, res) => {
  console.log(req.params);
  res.send("WATCH VIDEO");
};

//Upload (Create)
export const getUpload = (req, res) => {
  res.render("upload");
};
export const postUpload = (req, res) => {
  //1. get data from form in template using POST method
  const { title, description, hashtags } = req.body;
  //2. create Document(video with data)
  const video = new Video({
    title: title,
    description: description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
  });
  console.log(video);
  //3. save the document in db
  //4. redirect to the page
  res.redirect("/");
};

//Edit (Upldate)
export const editVideo = (req, res) => {
  res.send("EDIT VIDEO");
};

//Delete
export const deleteVideo = (req, res) => {
  res.send("DELETE VIDEO");
};
