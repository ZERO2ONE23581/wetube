import express from "express";
import morgan from "morgan";

//EXPRESS APPLICATION
const app = express();
const logger = morgan("dev");

//CONTROLLERS
const home = (req, res) => {
  res.send("HOME");
};
const join = (req, res) => {
  res.send("JOIN");
};
const login = (req, res) => {
  res.send("LOGIN");
};
const search = (req, res) => {
  res.send("SEARCH VIDEO");
};
const watch = (req, res) => {
  res.send("WATCH VIDEO");
};
const upload = (req, res) => {
  res.send("UPLOAD VIDEO");
};
const editVideo = (req, res) => {
  res.send("EDIT VIDEO");
};
const deleteVideo = (req, res) => {
  res.send("DELETE VIDEO");
};
const editUser = (req, res) => {
  res.send("EDIT USER");
};
const deleteUser = (req, res) => {
  res.send("DELETE USER");
};

//ROUTERS
//("/")
const rootRouter = express.Router();
rootRouter.route("/").get(home);
rootRouter.route("/join").get(join);
rootRouter.route("/login").get(login);
rootRouter.route("/search").get(search);

//("/videos")
const videoRouter = express.Router();
videoRouter.route("/upload").get(upload);
videoRouter.route("/watch").get(watch);
videoRouter.route("/edit").get(editVideo);
videoRouter.route("/delete").get(deleteVideo);

//("/users")
const userRouter = express.Router();
userRouter.route("/edit").get(editUser);
userRouter.route("/delete").get(deleteUser);

//MIDDLEWARE
app.use(logger);
//CONNECT ROUTERS TO EXPRESS APP
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

//SERVER LISTENING
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Aiden's server listening on the port http://localhost:${PORT} 🔥`);
});
