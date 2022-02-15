import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController";

import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";

const userRouter = express.Router();

//only users who're NOT logged in => can use github login
userRouter.route("/github/start").all(publicOnlyMiddleware).get(startGithubLogin);
userRouter.route("/github/finish").all(publicOnlyMiddleware).get(finishGithubLogin);

//only users who're logged in => can log out, edit thier profile, change password
userRouter.route("/logout").all(protectorMiddleware).get(logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);

export default userRouter;
