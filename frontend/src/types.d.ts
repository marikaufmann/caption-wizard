export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInFormData = {
  email: string;
  password: string;
};

export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};
