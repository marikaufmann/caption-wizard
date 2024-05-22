import { Request, Response, NextFunction } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.sendStatus(401).json({ message: "Unauthorized" });
  }
  return next();
};

export default requireUser;
