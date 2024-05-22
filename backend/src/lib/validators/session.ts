import { object, string, TypeOf } from "zod";

export const CreateSessionValidator = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
    password: string({ required_error: "Password is required" })
      .min(6, "Password too short - should be at least 6 characters")
      .max(30, "Password too long - should be 30 characters max"),
  }),
});

export type CreateSessionRequest = TypeOf<typeof CreateSessionValidator>;
