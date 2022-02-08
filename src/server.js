import express from "express";
import morgan from "morgan";

//EXPRESS APPLICATION
const app = express();
const logger = morgan("dev");

//CONTROLLER
const home = (req, res) => {
  res.send("home");
};
//MIDDLEWARE
app.use(logger);

//GET REQUEST
///when somebody(Browser) reqests to get '/' page => activates 'home' function
app.get("/", home);

//SERVER LISTENING
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Aiden's server listening on the port http://localhost:${PORT} 🔥`);
});
