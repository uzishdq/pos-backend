import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(403).json({ message: "Role not found" });
    }

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
