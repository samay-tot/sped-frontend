import { AxiosResponse } from "axios";
import { City, Country, ICity, State } from "country-state-city";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { IoIosArrowDown, IoMdCreate } from "react-icons/io";
import {
  IoAlertCircle,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { MdOutlineLocalPhone } from "react-icons/md";
import { TbMapPinCode } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { IMAGE } from "../../assets/images";
import { RootState } from "../../Redux";
import { setLoginDetails } from "../../Redux/auth/reducer";
import authService from "../../Services/auth.service";
import userService from "../../Services/user.service";
import { useWillMountHook } from "../../Utils/helper";

interface ProfileValue {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  zipCode?: string;
  insurancePlans?: string;
  bio?: string;
  avatar?: string | null;
  country?: string;
  state?: string;
  city?: string;
}

interface insuranceList {
  _id: string;
  name: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState<ProfileValue>();
  const { LoginDetails, themeColorMode } = useSelector(
    (state: RootState) => state.auth
  );
  const [insurancePlanList, setInsurancePlanList] = useState<insuranceList[]>(
    []
  );
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedChangeCountry, setSelectedChangeCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const stateData = State.getStatesOfCountry(LoginDetails?.country?.value);
  const citiesData =
    LoginDetails?.country?.value &&
    LoginDetails?.state &&
    City.getCitiesOfState(
      LoginDetails?.country?.value,
      LoginDetails?.state?.value
    );
  const [states, setStates] = useState(stateData);
  const [cities, setCities] = useState<ICity[] | string | any>(citiesData);
  const [selectedOptions, setSelectedOptions] = useState<
    readonly { value: string; label: string }[]
  >([]);
  const [profileImage, setProfileImage] = useState<any>({});
  const [showDataText, setShowDataText] = useState<boolean>(false);
  console.log("🚀 ~ profileImage:", profileImage.pic);

  const requiredFields: (keyof ProfileValue)[] = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "address",
    "zipCode",
    "insurancePlans",
    "bio",
    "avatar",
    "country",
    "state",
    "city",
  ];

  useEffect(() => {
    if (selectedChangeCountry) {
      const fetchedStates = State.getStatesOfCountry(selectedChangeCountry);
      setStates(fetchedStates);
      setSelectedState("");
      setCities([]);
    }
  }, [selectedChangeCountry]);

  useEffect(() => {
    if (selectedChangeCountry && selectedState) {
      const fetchedCities = City.getCitiesOfState(
        selectedChangeCountry,
        selectedState
      );
      setCities(fetchedCities);
    }
  }, [selectedState, selectedChangeCountry]);

  const initialValues: ProfileValue = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    phoneNumber: user?.phoneNumber,
    address: user?.address,
    email: user?.email,
    insurancePlans: user?.insurancePlans,
    zipCode: user?.zipCode,
    bio: user?.bio ?? "",
    avatar: null,
    country: user?.country,
    state: user?.state,
    city: user?.city,
  };

  const validationSchema = Yup.object({
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
    bio: Yup.string()
      .required("Bio is required")
      .min(5, "Bio must be between 5 and 500 characters")
      .max(500, "Bio must be between 5 and 500 characters")
      .matches(/^[a-zA-Z0-9\s,.-]*$/, "Bio can only contain alphanumeric characters, commas, periods, and hyphens"),
  });

  const handleProfileSubmit = async (values: ProfileValue) => {
    try {
      const response: AxiosResponse =
        await userService.updateUserProfileDetails(values);
      getUserProfileData();
      dispatch(setLoginDetails(response?.data?.result));
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
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  };

  const getUserProfileData = async () => {
    try {
      const response: AxiosResponse = await userService.getUserProfileDetails();
      setUser(response?.data?.result);
      const insuranceApiOptions = Array.isArray(
        response?.data?.result?.insurancePlans
      )
        ? response?.data?.result.insurancePlans.map((plan: []) => ({
            value: plan,
            label: plan,
          }))
        : [];
      setSelectedOptions(insuranceApiOptions);
      setSelectedCountry(response?.data?.result?.country?.value);
      setSelectedState(response?.data?.result?.state?.value);
      setSelectedCity(response?.data?.result?.city?.value);
    } catch (error) {
      console.log("🚀 ~ getUserProfileData ~ error:", error);
    }
  };

  const getAllInsuranceList = async () => {
    try {
      const response: AxiosResponse = await authService.insuranceList();
      setInsurancePlanList(response?.data?.result);
    } catch (error) {
      console.log("🚀 ~ getAllInsuranceList ~ error:", error);
    }
  };

  const insuranceOptions = insurancePlanList?.map((data) => ({
    value: data.name,
    label: data.name,
  }));

  const defaultCountries = ["US", "VI", "PR"];

  const countryOptions = Country.getAllCountries()
    ?.filter((data) => defaultCountries.includes(data.isoCode))
    .map((data) => ({
      value: data.isoCode,
      label: data.name,
    }));

  const statesOptions: any = states?.map((data) => ({
    value: data.isoCode,
    label: data.name,
  }));

  const citiesOptions: any = cities?.map((data: ICity) => ({
    value: data.name,
    label: data.name,
  }));

  useWillMountHook(() => {
    getUserProfileData();
    getAllInsuranceList();
  });

  useEffect(() => {
    if (user) {
      const missingFields = requiredFields.filter((field) => {
        if (field === "insurancePlans") {
          return (
            !user[field] ||
            !Array.isArray(user[field]) ||
            user[field].length === 0
          );
        }
        if (field === "avatar") {
          return user[field] === undefined;
        }
        return user[field] === undefined || user[field] === null;
      });

      if (missingFields.length > 0) {
        setShowDataText(true);
      } else {
        setShowDataText(false);
      }
    }
  }, [user]);

  return (
    <div className="mx-auto max-w-270">
      <div>
        {showDataText && (
          <div className="text-xl font-bold p-4 text-center flex justify-center items-center text-red-500">
            <IoAlertCircle className="mr-3 text-red-500" />
            Please complete your profile details so that user can view your
            information
          </div>
        )}
      </div>
      <div className="grid gap-8">
        <div className="xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await handleProfileSubmit(values);
                } catch (error) {
                  console.error("Submission error:", error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                values,
                setFieldValue,
                isSubmitting,
                resetForm,
              }) => (
                <Form className="p-7">
                  <div className="mb-10 flex items-center justify-center gap-3">
                    <div className="relative h-30 w-30 rounded-full">
                      <img
                        src={IMAGE.dummyUser}
                        alt="User"
                        className="rounded-full"
                      />
                      <button
                        type="button"
                        className="absolute bottom-6 right-0 bg-white rounded-full p-1 shadow-md"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = async (event: Event) => {
                            const target = event.target as HTMLInputElement;
                            const file = target.files?.[0];
                            if (file) {
                              setProfileImage({ pic: file });
                            }
                          };
                          input.click();
                        }}
                      >
                        <IoMdCreate className="text-[#623de7]" />
                      </button>
                    </div>
                    <ErrorMessage
                      name="avatar"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="firstName"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <IoPersonOutline />
                        </span>
                        <Field
                          name="firstName"
                          id="firstName"
                          placeholder="Enter First Name"
                          className="w-full rounded border border-stroke bg-gray py-2 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={50}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const regex = /^[A-Za-z]*$/;
                            if (!regex.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          value={values.firstName}
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <IoPersonOutline />
                        </span>
                        <Field
                          name="lastName"
                          id="lastName"
                          placeholder="Enter Last Name"
                          className="w-full rounded border border-stroke bg-gray py-2 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={50}
                          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            const regex = /^[A-Za-z]*$/;
                            if (!regex.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          value={values.lastName}
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <MdOutlineLocalPhone />
                        </span>
                        <Field
                          name="phoneNumber"
                          id="phoneNumber"
                          placeholder="Enter Phone Number"
                          className="w-full rounded border border-stroke bg-gray py-2 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          onChange={(e: { target: { value: string } }) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            setFieldValue("phoneNumber", value);
                          }}
                          onBlur={handleBlur}
                          maxLength={14}
                          value={values.phoneNumber}
                        />
                        <ErrorMessage
                          name="phoneNumber"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3">
                          <AiOutlineMail />
                        </span>
                        <Field
                          name="email"
                          id="email"
                          placeholder="Enter Email"
                          type="email"
                          readOnly
                          className="w-full rounded border border-stroke bg-gray py-2 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="address"
                      >
                        Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-3.5">
                          <IoLocationOutline />
                        </span>
                        <Field
                          name="address"
                          id="address"
                          placeholder="Enter Address"
                          className="w-full rounded border border-stroke bg-gray py-2 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={255}
                          value={values.address}
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="zipCode"
                      >
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
                          className="w-full rounded border border-stroke bg-gray py-2 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                        <span className="absolute left-4.5 top-3.5">
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

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Country
                      </label>
                      <div className="relative">
                        <Select
                          options={countryOptions}
                          onChange={(selectedOptions: any) => {
                            if (selectedOptions) {
                              setFieldValue("country", selectedOptions);
                              setSelectedChangeCountry(
                                selectedOptions.value ?? null
                              );
                              setSelectedCountry(selectedOptions.value ?? null);
                              setFieldValue("state", "");
                              setFieldValue("city", "");
                            } else {
                              setSelectedChangeCountry("");
                              setSelectedCountry("");
                            }
                            setSelectedState("");
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select Country"
                          value={
                            values.country ||
                            countryOptions.find(
                              (option: { value: string }) =>
                                option.value === selectedCountry
                            ) ||
                            null
                          }
                          menuPortalTarget={document.body}
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#f0f3fb",
                              borderColor: state.isFocused
                                ? themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#623de7"
                                : themeColorMode === "dark"
                                ? "#313e49"
                                : "#d1d5db",
                              color:
                                themeColorMode === "dark"
                                  ? "#f0f3fb"
                                  : "#000000",
                              "&:hover": {
                                borderColor:
                                  themeColorMode === "dark"
                                    ? "#313e49"
                                    : "#623de7",
                              },
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color:
                                themeColorMode === "dark"
                                  ? "#ffffff"
                                  : "#000000",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color:
                                themeColorMode === "dark"
                                  ? "#ffffff"
                                  : "#6b7280",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                state.isFocused || state.isSelected
                                  ? themeColorMode === "dark"
                                    ? "#5b21b6"
                                    : "#623de7"
                                  : themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#ffffff",
                              color:
                                state.isFocused || state.isSelected
                                  ? "#ffffff"
                                  : themeColorMode === "dark"
                                  ? "#e5e7eb"
                                  : "#000000",
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

                    <div className="w-full sm:w-1/2">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        State
                      </label>
                      <div className="relative">
                        <Select
                          options={statesOptions}
                          onChange={(selectedOptions) => {
                            if (selectedOptions) {
                              setFieldValue("state", selectedOptions);
                              setSelectedState(selectedOptions.value ?? null);
                              setFieldValue("city", "");
                            } else {
                              setSelectedState("");
                            }
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select State"
                          value={
                            values.state ||
                            statesOptions.find(
                              (option: { value: string }) =>
                                option.value === selectedState
                            ) ||
                            null
                          }
                          isDisabled={!selectedCountry}
                          menuPortalTarget={document.body}
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#f0f3fb",
                              borderColor: state.isFocused
                                ? themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#623de7"
                                : themeColorMode === "dark"
                                ? "#313e49"
                                : "#d1d5db",
                              color:
                                themeColorMode === "dark"
                                  ? "#f0f3fb"
                                  : "#000000",
                              "&:hover": {
                                borderColor:
                                  themeColorMode === "dark"
                                    ? "#313e49"
                                    : "#623de7",
                              },
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color:
                                themeColorMode === "dark"
                                  ? "#ffffff"
                                  : "#000000",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color:
                                themeColorMode === "dark"
                                  ? "#ffffff"
                                  : "#6b7280",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                state.isFocused || state.isSelected
                                  ? themeColorMode === "dark"
                                    ? "#5b21b6"
                                    : "#623de7"
                                  : themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#ffffff",
                              color:
                                state.isFocused || state.isSelected
                                  ? "#ffffff"
                                  : themeColorMode === "dark"
                                  ? "#e5e7eb"
                                  : "#000000",
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
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        City
                      </label>
                      <div className="relative">
                        <Select
                          options={citiesOptions}
                          onChange={(selectedOption) => {
                            setFieldValue("city", selectedOption);
                            setSelectedCity(
                              selectedOption ? selectedOption.value : null
                            );
                          }}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Select City"
                          value={
                            values.city ||
                            (Array.isArray(citiesOptions) &&
                              citiesOptions.find(
                                (option: { value: string }) =>
                                  option.value === selectedCity
                              )) ||
                            null
                          }
                          isDisabled={!selectedCountry}
                          menuPortalTarget={document.body}
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#f0f3fb",
                              borderColor: state.isFocused
                                ? themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#623de7"
                                : themeColorMode === "dark"
                                ? "#313e49"
                                : "#d1d5db",
                              color:
                                themeColorMode === "dark"
                                  ? "#f0f3fb"
                                  : "#000000",
                              "&:hover": {
                                borderColor:
                                  themeColorMode === "dark"
                                    ? "#313e49"
                                    : "#623de7",
                              },
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color:
                                themeColorMode === "dark"
                                  ? "#ffffff"
                                  : "#000000",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            placeholder: (provided) => ({
                              ...provided,
                              color:
                                themeColorMode === "dark"
                                  ? "#ffffff"
                                  : "#6b7280",
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor:
                                state.isFocused || state.isSelected
                                  ? themeColorMode === "dark"
                                    ? "#5b21b6"
                                    : "#623de7"
                                  : themeColorMode === "dark"
                                  ? "#313e49"
                                  : "#ffffff",
                              color:
                                state.isFocused || state.isSelected
                                  ? "#ffffff"
                                  : themeColorMode === "dark"
                                  ? "#e5e7eb"
                                  : "#000000",
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
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-2.5 block font-medium text-black dark:text-white"
                        htmlFor="insurancePlans"
                      >
                        Insurance Plan
                      </label>
                      <Select
                        isMulti
                        options={insuranceOptions}
                        onChange={(selectedOptions) => {
                          const selectedValues = selectedOptions
                            ? selectedOptions.map((option) => option.value)
                            : [];
                          setFieldValue("insurancePlans", selectedValues);
                          setSelectedOptions(selectedOptions ?? []);
                        }}
                        className="basic-multi-select dark:bg-meta-4 dark:text-white"
                        classNamePrefix="select"
                        placeholder="Select Insurance Plan"
                        value={selectedOptions}
                        menuPortalTarget={document.body}
                        styles={{
                          control: (provided, state) => ({
                            ...provided,
                            backgroundColor:
                              themeColorMode === "dark" ? "#313e49" : "#f0f3fb",
                            borderColor: state.isFocused
                              ? themeColorMode === "dark"
                                ? "#313e49"
                                : "#623de7"
                              : themeColorMode === "dark"
                              ? "#4b5563"
                              : "#d1d5db",
                            boxShadow: state.isFocused
                              ? themeColorMode === "dark"
                                ? "0 0 0 1px #5b21b6"
                                : "0 0 0 1px #623de7"
                              : undefined,
                            color:
                              themeColorMode === "dark" ? "#f0f3fb" : "#000000",
                            "&:hover": {
                              borderColor:
                                themeColorMode === "dark"
                                  ? "#5b21b6"
                                  : "#623de7",
                            },
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            color:
                              themeColorMode === "dark" ? "#ffffff" : "#000000",
                          }),
                          multiValue: (provided) => ({
                            ...provided,
                            backgroundColor:
                              themeColorMode === "dark" ? "#000000" : "#e5e7eb",
                            color:
                              themeColorMode === "dark" ? "#ffffff" : "#000000",
                          }),
                          multiValueLabel: (provided) => ({
                            ...provided,
                            color:
                              themeColorMode === "dark" ? "#ffffff" : "#000000",
                          }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color:
                              themeColorMode === "dark" ? "#ffffff" : "#000000",
                            "&:hover": {
                              backgroundColor:
                                themeColorMode === "dark"
                                  ? "#6b7280"
                                  : "#d1d5db",
                              color:
                                themeColorMode === "dark"
                                  ? "#ffffff"
                                  : "#000000",
                            },
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          placeholder: (provided) => ({
                            ...provided,
                            color:
                              themeColorMode === "dark" ? "#9ca2af" : "#6b7280",
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor:
                              state.isFocused || state.isSelected
                                ? themeColorMode === "dark"
                                  ? "#5b21b6"
                                  : "#623de7"
                                : themeColorMode === "dark"
                                ? "#313e49"
                                : "#ffffff",
                            color:
                              state.isFocused || state.isSelected
                                ? "#ffffff"
                                : themeColorMode === "dark"
                                ? "#e5e7eb"
                                : "#000000",
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
                        className="text-red-500 dark:text-red-400"
                      />
                      <span className="absolute top-2 right-4 z-10 -translate-y-1/2">
                        <IoIosArrowDown className="text-black dark:text-white" />
                      </span>
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="bio"
                    >
                      Bio
                    </label>
                    <div className="relative">
                      <Field
                        name="bio"
                        id="bio"
                        rows={6}
                        maxLength={500}
                        placeholder="Write your bio here"
                        as="textarea"
                        className="w-full max-h-40 min-h-20 rounded border border-stroke bg-gray py-2 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.bio}
                      />
                      <ErrorMessage
                        name="bio"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="button"
                      onClick={() => {
                        const insuranceApiOptions: any = Array.isArray(
                          initialValues.insurancePlans
                        )
                          ? initialValues.insurancePlans.map((plan: []) => ({
                              value: plan,
                              label: plan,
                            }))
                          : [];
                        resetForm();
                        setFieldValue("country", initialValues.country);
                        setFieldValue("state", initialValues.state);
                        setFieldValue("city", initialValues.city);
                        setFieldValue("bio", initialValues.bio);
                        setSelectedOptions(insuranceApiOptions);
                        setFieldValue(
                          "insurancePlans",
                          initialValues.insurancePlans
                        );
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-[#623de7] py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Save
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

export default Profile;
