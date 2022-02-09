import Video from "../models/Video";

//ROOT ROUTER
//Home (Read)
export const home = async (req, res) => {
  //PROMISE
  try {
    //1. find the db(model)
    const videos = await Video.find({});
    //콘솔로 찍어보면 videos의 _id와 id는 다르다!!
    console.log(videos[0].id); //6203684d4012121c1e37d946 /// 이 id를 이용하여 videomixin의 a태그의 url을 설정 => watch로 이어지게함
    console.log(videos[0]._id); //new ObjectId("6203684d4012121c1e37d946")
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
export const watch = async (req, res) => {
  //1. Get id from paramter
  const { id } = req.params;
  //2. Find the video with the id
  const video = await Video.findById(id);
  console.log(video);
  //3. Use the video data
  return res.render("watch", { pageTitle: video.title, video });
};

//Upload (Create)
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  //1. Data received from Template(upload.pug)
  const { title, description, hashtags } = req.body;
  //2. Create new Video; (Data from POST -> Video Model)
  //3. Save the video at the same time
  try {
    await Video.create({
      title: title,
      description: description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    //4. redirect to the page
    return res.redirect("/");
  } catch (error) {
    //5. error handling
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

//Edit (Upldate)
export const editVideo = (req, res) => {
  res.send("EDIT VIDEO");
};

//Delete
export const deleteVideo = (req, res) => {
  res.send("DELETE VIDEO");
};
