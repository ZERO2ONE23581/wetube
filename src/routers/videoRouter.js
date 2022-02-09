import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  editVideo,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();
videoRouter.route("/:id([0-9a-f]{24})").get(watch); //:id is a parameter that you can get by using req.params
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(editVideo);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);

export default videoRouter;
