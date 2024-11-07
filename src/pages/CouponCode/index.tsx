import { AxiosResponse } from "axios";
import { useFormik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { PiCopy } from "react-icons/pi";
import { TiTick } from "react-icons/ti";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip as ReactTooltip } from "react-tooltip";
import * as Yup from "yup";
import { RootState } from "../../Redux";
import planService from "../../Services/plan.service";
import {
  ErrorResponse,
  navigateToRoute,
  useWillMountHook,
} from "../../Utils/helper";

interface CouponData {
  _id: string;
  code: string;
  isActive: boolean;
  expiration: string;
  isUsed: boolean;
  usedBy: null;
  planId: string;
}

const CouponCode: React.FC = () => {
  const navigate = useNavigate();
  const MAX_COUPONS = 50;
  const { userActivePlan, LoginDetails } = useSelector(
    (state: RootState) => state.auth
  );
  const [couponData, setCouponData] = useState<CouponData[]>([]);
  const [couponExpiration, setCouponExpiration] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [tooltipContent, setTooltipContent] = useState("Copy coupon code");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10);

  const handleToggle = async (id: string) => {
    try {
      const response: AxiosResponse = await planService.couponCodeDeactivated(
        id,
        {
          isActive: false,
        }
      );
      setCurrentPage(1);
      getCouponCodeList(1);
      toast(response?.data?.message, {
        position: "top-right",
        autoClose: 2000,
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

  const formik = useFormik({
    initialValues: {
      couponCodeNumber: "",
    },
    validationSchema: Yup.object({
      couponCodeNumber: Yup.number()
        .required("Number of Coupon Codes is required")
        .min(1, "Number of Coupon Codes must be between 1 and 50.")
        .max(MAX_COUPONS - total, `Cannot exceed ${MAX_COUPONS - total} more`)
        // .max(50, "Number of Coupon Codes must be between 1 and 50.")
        .typeError("Only numeric values are allowed.")
    }),
    onSubmit: async (values) => {
      const payload = {
        count: values.couponCodeNumber,
        planId: userActivePlan?._id,
      };
      try {
        await planService.createCouponCode(payload);
      } catch (error) {
        console.log("🚀 ~ onSubmit: ~ error:", error);
      }
      setCurrentPage(1);
      formik.resetForm();
      await getCouponCodeList(1);
    },
  });

  const getCouponCodeList = async (currentPage: string | number) => {
    try {
      const response: AxiosResponse = await planService.getCouponCodeList(
        currentPage ?? "",
        usersPerPage
      );
      setCouponData(response?.data?.result?.CouponsDetails);
      setCouponExpiration(response?.data?.result?.couponExpiration);
      setTotal(response?.data?.result?.totalCount);
    } catch (error) {
      console.log("🚀 ~ getCouponCodeList ~ error:", error);
    }
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected + 1);
    getCouponCodeList(data.selected + 1);
  };

  useWillMountHook(() => {
    getCouponCodeList(1);
  });

  return (
    <div>
      <div className="text-black dark:text-white text-center xl:py-10 py-5 xl:px-20 px-7 rounded-lg relative">
        {userActivePlan?.isActivePlan || LoginDetails?.isSubscribed ? (
          <>
            <form onSubmit={formik.handleSubmit}>
              <h3 className="text-2xl font-semibold mb-2 text-left">
                Generate Coupon Code:
              </h3>
              <div className="xl:flex items-center justify-center xl:w-125 w-94">
                <input
                  type="text"
                  placeholder="Enter No. of Coupon Code"
                  {...formik.getFieldProps("couponCodeNumber")}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  className={`w-full rounded-lg border-[1.5px] ${
                    formik.touched.couponCodeNumber &&
                    formik.errors.couponCodeNumber
                      ? "border-red-500"
                      : "border-stroke"
                  } bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                />

                <button
                  type="submit"
                  className="xl:w-100 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-base py-3 px-5 text-center m-4"
                >
                  Generate Coupon
                </button>
              </div>
              {formik.touched.couponCodeNumber &&
              formik.errors.couponCodeNumber ? (
                <div className="text-red-500 w-45">
                  {formik.errors.couponCodeNumber}
                </div>
              ) : null}
            </form>
          </>
        ) : (
          <div>
            <div className="text-2xl font-semibold mb-4">
              Please purchase any plan to generate the coupon code
            </div>
            <button
              onClick={() => navigateToRoute(navigate, "/subscription", true)}
              className="xl:w-100 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-base py-3 px-5 text-center m-4"
            >
              Go back to Plan Subscription
            </button>
          </div>
        )}
        {couponData?.length > 0 && (
          <div>
            <div className="rounded-sm border mt-8 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        Coupon Code
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {couponData?.map((coupon) => (
                      <tr
                        key={coupon._id}
                        className="border-b border-[#eee] dark:border-strokedark"
                      >
                        <td className="py-5 px-4 flex">
                          <div className="w-40 text-left">{coupon.code}</div>
                          {coupon.isActive && (
                            <span
                              onClick={() => {
                                navigator.clipboard.writeText(coupon.code);
                                setTooltipContent("Coupon code copied!");
                                setTimeout(() => {
                                  setTooltipContent("Copy coupon code");
                                }, 2000);
                              }}
                            >
                              <PiCopy
                                className="w-6 h-6 ml-5"
                                data-tooltip-id="coupon-code-id"
                              />
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-4">
                          <label
                            htmlFor={`toggle-${coupon._id}`}
                            className="flex cursor-pointer select-none items-center justify-center"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                id={`toggle-${coupon._id}`}
                                className="sr-only"
                                disabled={!coupon.isActive}
                                checked={coupon.isActive}
                                onChange={() => handleToggle(coupon._id)}
                              />
                              <div className="block h-8 w-14 rounded-full bg-gray-3 dark:bg-[#5A616B]"></div>
                              <div
                                className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                                  coupon.isActive &&
                                  "!right-1 !translate-x-full !bg-green-500"
                                }`}
                              >
                                <span
                                  className={`hidden ${
                                    coupon.isActive && "!block"
                                  }`}
                                >
                                  <TiTick />
                                </span>
                                <span
                                  className={`${coupon.isActive && "hidden"}`}
                                >
                                  <IoMdClose />
                                </span>
                              </div>
                            </div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-lg mt-4">
              <strong>Valid Till:</strong>{" "}
              {moment(couponExpiration).format("MMMM Do, YYYY")}
            </p>
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={Math.ceil(total / usersPerPage)}
              previousLabel="< Previous"
              className="flex items-end justify-end m-4"
              containerClassName="flex justify-center items-center mt-4"
              activeClassName="bg-[#623de7] text-white border-[#623de7]"
              pageClassName="mx-1"
              pageLinkClassName="inline-block w-10.5 h-10.5 text-center px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-[#623de7] hover:text-white"
              previousClassName="mx-1"
              previousLinkClassName="inline-block px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-[#623de7] hover:text-white"
              nextClassName="mx-1"
              nextLinkClassName="inline-block px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-[#623de7] hover:text-white"
              breakClassName="mx-1"
              breakLinkClassName="inline-block px-2 py-1 border border-gray-300 rounded-md text-gray-700"
              renderOnZeroPageCount={null}
              forcePage={currentPage - 1}
            />
          </div>
        )}
      </div>

      <ReactTooltip id="coupon-code-id" place="top" content={tooltipContent} />
    </div>
  );
};

export default CouponCode;
