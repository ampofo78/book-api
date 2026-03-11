import "dotenv/config";
import jwt from "jsonwebtoken";

export const VerifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};
