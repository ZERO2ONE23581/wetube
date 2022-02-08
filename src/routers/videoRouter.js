import express from "express";
import { upload, watch, editVideo, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();
videoRouter.route("/:id").get(watch);
videoRouter.route("/:id/upload").get(upload);
videoRouter.route("/:id/edit").get(editVideo);
videoRouter.route("/:id/delete").get(deleteVideo);

export default videoRouter;
