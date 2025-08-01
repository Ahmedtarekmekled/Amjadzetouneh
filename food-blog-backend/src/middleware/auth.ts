import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required. Please log in.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, async (err: any, decoded: any) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expired. Please log in again.",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token. Please log in again.",
        });
      } else {
        return res.status(401).json({
          message: "Authentication failed. Please log in again.",
        });
      }
    }

    try {
      const user = await User.findById(decoded._id).select("-password");
      if (!user) {
        return res.status(401).json({
          message: "User not found. Please log in again.",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Authentication failed. Please log in again.",
      });
    }
  });
};

export const adminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export default authenticateToken;
