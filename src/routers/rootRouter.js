import express from "express";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userController";
import { publicOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();
rootRouter.route("/").get(home);
rootRouter.route("/search").get(search);
//Only user who are NOT logged in => can join, login!
/// this prevents someone who tries to go URL page that doesn't show on the front!
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);

export default rootRouter;
