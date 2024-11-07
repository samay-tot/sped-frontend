import { AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import authService from "../../Services/auth.service";
import { ErrorResponse } from "../../Utils/helper";

interface ForgotPasswordModal {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  email: string;
}

const ForgotPassword: React.FC<ForgotPasswordModal> = ({ isOpen, onClose }) => {
  const initialValues: FormValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
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
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const response: AxiosResponse = await authService.forgotPassWord({
        email: values.email,
      });
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black dark:bg-white opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 z-10 xl:w-125 w-96">
        <h2 className="text-lg font-bold mb-4">Forgot Password</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="p-5">
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2 text-black dark:text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="Enter Email"
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-300 text-gray-700 rounded-md px-4 py-2"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#623de7] text-white rounded-md px-4 py-2"
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
