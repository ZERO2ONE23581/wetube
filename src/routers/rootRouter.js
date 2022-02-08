import express from "express";
import { home, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const rootRouter = express.Router();
rootRouter.route("/").get(home);
rootRouter.route("/search").get(search);
rootRouter.route("/join").get(join);
rootRouter.route("/login").get(login);

export default rootRouter;
