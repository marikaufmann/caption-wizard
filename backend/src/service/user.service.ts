import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import UserModel from "../models/user.model";
import { UserType } from "../shared/types";
import bcrypt from "bcryptjs";
import { omit } from "lodash";
import axios from "axios";

export const createUser = async (
  input: Omit<UserType, "_id" | "createdAt" | "updatedAt" | "confirmPassword">
) => {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), "password");
  } catch (err: any) {
    throw new Error(err);
  }
};

export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
};

export const findUser = async (query: FilterQuery<UserType>) => {
  return await UserModel.findOne(query).select("-password").lean();
};
interface GoogleTokensResult {
  access_token: string;
  expires_in: Number;
  refresh_token: string;
  scope: string;
  id_token: string;
}
export const getGoogleOAuthTokens = async (code: string) => {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
    grant_type: "authorization_code",
  };
  const query = new URLSearchParams(values).toString();
  try {
    const res = await axios.post<GoogleTokensResult>(url, query, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (err: any) {
    console.error(err.response.data.error);
    throw new Error(err.message);
  }
};
interface GoogleUserResult {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
export const getGoogleUser = async (
  id_token: string,
  access_token: string
): Promise<GoogleUserResult> => {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const findAndUpdateUser = async (
  query: FilterQuery<UserType>,
  update: UpdateQuery<UserType>,
  options: QueryOptions = {}
) => {
  return await UserModel.findOneAndUpdate(query, update, options);
};
