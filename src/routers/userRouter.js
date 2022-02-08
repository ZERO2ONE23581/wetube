import express from "express";
import { editUser, deleteUser } from "../controllers/userController";

const userRouter = express.Router();
userRouter.route("/edit").get(editUser);
userRouter.route("/delete").get(deleteUser);

export default userRouter;
