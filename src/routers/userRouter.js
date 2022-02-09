import express from "express";
import { postEditUser, getEditUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();
userRouter.route("/edit").get(getEditUser).post(postEditUser);
userRouter.route("/delete").get(deleteUser);

export default userRouter;
