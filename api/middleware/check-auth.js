const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const sessionID = authHeader.split(" ")[1];
    const userData = jwt.verify(sessionID, process.env.JWT_KEY);
    req.session = { userData, sessionID };
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Authentication failed"
    });
  }
};
