import React from "react";
import { useNavigate } from "react-router-dom";
import { IMG } from "../../assets/icon";
import { navigateToRoute } from "../../Utils/helper";

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 h-187.5 flex items-center justify-center">
      <div className="dark:bg-meta-4 p-6  md:mx-auto dark:text-gray-3">
        <img
          src={IMG.cancleIcon}
          className="w-30 h-30 flex items-center justify-center m-auto"
        />
        <div className="text-center">
          <h3 className="md:text-3xl text-base text-gray-900 font-semibold text-center">
            Oops, Your Payment Failed!
          </h3>
          <p className="text-gray-600 my-2">Please try again later.</p>
          <div className="pt-10 text-cente  r">
            <button
              onClick={async() => {
                navigateToRoute(navigate, "/subscription", true);
                const token = new URLSearchParams(location.search).get("token");
                if (token) {
                  await localStorage.setItem("token", token);
                }
              }}
              className="inline-flex items-center justify-center rounded-full bg-[#623de7] py-4 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
