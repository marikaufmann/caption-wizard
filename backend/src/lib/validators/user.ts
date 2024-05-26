import { object, string, TypeOf } from "zod";

export const createUserValidator = object({
  body: object({
    firstName: string({ required_error: "First name is required" }),
    lastName: string({ required_error: "Last name is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
    password: string({ required_error: "Password is required" })
      .min(6, "Password too short - should be at least 6 characters")
      .max(30, "Password too long - should be 30 characters max"),
    confirmPassword: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export const editUserValidator = object({
  body: object({
    firstName: string({ required_error: "First name is required" }),
    lastName: string({ required_error: "Last name is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Not a valid email"
    ),
  }),
  params: object({
    userId: string({
      required_error: "User id is required",
    }),
  }),
});
export const deleteUserValidator = object({
  params: object({
    userId: string({
      required_error: "User id is required",
    }),
  }),
});

export type CreateUserRequest = TypeOf<typeof createUserValidator>;
export type DeleteUserRequest = TypeOf<typeof deleteUserValidator>;
