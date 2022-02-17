import express from "express";
import { registerView, createComment } from "../controllers/videoController";

const apiRouter = express.Router();

//Recording the view
//this router does not render any template.
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;
