import express from "express";
import { home, search } from "../controllers/videoController";
import { getJoin, getLogin, postJoin, postLogin } from "../controllers/userController";

const rootRouter = express.Router();
rootRouter.route("/").get(home);
rootRouter.route("/search").get(search);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;
