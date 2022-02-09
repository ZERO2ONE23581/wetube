import express from "express";
import {
  getUpload,
  postUpload,
  watch,
  editVideo,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();
videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.route("/:id").get(watch);
videoRouter.route("/:id/edit").get(editVideo);
videoRouter.route("/:id/delete").get(deleteVideo);

export default videoRouter;
