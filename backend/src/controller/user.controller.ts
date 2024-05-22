import { CookieOptions, Request, Response } from "express";
import { CreateUserRequest, createUserValidator } from "../lib/validators/user";
import { createUser } from "../service/user.service";
import { createSession } from "../service/session.service";
import { signJwt } from "../lib/utils/jwt";
import { z } from "zod";
import { MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 8.64e7,
};

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserRequest["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    const session = await createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: "15m" }
    );

    const refreshToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: "1d" }
    );

    res.cookie("access_token", accessToken, accessTokenCookieOptions);

    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

    return res.send({ accessToken, refreshToken });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(403).json({ message: err.message });
    } else if (err instanceof Error) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

export const getCurrentUser = (req: Request, res: Response) => {
  return res.send(req.user);
};
