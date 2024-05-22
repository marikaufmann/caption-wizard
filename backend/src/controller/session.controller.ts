import { CookieOptions, Request, Response } from "express";

import { ZodError } from "zod";
import {
  findAndUpdateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  validatePassword,
} from "../service/user.service";
import {
  createSession,
  findSession,
  findSessions,
  updateSession,
} from "../service/session.service";
import { signJwt } from "../lib/utils/jwt";
import { CreateSessionRequest } from "../lib/validators/session";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: 900000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const refreshTokenCookieOptions: CookieOptions = {
  ...accessTokenCookieOptions,
  maxAge: 8.64e7,
};
export const createUserSessionHandler = async (
  req: Request<{}, {}, CreateSessionRequest["body"]>,
  res: Response
) => {
  try {
    const user = await validatePassword(req.body);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const session = await createSession(user._id, req.get("user-agent") || "");
    const accessToken = signJwt(
      {
        ...user,
        session: session._id,
      },
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = signJwt(
      {
        ...user,
        session: session._id,
      },
      {
        expiresIn: "1d",
      }
    );
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

    res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(403).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

export const getUserSessionsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const sessions = await findSessions({ user: userId, valid: true });
    return res.send(sessions);
  } catch (err: any) {
    return res.status(401).json("Unauthorized");
  }
};

export const getCurrentSessionHandler = async (req: Request, res: Response) => {
  const sessionId = req.user.session;
  const session = await findSession(sessionId);
  if (!session || session?.valid === false)
    return res.status(401).json({ message: "Unauthorized." });
  return res.status(200).send(sessionId);
};

export const deleteSessionHandler = async (req: Request, res: Response) => {
  try {
    const sessionId = req.user.session;
    await updateSession({ _id: sessionId }, { valid: false });
    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};
export const googleOauthHandler = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  try {
    const { access_token, id_token } = await getGoogleOAuthTokens(code);
    const googleUser = await getGoogleUser(id_token, access_token);

    if (!googleUser.verified_email) {
      return res.status(403).send("Google account is not verified");
    }

    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    );

    const session = await createSession(user!._id, req.get("user-agent") || "");

    const accessToken = signJwt(
      {
        ...user!.toJSON(),
        session: session._id,
      },
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = signJwt(
      {
        ...user!.toJSON(),
        session: session._id,
      },
      {
        expiresIn: "1d",
      }
    );
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res.redirect(`${process.env.WEB_URL}/projects` as string);
  } catch (err) {
    console.error(err);
    return res.redirect(`${process.env.WEB_URL}/oauth/error`);
  }
};
