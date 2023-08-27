const jwt = require("jsonwebtoken");
exports.auth = async (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    return res
      .status(401)
      .json({ err: "You need send token to this endpoint/url" });
  }
  try {
    const decodeToken = jwt.verify(token, "nehorayTop");
    //  res.json({ decodeToken });
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(502).json({ err: "token invalid" });
  }
};
