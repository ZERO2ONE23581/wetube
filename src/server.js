import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

//EXPRESS APPLICATION
const app = express();
const logger = morgan("dev");

app.use(logger);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

//SERVER LISTENING
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Aiden's server listening on the port http://localhost:${PORT} 🔥`);
});
