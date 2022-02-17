import Video from "../models/Video";
import User from "../models/User";

//ROOT ROUTER
//Home (Read)
export const home = async (req, res) => {
  //1. find the any video ( == database == Video model) that exists => Render 'home' page
  const videos = await Video.find({}).sort({ createdAt: "desc" }).populate("owner");
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
    }).populate("owner");
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
  //4. Connect video with user /// populate fill the owner with real data
  const video = await Video.findById(id).populate("owner");
  //3. Rendering 2 diff pages by existence of the video
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

//Upload (Create)
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  //5. connect Video model to User model;
  /// find the _id (user) => save it to the newVideo => now Video has new owner(user:{_id})
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files; //4. upload video file
  console.log(video, thumb);
  //1. Bring data from template
  const { title, description, hashtags } = req.body;
  //2. Create new Video with the data received and Save the video
  try {
    const newVideo = await Video.create({
      owner: _id, //5.
      fileUrl: video[0].path, //4.
      thumbUrl: thumb[0].path, //4.
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    //6. Connect User model to Video model
    /// find the user (logged in) => save the _id(newVideo) to the user => now user has new video array
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    //3. error handling
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

//Edit (Update)
export const getEdit = async (req, res) => {
  //Bug before; non owner can go to edit page
  //Bug fixed; only the owner of the video can go to edit page
  const {
    user: { _id },
  } = req.session;
  //1. Find the video to edit
  const { id } = req.params;
  const video = await Video.findById(id);
  //2. Render the Edit page
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  console.log(video.owner, _id);
  //3. Bugfix
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/");
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
  const { id } = req.params; //1. find id of the video to delete
  //3. Bugfix
  //Bug fixed; only the owner can delete the video
  const _id = req.session.user._id;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner
    req.flash("error", "You are not the owner of the video.")) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id); //2. delete the video by the id
  return res.redirect("/");
};

//API FOR RECORDING VIEWS
export const registerView = async (req, res) => {
  //the router(controller) does not render any template.
  ///URL doesn't change! (most basic interactive to connect FRONT and BACK)
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404); //sendStatus를 써줘야 연결이 끝남. 아니면 pending된 상태로 남게됨
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200); //200 means ok
};
