import User from "../models/User";

///Root Router
//회원가입 Join (Create)
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { email, username, password, name, location } = req.body; //1. receive data from join page
  await User.create({
    //2. create new User model
    email,
    username,
    password,
    name,
    location,
  });
  return res.redirect("/login");
};
//로그인 Login (Read)
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = (req, res) => {
  return res.redirect("/");
};
///User Router
//유저수정 Edit(Update)
export const getEditUser = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postEditUser = (req, res) => {
  return res.redirect("/");
};
//유저삭제 Delete
export const deleteUser = (req, res) => {
  return res.redirect("/");
};
