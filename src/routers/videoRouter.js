import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  getEdit,
  postEdit,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();

//:id == parameter, you can get by using req.params
videoRouter.route("/:id([0-9a-f]{24})").get(watch);

//Only loggedIn user can => upload, edit, delete videos!
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(postUpload);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);

export default videoRouter;
