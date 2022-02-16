import express from "express";
import { registerView } from "../controllers/videoController";

const apiRouter = express.Router();

//Recording the view
//this router does not render any template.
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

export default apiRouter;
