import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useQueryClient, useMutation } from "react-query";
import { RegisterFormData } from "../types";
import { useAppContext } from "../hooks/use-app-context";
import Loader from "../components/Loader";

const Register = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: registerUser, isLoading } = useMutation(apiClient.register, {
    onError: (err: Error) => {
      showToast({ message: err.message, type: "ERROR" });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      navigate("/projects", { replace: true });
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = handleSubmit((data) => {
    registerUser(data);
  });
  return (
    <div className="h-screen bg-[#121316] md:flex">
      <div className="md:flex-1 md:block hidden h-full">
        <img
          src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/signin-pic.jpg`}
          alt="sign in"
          className="object-cover object-left h-full w-full"
        />
      </div>
      <div className="flex-1">
        <div className="max-w-[330px] mx-auto flex flex-col gap-6 pt-40 h-screen">
          <div className="flex flex-col gap-2 ">
            <h1 className="text-white/80 text-3xl md:text-4xl font-semibold ">
              Create an account
            </h1>
            <p className="text-white/80">Please provide your details.</p>
          </div>
          <form className="flex flex-col gap-4 " onSubmit={onSubmit}>
            <label
              htmlFor="register_firstName"
              className="relative flex flex-col gap-1"
            >
              <h3 className="text-white/80  font-semibold">First Name</h3>
              <input
                {...register("firstName", {
                  required: "First name is required.",
                })}
                id="register_firstName"
                type="firstName"
                aria-label="first name"
                autoComplete="given-name"
                className="border  border-gray-300 px-3 py-2 rounded-md "
                placeholder="First name"
              />
            </label>
            {errors.firstName && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.firstName?.message}
              </span>
            )}
            <label
              htmlFor="register_lastName"
              className="relative flex flex-col gap-1"
            >
              <h3 className="text-white/80  font-semibold">Last Name</h3>
              <input
                {...register("lastName", {
                  required: "Last name is required.",
                })}
                id="register_lastName"
                type="lastName"
                autoComplete="family-name"
                aria-label="last name"
                className="border  border-gray-300 px-3 py-2 rounded-md "
                placeholder="Last name"
              />
            </label>
            {errors.lastName && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.lastName?.message}
              </span>
            )}
            <label
              htmlFor="register_email"
              className=" flex flex-col gap-1 relative "
            >
              <h3 className="text-white/80  font-semibold">Email</h3>
              <div className="absolute w-8 flex items-center justify-center inset-y-0 z-20 text-gray-300 mt-6 ml-1">
                <Mail className="h-5 w-5 " />
              </div>
              <input
                {...register("email", { required: "Email is required." })}
                id="register_email"
                type="email"
                aria-label="email"
                autoComplete="email"
                className="pl-9 relative   border  border-gray-300 px-3 py-2 rounded-md"
                placeholder="Email address"
              />
            </label>
            {errors.email && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.email?.message}
              </span>
            )}
            <label
              htmlFor="register_password"
              className="relative flex flex-col gap-1"
            >
              <h3 className="text-white/80  font-semibold">Password</h3>
              <input
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                id="register_password"
                type="password"
                aria-label="password"
                autoComplete="new-password"
                className="border  border-gray-300 px-3 py-2 rounded-md"
                placeholder="**************"
              />
            </label>
            {errors.password && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.password?.message}
              </span>
            )}
            <label
              htmlFor="register_confirmPassword"
              className="relative flex flex-col gap-1"
            >
              <h3 className="text-white/80  font-semibold">Confirm password</h3>
              <input
                {...register("confirmPassword", {
                  validate: (val) => {
                    if (!val) {
                      return "This field is required.";
                    } else if (watch("password") !== val) {
                      return "Your paswords don't match.";
                    }
                  },
                })}
                id="register_confirmPassword"
                type="password"
                aria-label="confirm password"
                autoComplete="off"
                className="border  border-gray-300 px-3 py-2 rounded-md"
                placeholder="**************"
              />
            </label>
            {errors.confirmPassword && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.confirmPassword?.message}
              </span>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-darkGray text-white/80 tracking-wider flex justify-center items-center h-10 text-bg rounded-md p-2.5  mt-2 font-semibold disabled:bg-gray-400 hover:bg-darkGray/80"
              aria-label="sign up"
            >
              {isLoading ? <Loader styles={"h-4 w-4"} /> : "Sign up"}
            </button>
            <p className=" text-center text-white/80 ">
              Already have an account? &nbsp;
              <Link to="/sign-in">
                <span className="underline underline-offset-4 text-white/90">
                  Sign in.
                </span>
              </Link>{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
