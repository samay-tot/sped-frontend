import { AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { IMAGE } from "../../assets/images";
import authService from "../../Services/auth.service";
import { navigateToRoute } from "../../Utils/helper";
import { IMG } from "../../assets/icon";

interface SignUpValue {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const initialValues: SignUpValue = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values: SignUpValue) => {
    try {
      const token = new URLSearchParams(location.search).get("token");
      if (!token) {
        throw new Error("Token not found in URL");
      }
      const response: AxiosResponse = await authService.resetPassword(token, {
        password: values?.confirmPassword,
      });
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
      navigateToRoute(navigate, "/login", true);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="h-screen rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center justify-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-12 px-26 text-center">
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

            <span className="mt-10 inline-block">
              <img src={IMG.baseImage} alt="base image" />
            </span>
          </div>
        </div>

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-12">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Reset your account password
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, values }) => (
                <Form>
                  <div className="grid gap-4">
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
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                  </div>
                  <div className="grid gap-4">
                    <div className="mb-6">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Enter Confirm Password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.confirmPassword}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span
                          className="absolute right-4 top-4 cursor-pointer"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
                        </span>
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5">
                    <button
                      type="submit"
                      className="w-full cursor-pointer rounded-lg border border-[#623de7] bg-[#623de7] p-4 text-white transition hover:bg-opacity-90"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
