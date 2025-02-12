import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded !== 'object' || !decoded?.userId || !decoded?.role) {
      res.status(401).json({ error: 'Access denied' });
      return;
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }
}

export function verifySeller(req: Request, res: Response, next: NextFunction) {
  const role = req.role;
  if (role !== 'seller') {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  next();
}