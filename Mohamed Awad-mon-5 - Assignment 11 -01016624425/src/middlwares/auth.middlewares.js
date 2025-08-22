import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: `No token Provided` });
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const validationAdmin = (req, res, next) => {
  if (req.user.isAdmin === true) {
    next();
  } else {
    return res.status(401).json({ message: `Admins only` });
  }
};
export default verifyToken;

