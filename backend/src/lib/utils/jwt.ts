import jwt from "jsonwebtoken";

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  try {
    const token = jwt.sign(object, process.env.JWT_SECRET_KEY as string, {
      ...(options && options),
    });
    return token;
  } catch (err) {
    console.error(err);
  }
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    console.error(err);
    return {
      valid: false,
      expired: err.message === "jwt expired",
      decoded: null,
    };
  }
};
