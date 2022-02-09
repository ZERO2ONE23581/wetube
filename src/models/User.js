import mongoose from "mongoose";
import bcrypt from "bcrypt";

//Define the shape(schema) of the Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String },
});

//Hash Middleware
userSchema.pre("save", async function () {
  //this(==user)의 password를 5번 해싱함
  console.log("original pw:", this.password); //original pw: 111
  this.password = await bcrypt.hash(this.password, 5);
  console.log("hashed pw:", this.password); //hashed pw: $2b$05$nF3r9eefXBKSkq7fyVi5yusHbFIYlJrh1H.tCDe3zgis4dHkDEP7u
});

//Create the Model with schema
const User = mongoose.model("User", userSchema);
export default User;
