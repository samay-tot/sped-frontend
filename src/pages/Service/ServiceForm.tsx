import { AxiosResponse } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import servicesService from "../../Services/services.service";

interface ServiceFormModal {
  isEditData?: ServiceForm;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceForm {
  _id?: string;
  name: string;
  description: string;
  rate: string;
}

const ServiceFormModal: React.FC<ServiceFormModal> = ({
  title,
  isOpen,
  onClose,
  isEditData,
}) => {
  const initialValues: ServiceForm = {
    name: isEditData ? isEditData?.name : "",
    description: isEditData ? isEditData?.description : "",
    rate: isEditData ? isEditData?.rate : "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
    .required("Service Name is required")
    .min(2, "Service Name must be between 2 and 50 characters")
    .max(50, "Service Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s,.-]*$/, "Service Name can contain alphanumeric characters, commas, periods, and hyphens"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be between 10 and 500 characters")
      .max(500, "Description must be between 10 and 500 characters")
      .matches(/^[a-zA-Z0-9\s,.-]*$/, "Description can contain alphanumeric characters, commas, periods, and hyphens"),
    rate: Yup.number()
      .required("Rate is required")
      .max(9999, "Rate cannot exceed 9999")
      .typeError("Rate must be a number")
      .test(
        "max-decimal-places",
        "Rate must be a numeric value with up to 2 decimal places",
        (value) => {
          if (value === undefined || value === null) return true;
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        }
      ),
  });

  const handleSubmit = async (values: ServiceForm) => {
    if (isEditData?._id) {
      try {
        const response: AxiosResponse =
          await servicesService.updateServiceDetails(isEditData?._id, values);
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
    } else {
      try {
        const response: AxiosResponse = await servicesService.addServices(
          values
        );
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
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black dark:bg-white opacity-50"
      ></div>
      <div className="bg-white dark:bg-boxdark rounded-lg p-6 z-10 xl:w-125 w-96">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="p-5">
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1 text-black dark:text-white"
                  htmlFor="name"
                >
                  Service Name
                </label>
                <Field
                  type="text"
                  name="name"
                  maxLength={50}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="Enter Service Name"
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const regex = /^[^0-9]*$/;
                    if (!regex.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1 text-black dark:text-white"
                  htmlFor="description"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter Service Description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={500}
                  value={values.description}
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const regex = /^[^0-9]*$/;
                    if (!regex.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full max-h-40 min-h-15 rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1 text-black dark:text-white"
                  htmlFor="rate"
                >
                  Rate
                </label>
                <Field
                  type="text"
                  name="rate"
                  placeholder="Enter Service Rate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.rate}
                  onKeyPress={(
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    const target = event.target as HTMLInputElement;
                    if (!/[0-9.]/.test(event.key) || (event.key === '.' && target.value.includes('.'))) {
                      event.preventDefault();
                    }
                  }}
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="rate"
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

export default ServiceFormModal;
