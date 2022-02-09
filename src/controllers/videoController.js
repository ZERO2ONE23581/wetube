import Video from "../models/Video";

//ROOT ROUTER
//Home (Read)
export const home = async (req, res) => {
  //1. find the any video ( == database == Video model) that exists => Render 'home' page
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "HOME", videos });
};

//Search
export const search = (req, res) => {
  res.send("SEARCH VIDEO");
};

//VIDEO ROUTER
//Watch (Read)
export const watch = async (req, res) => {
  //1. Get id from paramter
  const { id } = req.params;
  //2. Find the video with the id
  const video = await Video.findById(id);
  //3. Rendering 2 diff pages by existence of the video
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

//Upload (Create)
export const getUpload = (req, res) => {
  //1. Render 'upload' page
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  //2. Data received from 'upload' page
  const { title, description, hashtags } = req.body;
  //3. Create new Video; (Data from POST -> Video Model)
  //4. Save the video at the same time
  try {
    await Video.create({
      title,
      description,
      hashtags,
    });
    //5. redirect to the page
    return res.redirect("/");
  } catch (error) {
    //6. error handling
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

//Edit (Update)
export const getEdit = async (req, res) => {
  //1. Find the video to edit
  const { id } = req.params;
  const video = await Video.findById(id);
  //2. Render the Edit page
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("edit", { pageTitle: video.title, video });
};
export const postEdit = async (req, res) => {
  //1. Receive data from Edit page
  const { title, description, hashtags } = req.body;
  //2. find the video to edit by id and using exists()
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  //when there's the video that has same _id as the one(==id) from parameter => it returns TRUE
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found." });
  }
  //3. Edit the video with received data
  // this is the "Video model" that you created(and will update)
  await Video.findByIdAndUpdate(id, {
    //4. this query will automatically save the data
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`)),
  });
  //5. Redirect to the 'watch' page
  return res.redirect(`/videos/${id}`);
};

//Delete
export const deleteVideo = (req, res) => {
  res.send("DELETE VIDEO");
};
