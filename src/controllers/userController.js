import User from "../models/User";

//회원가입 Join
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const pageTitle = "join";
  //1. get data from template
  const { name, email, username, password, password2, location } = req.body;
  //4. password confirmation
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  //3. 중복처리
  //만약 User model에서 unique:true 안된항목도 mongodb에서 중복오류가 난다면 collection자체를 지우고 다시 만들면 해결된다!!
  const exists = await User.exists({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken.",
    });
  }
  //2. create Model and save the data on mongodb
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    //4. Redirect to login url
    return res.redirect("/login");
  } catch (error) {
    //error handling
    return res.status(400).render("join", { pageTitle, errorMessage: error._message });
  }
};

//로그인 Login
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = (req, res) => {
  return res.end();
};
