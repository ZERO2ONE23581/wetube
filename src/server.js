import express from "express";
import morgan from "morgan";
import session from "express-session"; //session
import MongoStore from "connect-mongo"; //session-store
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

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
    secret: process.env.COOKIE_SECRET,
    //this will enable db to only save session-id of loggedIn user
    resave: false,
    saveUninitialized: false,
    //session store; connect sessions to mongodb
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localsMiddleware); //locals
//This let express to allow users to look inside UPLOAD, ASSETS folder!
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
//Routeres
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
