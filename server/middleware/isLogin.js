module.exports = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    console.log('Unauthorized, please login');
    res.status(401).send('Unauthorized, please login');
  }
};
