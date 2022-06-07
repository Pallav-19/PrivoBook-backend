const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorizarion.split(" ")[1];
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    req.userData = {
      userId: decodedToken.userID,
      email: decodedToken.email,
      name: decodedToken.name,
    };
    next();
  } catch (error) {
    if (error) {
      res.status(500).json({
        message: "authorisation failed!!!",
      });
    }
  }
};
