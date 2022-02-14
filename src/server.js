import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

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
  ///even if they're not logged in, my website will remember them with the text(cookie) that the backend gives to the browser
  session({
    secret: "hello!",
    resave: true,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    //session-id is saved with the info added on the userController
    console.log(sessions);
    next();
  });
});
//Routeres
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
