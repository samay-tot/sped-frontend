import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosResponse } from "axios";
import { City, Country, State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import {
  IoEye,
  IoEyeOff,
  IoHomeOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineWorkOutline } from "react-icons/md";
import { TbMapPinCode } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { IMG } from "../../assets/icon";
import { IMAGE } from "../../assets/images";
import { setLoginDetails } from "../../Redux/auth/reducer";
import authService from "../../Services/auth.service";
import {
  ErrorResponse,
  navigateToRoute,
  useWillMountHook,
} from "../../Utils/helper";
import FacebookLogin from "@greatsumini/react-facebook-login";

interface SignUpValue {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  address: string;
  zipCode: string;
  occupation: string;
  customOccupation: string;
  insurancePlans: [] | null | any;
  country: string;
  state: string;
  city: string;
}

interface insuranceList {
  _id: string;
  name: string;
}

interface occupationList {
  _id: string;
  name: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null | any>("");
  const [selectedState, setSelectedState] = useState<string | null>("");
  const [insurancePlanList, setInsurancePlanList] = useState<insuranceList[]>(
    []
  );
  const [occupationList, setOccupationList] = useState<occupationList[]>([]);
  const [showOtherField, setShowOtherField] = useState(false);
  const states = State.getStatesOfCountry(selectedCountry || undefined);
  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry, selectedState)
      : [];

  const initialValues: SignUpValue = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    zipCode: "",
    occupation: "",
    customOccupation: "",
    insurancePlans: [],
    country: "",
    state: "",
    city: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First Name is required")
      .min(2, "First Name must be between 2 and 50 characters")
      .max(50, "First Name must be between 2 and 50 characters")
      .matches(
        /^[a-zA-Z]+$/,
        "First Name can only contain alphabetic characters"
      ),
    lastName: Yup.string()
      .required("Last Name is required")
      .min(2, "Last Name must be between 2 and 50 characters")
      .max(50, "Last Name must be between 2 and 50 characters")
      .matches(
        /^[a-zA-Z]+$/,
        "Last Name can only contain alphabetic characters"
      ),
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
    phoneNumber: Yup.string()
      .min(7, "Please enter a valid phone number (7-14 digits)")
      .max(14, "Please enter a valid phone number (7-14 digits)")
      .matches(/^[0-9]+$/, "Phone Number can only contain numeric values")
      .required("Phone Number is required"),
    address: Yup.string()
      .required("Address Line is required")
      .min(5, "Address Line must be between 5 and 255 characters")
      .max(255, "Address Line must be between 5 and 255 characters")
      .matches(/^[a-zA-Z0-9\s,.-]*$/, "Address Line can only contain alphanumeric characters, commas, periods, and hyphens"),
    zipCode: Yup.string()
    .required("Zip/Postal Code is required")
      .min(5, "Zip/Postal Code must be between 5 and 10 digits.")
      .max(10, "Zip/Postal Code must be between 5 and 10 digits.")
      .matches(/^\d+$/, "Zip/Postal Code can only contain numeric values."),
    occupation: Yup.string().required("Occupation selection is required"),
    customOccupation: Yup.string().test(
      "is-custom-occupation-required",
      "Please enter your occupation",
      function (value) {
        const { occupation } = this.parent;
        if (occupation === "other" && !value) {
          return false;
        }
        return true;
      }
    ),
    insurancePlans: Yup.array()
      .min(1, "Please select at least one insurance plan")
      .required("Insurance plan selection is required"),
    country: Yup.object()
      .required("Country selection is required")
      .test(
        "is-not-empty",
        "Please select a country",
        (value) => !!value && Object.keys(value).length > 0
      ),
    state: Yup.object()
      .required("State/Province selection is required")
      .test(
        "is-not-empty",
        "Please select a valid state/province based on the selected country",
        (value) => !!value && Object.keys(value).length > 0
      ),

    city: Yup.object()
      .required("City selection is required")
      .test(
        "is-not-empty",
        "Please select a valid city based on the selected state",
        (value) => !!value && Object.keys(value).length > 0
      ),
  });

  const handleSubmit = async (values: SignUpValue, setFieldValue: any) => {
    try {
      const signUpData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        address: values.address,
        zipCode: values.zipCode,
        occupation: values.customOccupation || values.occupation,
        insurancePlans: values.insurancePlans,
        country: values.country,
        state: values.state,
        city: values.city,
        type: "email",
        role: "Provider"
      };
      const response: AxiosResponse = await authService.signUp(signUpData);
      console.log("🚀 ~ handleSubmit ~ response:", response);
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
      setFieldValue("country", null);
      setFieldValue("state", null);
      setFieldValue("city", null);
      setFieldValue("occupation", null);
      setFieldValue("insurancePlans", []);
      setSelectedCountry("");
      setSelectedState("");
    }
  };

  const handleSignInClick = () => {
    navigateToRoute(navigate, "/login", true);
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
        console.log("🚀 ~ onSuccess: ~ response:", response?.data);
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

  const getAllInsuranceList = async () => {
    try {
      const response: AxiosResponse = await authService.insuranceList();
      setInsurancePlanList(response?.data?.result);
    } catch (error) {
      console.log("🚀 ~ getAllInsuranceList ~ error:", error);
    }
  };

  const getAllOccupationList = async () => {
    try {
      const response: AxiosResponse = await authService.occupationList();
      setOccupationList(response?.data?.result);
    } catch (error) {
      console.log("🚀 ~ getAllInsuranceList ~ error:", error);
    }
  };

  useWillMountHook(() => {
    getAllInsuranceList();
    getAllOccupationList();
  });

  const insuranceOptions: any = insurancePlanList?.map((data) => ({
    value: data.name,
    label: data.name,
  }));

  const occupationListOptions: any = occupationList?.map((data) => ({
    value: data.name,
    label: data.name,
  }));

  const extendedOccupationListOptions = [
    ...occupationListOptions,
    { value: "other", label: "Other" },
  ];

  // const defaultCountries = ["US", "VI", "PR"];

  const countryOptions: any = Country.getAllCountries()
    // ?.filter((data) => defaultCountries.includes(data.isoCode))
    .map((data) => ({
      value: data.isoCode,
      label: data.name,
    }));

  const statesOptions: any = states?.map((data) => ({
    value: data.isoCode,
    label: data.name,
  }));

  const citiesOptions: any = cities?.map((data) => ({
    value: data.name,
    label: data.name,
  }));

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
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
          <div className="w-full p-4 sm:p-12.5 xl:p-7">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign Up for SpEd Connect
            </h2>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm, setFieldValue }) => {
                handleSubmit(values, setFieldValue);
                resetForm();
              }}
            >
              {({ handleChange, handleBlur, values, setFieldValue }) => (
                <Form>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        First Name
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="firstName"
                          placeholder="Enter First Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                          maxLength={50}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const regex = /^[A-Za-z]*$/;
                            if (!regex.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                          <IoPersonOutline />
                        </span>
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Last Name
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="lastName"
                          placeholder="Enter Last Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                          maxLength={50}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const regex = /^[A-Za-z]*$/;
                            if (!regex.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                          <IoPersonOutline />
                        </span>
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
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
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
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
                        Phone Number
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="phoneNumber"
                          placeholder="Enter Phone Number"
                          onChange={(e: { target: { value: string } }) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue("phoneNumber", value);
                          }}
                          onBlur={handleBlur}
                          value={values.phoneNumber}
                          maxLength={14}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                          <MdOutlineLocalPhone />
                        </span>
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Occupation
                      </label>
                      <div className="relative">
                        <Select
                          options={extendedOccupationListOptions}
                          onChange={(selectedOptions) => {
                            setFieldValue("occupation", selectedOptions?.value);
                            setShowOtherField(
                              selectedOptions.value === "other"
                            );
                            if (selectedOptions.value !== "other") {
                              setFieldValue("customOccupation", "");
                            }
                          }}
                          value={
                            extendedOccupationListOptions.find(
                              (option: { value: string }) =>
                                option.value === values.occupation
                            ) || null
                          }
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select Occupation / Add Occupation"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: "#9ca2af",
                              paddingLeft: 12,
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              paddingLeft: 12,
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                state.isFocused || state.isSelected
                                  ? "#623de7"
                                  : provided.backgroundColor,
                              color:
                                state.isFocused || state.isSelected
                                  ? "#ffffff"
                                  : provided.color,
                            }),
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="occupation"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Insurance Plan
                      </label>
                      <div className="relative">
                        <Select
                          isMulti
                          options={insuranceOptions}
                          onChange={(selectedOptions) => {
                            const selectedValues = selectedOptions.map(
                              (option) => option.value
                            );
                            setFieldValue("insurancePlans", selectedValues);
                          }}
                          value={insuranceOptions?.filter(
                            (option: { value: string }) =>
                              Array.isArray(values.insurancePlans) &&
                              values?.insurancePlans?.includes(option.value)
                          )}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select Insurance Plan"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: "#9ca2af",
                              paddingLeft: 12,
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isFocused
                                ? "#623de7"
                                : provided.backgroundColor,
                              color: state.isFocused
                                ? "#ffffff"
                                : provided.color,
                            }),
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="insurancePlans"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    {showOtherField && (
                      <div className="mb-4">
                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                          Add Occupation
                        </label>
                        <div className="relative">
                          <Field
                            type="text"
                            name="customOccupation"
                            placeholder="Enter your occupation"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.customOccupation}
                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                          <span className="absolute right-4 top-4">
                            <MdOutlineWorkOutline />
                          </span>
                          <ErrorMessage
                            name="customOccupation"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 grid-cols-2">
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

                  <div className="grid gap-4 grid-cols-2">
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Address
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="address"
                          placeholder="Enter Address"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={255}
                          value={values.address}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                          <IoHomeOutline />
                        </span>
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Zip Code
                      </label>
                      <div className="relative">
                        <Field
                          type="text"
                          name="zipCode"
                          placeholder="Enter Zip Code"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.zipCode}
                          maxLength={10}
                          className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute right-4 top-4">
                          <TbMapPinCode />
                        </span>
                        <ErrorMessage
                          name="zipCode"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-3 grid-cols-1">
                    <div className="xl:mb-4 mb-1">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Country
                      </label>
                      <div className="relative">
                        <Select
                          options={countryOptions}
                          onChange={(selectedOptions: any) => {
                            setFieldValue("country", selectedOptions);
                            setSelectedCountry(selectedOptions?.value ?? null);
                            setSelectedState("");
                          }}
                          value={values.country}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select Country"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: "#9ca2af",
                              paddingLeft: 12,
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              paddingLeft: 12,
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                state.isFocused || state.isSelected
                                  ? "#623de7"
                                  : provided.backgroundColor,
                              color:
                                state.isFocused || state.isSelected
                                  ? "#ffffff"
                                  : provided.color,
                            }),
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div className="xl:mb-4 mb-1">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        State
                      </label>
                      <div className="relative">
                        <Select
                          options={statesOptions}
                          onChange={(selectedOptions: any) => {
                            setFieldValue("state", selectedOptions);
                            setSelectedState(selectedOptions?.value ?? null);
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select State"
                          value={values.state}
                          isDisabled={!selectedCountry}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: "#9ca2af",
                              paddingLeft: 12,
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              paddingLeft: 12,
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                state.isFocused || state.isSelected
                                  ? "#623de7"
                                  : provided.backgroundColor,
                              color:
                                state.isFocused || state.isSelected
                                  ? "#ffffff"
                                  : provided.color,
                            }),
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        City
                      </label>
                      <div className="relative">
                        <Select
                          options={citiesOptions}
                          onChange={(selectedOptions) => {
                            setFieldValue("city", selectedOptions);
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={values.city}
                          placeholder="Select City"
                          isDisabled={!selectedState}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color: "#9ca2af",
                              paddingLeft: 12,
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              paddingLeft: 12,
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                state.isFocused || state.isSelected
                                  ? "#623de7"
                                  : provided.backgroundColor,
                              color:
                                state.isFocused || state.isSelected
                                  ? "#ffffff"
                                  : provided.color,
                            }),
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="city"
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
                      Sign Up
                    </button>
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
                        <img src={IMG.google} alt="google" />
                      </span>
                      Sign up with Google
                    </button>

                    <FacebookLogin
                      appId="1081611306975758"
                      fields="name,email,picture"
                      onSuccess={(response) => {
                        console.log('Login Success!', response);
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
                      Already have an account?{" "}
                      <span
                        className="text-primary underline cursor-pointer"
                        onClick={handleSignInClick}
                      >
                        Sign in
                      </span>
                    </p>
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

export default SignUp;
