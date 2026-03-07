import "dotenv/config";
import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split()[1];
    const user = jwt.verify(token, process.env.SECRET_KEY, {});
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized User" });
    }
  } catch (error) {
    console.log(error);
  }
};
