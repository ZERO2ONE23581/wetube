import express from "express";
import { upload, watch, editVideo, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();
videoRouter.route("/").get(watch);
videoRouter.route("/upload").get(upload);
videoRouter.route("/edit").get(editVideo);
videoRouter.route("/delete").get(deleteVideo);

export default videoRouter;
