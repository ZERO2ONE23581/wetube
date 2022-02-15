export const localsMiddleware = (req, res, next) => {
  //Using locals pug can access to the session-id!
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn); //true
  res.locals.loggedInUser = req.session.user || {}; //session(user data) -> locals
  next();
};

//Only ppl who are logged in => next()
//otherwise, redirect to login page
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

//Only ppl who are NOT logged in => next()
//otherwise, redirect to home page
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
