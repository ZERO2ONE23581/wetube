export const localsMiddleware = (req, res, next) => {
  //Using locals pug can access to the session-id!
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  console.log(res.locals);
  next();
};
