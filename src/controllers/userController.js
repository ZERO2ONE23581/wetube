///Root Router
//회원가입 Join (Create)
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = (req, res) => {
  console.log(req.body);
  return res.end();
};
//로그인 Login (Read)
export const getLogin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
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
