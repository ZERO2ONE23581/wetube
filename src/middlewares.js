export const localsMiddleware = (req, res, next) => {
  //Using locals pug can access to the session-id!
  res.locals.siteName = "Wetube";
  res.locals.loggedIn = Boolean(req.session.loggedIn); //true
  res.locals.loggedInUser = req.session.user; //session(user data) -> locals
  console.log(res.locals);
  next();
};
