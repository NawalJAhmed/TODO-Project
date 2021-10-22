const db = require("./db/models");

const loginUser = (req, res, user) => {
  req.session.auth = {
    userId: user.id,
  };
};

const logoutUser = (req, res) => {
  delete req.session.auth;
};

const requireAuth = async (req, res, next) => {
  if (!res.locals.authenticated) {
    return res.redirect("/users/login");
  }
  let userId = parseInt(req.url.split("/")[1], 10);
  if (req.session.auth.userId !== userId) {
    return res.redirect(`/user`);
  }
  const groupId = parseInt(req.url.split("/")[2], 10);
  if(!isNaN(groupId)) {
  const group = await db.Group.findByPk(groupId);
  if (!group && !undefined) return res.redirect(`/user`);
  }
  return next();
};

const restoreUser = async (req, res, next) => {

  if (req.session.auth) {
    const { userId } = req.session.auth;

    try {
      const user = await db.User.findByPk(userId);

      if (user) {
        res.locals.authenticated = true;
        res.locals.user = user;
        next();
      }
    } catch (err) {
      res.locals.authenticated = false;
      next(err);
    }
  } else {
    res.locals.authenticated = false;
    next();
  }
};

module.exports = {
  loginUser,
  logoutUser,
  restoreUser,
  requireAuth,
};
