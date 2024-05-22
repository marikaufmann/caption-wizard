import { Mail } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../hooks/use-app-context";
import { useForm } from "react-hook-form";
import { SignInFormData } from "../types";
import { useEffect } from "react";

const SignIn = () => {
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/projects", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const { mutate: logIn } = useMutation(apiClient.logIn, {
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
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = handleSubmit((data) => logIn(data));
  return (
    <div className="h-screen bg-[#121316] md:flex">
      <div className="md:flex-1 md:block hidden h-full ">
        <img
          src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/signin-pic.jpg`}
          alt="sign in"
          className="object-cover object-left h-full w-full"
        />
      </div>
      <div className="flex-1 flex flex-col h-full w-full">
        <div className="w-full  max-w-[330px] mx-auto flex flex-col gap-6 pt-32 h-screen">
          <div className="mb-5">
            <img
              src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/logo-text.png`}
              alt="logo"
            />
          </div>
          <div className="flex flex-col gap-2 text-white/90">
            <h1 className="text-3xl md:text-4xl font-semibold ">Sign in</h1>
            <p className="text-white/80">
              Welcome back! Please enter your details.
            </p>
          </div>

          <a href={apiClient.getGoogleOAuthURL()} className="">
            <button
              className="flex gap-3 items-center bg-darkGray p-3  justify-center shadow-xl hover:bg-darkGray/80 border-2 border-white/70 hover:border-white mt-1 w-full rounded-lg"
              aria-label="continue with google"
            >
              <div className="">
                <img
                  src={`${process.env.REACT_APP_CLOUDINARY_ASSETS_URL}/google-icon.png`}
                  alt="google logo"
                  className="w-6 h-6"
                />
              </div>
              <p className="text-white/90 font-semibold tracking-wider ">
                Continue with Google
              </p>
            </button>
          </a>
          <p className="text-center font-semibold text-white/70">or</p>
          <form className="flex flex-col gap-4 -mt-5" onSubmit={onSubmit}>
            <label
              htmlFor="login_email"
              className=" flex flex-col gap-1 relative "
            >
              <h3 className="text-white/90  font-semibold">Email</h3>
              <div className="absolute w-8 flex items-center justify-center inset-y-0 z-20 text-gray-400 mt-6 ml-1">
                <Mail className="h-5 w-5 " />
              </div>
              <input
                {...register("email", { required: "Email is required." })}
                id="login_email"
                type="email"
                aria-label="email"
                autoComplete="email"
                className="pl-9 relative  border  border-gray-300 px-3 py-2 rounded-lg"
                placeholder="Email address"
              />
            </label>
            {errors.email && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.email?.message}
              </span>
            )}
            <label
              htmlFor="login_password"
              className="relative flex flex-col gap-1 item"
            >
              <h3 className="text-white/90  font-semibold">Password</h3>
              <input
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                id="login_password"
                type="password"
                aria-label="password"
                autoComplete="current-password"
                className=" border  border-gray-300 px-3 py-2 rounded-lg"
                placeholder="**************"
              />
            </label>
            {errors.password && (
              <span className="text-[#F56C6C] text-sm -mt-2">
                {errors.password?.message}
              </span>
            )}
            <button
              className="text-white/90 bg-darkGray rounded-lg  p-2.5 mt-2 font-semibold tracking-wider hover:bg-darkGray/80"
              aria-label="sign in"
            >
              Sign in
            </button>
            <p className=" text-center text-white/80 ">
              Don't have an account? &nbsp;
              <Link to="/register">
                <span className="underline underline-offset-4 text-white/90">
                  Sign up.
                </span>
              </Link>{" "}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
