import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

//EXPRESS APPLICATION
const app = express();
const logger = morgan("dev");

//PUG
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
//Middleswares
app.use(express.urlencoded({ extended: true })); //enable Express to undertand Form
app.use(logger);
app.use(
  //session; this middleware will remember everybody who visits my website!
  session({
    secret: "hello!",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(localsMiddleware); //locals
//Routeres
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
