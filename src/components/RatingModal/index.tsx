import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import providerService from "../../Services/provider.service";
import { AxiosResponse } from "axios";

interface RatingModalProps {
  id: string;
  onClose: () => void;
  handleClick: () => void;
  isOpen: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({ id, onClose, handleClick, isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to reset the overflow when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validationSchema = Yup.object().shape({
    rating: Yup.number()
      .required("Rating is required")
      .min(1, "Select a rating"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters long"),
  });

  const handleSubmit = async (values: { rating: number; description: string }) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    const token: string | null = await localStorage.getItem("directoryToken");
    try {
      const response: AxiosResponse = await providerService.addRatingData(
        {
          providerId: id,
          rate: values.rating,
          description: values.description,
        },
        token
      );
      console.log("🚀 ~ response:", response);
      onClose();
      handleClick();
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white p-6 rounded shadow-lg xl:w-125 w-90"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-5">Give Your Review</h2>
        <Formik
          initialValues={{ rating: 0, description: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form>
              <div className="mb-6">
                <label
                  className="block text-base font-medium mb-3 text-black dark:text-white"
                  htmlFor="name"
                >
                  Rating:
                </label>
                <div className="flex mb-4 gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      onClick={() => setFieldValue("rating", star)}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= values.rating ? "text-[#f69f1d]" : "text-slate-400"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 15.27L16.18 20l-1.64-7.03L20 8.24l-7.19-.61L10 2 7.19 7.63 0 8.24l5.46 4.73L3.82 20z" />
                    </svg>
                  ))}
                </div>
                <div>
                  {errors.rating && touched.rating && (
                    <div className="text-red-500 mb-2">{errors.rating}</div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-base font-medium mb-3 text-black dark:text-white"
                  htmlFor="name"
                >
                  Description:
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-full max-h-80 min-h-40 rounded-lg border bg-transparent py-2 pl-2 pr-10 text-black outline-none focus:border-primary"
                  placeholder="Enter your description"
                />
                {errors.description && touched.description && (
                  <div className="text-red-500">{errors.description}</div>
                )}
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

export default RatingModal;
