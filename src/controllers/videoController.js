//rootRouter
export const home = (req, res) => {
  res.send("HOME");
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
