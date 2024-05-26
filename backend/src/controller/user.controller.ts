import { CookieOptions, Request, Response } from "express";
import { CreateUserRequest } from "../lib/validators/user";
import {
  createUser,
  findUser,
  findAndUpdateUser,
  deleteUser,
} from "../service/user.service";
import { createSession, deleteAllSessions } from "../service/session.service";
import { signJwt } from "../lib/utils/jwt";
import {
  deleteAllVideos,
  deleteAllVideosFromCloud,
} from "../service/video.service";

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
    if (err instanceof Error) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

export const getCurrentUserHandler = async (req: Request, res: Response) => {
  const user = await findUser({ _id: req.user._id });
  return res.send(user);
};

export const editUserHandler = async (req: Request, res: Response) => {
  try {
    const isValid = req.params.userId === req.user._id;
    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedUser = await findAndUpdateUser(
      { _id: req.params.userId },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const isValid = req.params.userId === req.user._id;
    if (!isValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await findUser({ _id: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    await deleteAllVideosFromCloud(user?._id);
    await deleteAllVideos({ user: user?._id });
    await deleteAllSessions({ user: user?._id });
    await deleteUser({ _id: user?._id });

    return res.status(200).json({ message: "Account permanently deleted." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
