import mongoose from "mongoose";

//Connect the server to mongoDB
mongoose.connect(process.env.DB_URL);

//Mongoose gives access to the connection
const db = mongoose.connection;

//when the connection is open ONCE => handleOpen activates!
//everytime there's an error on connection => handleError activates!
const handleOpen = () => {
  console.log("✅ Aiden's server connected to MongoDB 🌝");
};
const handleError = (error) => {
  console.log("❌ DB Error", error);
};

db.once("open", handleOpen);
db.on("error", handleError);
