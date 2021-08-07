const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if(!req.headers.authorization){
      throw 'Token not given !'
    }
    const token = req.headers.authorization;
    console.log('AUTH', token);
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log('AUTH', decodedToken);
    console.log('AUTH', Date.now());
    if (!decodedToken.exp || (decodedToken.exp*1000<Date.now())) {
      throw "Expired Token!";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error("Invalid request!") });
  }
};