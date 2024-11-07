import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { IMG } from "../../assets/icon";
import { IMAGE } from "../../assets/images";
import { setLoginDetails } from "../../Redux/auth/reducer";
import authService from "../../Services/auth.service";
import { ErrorResponse, navigateToRoute } from "../../Utils/helper";
import ForgotPassword from "../ForgotPassword";
import FacebookLogin from "@greatsumini/react-facebook-login";

interface LoginValues {
  email: string;
  password: string;
  type: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isForgotPassword, SetIsForgotPassword] = useState<boolean>(false);
  const initialValues: LoginValues = {
    email: "",
    password: "",
    type: "email"
  };

  const handleSignUpClick = () => {
    navigateToRoute(navigate, "/signUp", true);
  };

  const handleSubmit = async (values: LoginValues) => {
    try {
      const loginPayload: LoginValues = {
        email: values.email,
        password: values.password,
        type: "email"
      };
      const response: AxiosResponse = await authService.login(loginPayload);
      dispatch(setLoginDetails(response?.data?.result));
      navigateToRoute(navigate, "/profile", true);
      await localStorage.setItem("token", response?.data?.result?.token);
      toast(response?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      const errorMessage =
        (error as ErrorResponse)?.response?.data?.data?.message ||
        "An unexpected error occurred";
      toast(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (result) => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${result.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${result.access_token}`,
              Accept: "application/json",
            },
          }
        );
        const authSignInPayload: {
          id: string;
          email: string;
          verified_email: boolean;
          name: string;
          socialType: string;
        } = {
          id: response?.data?.id,
          email: response?.data?.email,
          verified_email: response?.data?.verified_email,
          name: response?.data?.name,
          socialType: "Google",
        };
        const responseDetails: AxiosResponse = await authService.authSignIn(
          authSignInPayload
        );
        dispatch(setLoginDetails(responseDetails?.data?.result));
        navigateToRoute(navigate, "/profile", true);
        await localStorage.setItem(
          "token",
          responseDetails?.data?.result?.token
        );
        toast(responseDetails?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  return (
    <div className="h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-17.5 px-26 text-center">
            <div className="mb-5.5 inline-block">
              <img
                className="hidden dark:block"
                src={IMAGE.userImage}
                alt="Logo"
              />
              <img className="dark:hidden" src={IMAGE.userImage} alt="Logo" />
            </div>

            <p className="2xl:px-20 text-2xl font-bold text-blue-700">
              SpEd Connect
            </p>

            <span className="mt-15 inline-block">
              <img src={IMG.baseImage} alt="base image" />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to SpEd Connect
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Please enter a valid email address")
                  .required("Email ID is required")
                  .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    "Email ID must be unique"
                  )
                  .test(
                    "len",
                    "Email ID cannot exceed 100 characters",
                    (val) => val.length <= 100
                  ),
                password: Yup.string()
                  .min(6, "Password must be between 6 and 50 characters")
                  .max(50, "Password must be between 8 and 50 characters")
                  .matches(/[A-Z]/, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character")
                  .matches(/[a-z]/, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character")
                  .matches(/[0-9]/, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character")
                  .matches(
                    /[!@#$%^&*(),.?":{}|<>]/,
                    "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
                  )
                  .required("Password is required"),
              })}
              onSubmit={async (values: LoginValues, { resetForm }) => {
                handleSubmit(values);
                resetForm();
              }}
            >
              {({ handleChange, handleBlur, values }) => (
                <Form>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <div className="relative">
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span className="absolute right-4 top-5">
                        <AiOutlineMail />
                      </span>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <span
                        className="absolute right-4 top-4 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <IoEye /> : <IoEyeOff />}
                      </span>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>
                  <div
                    className="text-base text-primary flex justify-end underline mb-5 cursor-pointer"
                    onClick={() => SetIsForgotPassword(true)}
                  >
                    Forgot password?
                  </div>

                  <div className="mb-2">
                    <input
                      type="submit"
                      value="Sign In"
                      className="w-full cursor-pointer rounded-lg border border-[#623de7] bg-[#623de7] p-4 text-white transition hover:bg-opacity-90"
                    />
                  </div>

                  <div className="m-3 flex justify-center items-center text-base">
                    OR
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2 grid-cols-1">
                    <button
                      type="button"
                      onClick={() => login()}
                      className="flex w-full items-center justify-center xl:gap-3.5 gap-2 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
                    >
                      <span>
                        <img
                          src={IMG.google}
                          className="w-7 h-7"
                          alt="google"
                        />
                      </span>
                      Sign in with Google
                    </button>

                    <FacebookLogin
                      appId="1081611306975758"
                      fields="name,email,picture"
                      onSuccess={(response) => {
                        console.log('Login Success====!', response);
                      }}
                      onFail={(error) => {
                        console.log('Login Failed!', error);
                      }}
                      onProfileSuccess={(response) => {
                        console.log('Get Profile Success!', response);
                      }}
                      render={(renderProps) => (
                        <button
                          type="button"
                          onClick={renderProps.onClick}
                          className="flex w-full items-center justify-center xl:gap-3.5 gap-2 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
                        >
                          <span>
                            <img
                              src={IMG.facebook}
                              alt="facebook"
                              className="w-8.5 h-8.5"
                            />
                          </span>
                          Sign in with Facebook
                        </button>
                      )}
                    />
                  </div>

                  <div className="mt-6 text-center">
                    <p>
                      Don’t have an account?{" "}
                      <span
                        className="text-primary underline cursor-pointer"
                        onClick={handleSignUpClick}
                      >
                        Sign Up
                      </span>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <ForgotPassword
          isOpen={isForgotPassword}
          onClose={() => SetIsForgotPassword(false)}
        />
      </div>
    </div>
  );
};

export default Login;
