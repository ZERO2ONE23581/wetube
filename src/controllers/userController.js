import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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
export const postLogin = async (req, res) => {
  //1. check if the account exsits and get the user we're looking for
  const { username, password } = req.body;
  // username should be matched and the account wasn't made by github login (==socialOnly:false)
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exist.",
    });
  }
  //2. check if the password correct. /// compare the pw from tempate && pw on db
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password.",
    });
  }
  //4. Remembering User! (this is basically how you log the user in!)
  /// My Backend gives session-id (inside the cookie) to the Browser!
  /// and this will add extra information(loggedIn:true, user) in the session!
  req.session.loggedIn = true;
  req.session.user = user;
  //3. redirect to home
  console.log("successfully logged in 💥");
  return res.redirect("/");
};

//깃헙로그인 Github Login
export const startGithubLogin = (req, res) => {
  //STEP1. Request a user's id to Github => User will say Yes => Github will give us github code
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  //STEP2. Now, you need to exchange github code to -> Access token!
  const baseUrl = `https://github.com/login/oauth/access_token`;
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code, //this is the github code!!
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      //fetch allows to POST request to finalUrl
      //fetch is not in NodeJS, so you shoud npm i node-fetch@2.6.1 (the recent one won't work!)
      method: "POST",
      headers: {
        Accept: "application/json", //this enables to see not as text but json shape
      },
    })
  ).json(); //Now, you have Access token!
  if ("access_token" in tokenRequest) {
    //STEP3. Use the access token to acess the API
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // now you're able to get access to user's data from Github!
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    //now you're able to get access to user's email data from Github!
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    // if there is no user joined with github email => create an Account with github email!
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user; // if there's already a user joined with github email => log him in anyway
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
//로그아웃
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

//프로필 편집 Edit
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit-profile" });
};
export const postEdit = async (req, res) => {
  //1. find users who are logged in by id (req.session.user.id) + other info (req.body)
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;
  //2. update (edit) user profile
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { new: true } // you need this code for saving updated info to session
  );
  //3. update the session in the mongodb
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

//비번변경 CHANGE PASSWORD
export const getChangePassword = (req, res) => {
  //if the user is logged in by github, they go back to home.
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  //1. find the _id of user in session
  //2. data to update from body
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  //3. check if the old password is matched with the typed one.
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect.",
    });
  }
  //2. pw confirmation
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match confirmation.",
    });
  }
  //3. find the user and update(save) the pw to hash
  const user = await User.findById(_id);
  console.log("OLD PW:", user.password);
  user.password = newPassword;
  console.log("NEW PW:", user.password);
  await user.save(); //hash middleware engage the moment it is saved!
  console.log("NEW PW HASHED", user.password);
  //4. update the session as well!
  req.session.user.password = user.password;
  return res.redirect("/users/logout");
};
