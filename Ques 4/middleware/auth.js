const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    res.redirect('/employees');
  } else {
    next();
  }
};

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};
