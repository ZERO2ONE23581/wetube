import Video from "../models/Video";

//ROOT ROUTER
//Home (Read)
export const home = async (req, res) => {
  //1. find the any video ( == database == Video model) that exists => Render 'home' page
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "HOME", videos });
};

//Search
export const search = async (req, res) => {
  //1. receive data from form(method="GET") by using 'req.query'
  const { keyword } = req.query;
  //2. find the video where the name of the 'title' is same as the 'keyword'
  let videos = []; //update the videos array
  if (keyword) {
    videos = await Video.find({
      //await을 안붙여주면 비디오찾기전에 렌더링이 시작되어 오류를 볼수있음!
      title: {
        $regex: new RegExp(keyword, "i"), //$regex is MongoDB operator!
      },
    });
  }
  //3. render 'search' page with result
  return res.render("search", { pageTitle: "Search Video", videos });
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
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

//Upload (Create)
export const getUpload = (req, res) => {
  //1. Render 'upload' page
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  //7. upload video file
  const { path } = req.file;
  //2. Data received from 'upload' page
  const { title, description, hashtags } = req.body;
  //3. Create new Video; (Data from POST -> Video Model)
  //4. Save the video at the same time
  try {
    await Video.create({
      fileUrl: path,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    //5. redirect to the page
    return res.redirect("/");
  } catch (error) {
    //6. error handling
    return res.status(400).render("upload", {
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
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
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
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  //3. Edit the video with received data
  // this is the "Video model" that you created(and will update)
  await Video.findByIdAndUpdate(id, {
    //4. this query will automatically save the data
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  //5. Redirect to the 'watch' page
  return res.redirect(`/videos/${id}`);
};

//Delete
export const deleteVideo = async (req, res) => {
  const { id } = req.params; //1. find id the video to delete
  await Video.findByIdAndDelete(id); //2. delete the video by the id
  return res.redirect("/");
};
