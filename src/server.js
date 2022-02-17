import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
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

//ffmpeg 오류해결방법
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

//Middleswares
app.use(express.urlencoded({ extended: true })); //enable Express to undertand Form
app.use(express.json());
app.use(logger);
//Session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    //session store connects sessions to mongodb
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(flash()); //사용자에게 flash 메시지를 남기도록 도와준다.
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); //static은 url경로를 통해 유저에게 해당파일에 접근을 준다.
app.use("/static", express.static("assets"));
//Routers
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter); //front와 통신

export default app;
