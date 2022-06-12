const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
   
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      name: decodedToken.name,
    };
    next();
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).json({
        message: "authorisation failed!!!",
      });
    }
  }
};
