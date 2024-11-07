import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { useDispatch } from "react-redux";
import { IMAGE } from "../../assets/images";
import { setUserActivePlanDetails } from "../../Redux/auth/reducer";
import planService from "../../Services/plan.service";
import { useWillMountHook } from "../../Utils/helper";
import moment from "moment";

interface PlanDetails {
  _id: string;
  name: string;
  type: string;
  price: string;
  isActivePlan: boolean;
  description: [];
}

const Subscription: React.FC = () => {
  const dispatch = useDispatch();
  const [planDetails, setPlanDetails] = useState<PlanDetails[]>([]);
  const [activePlanExpiration, setActivePlanExpiration] = useState<string>("");

  const getPlanSubscriptionList = async () => {
    try {
      const response: AxiosResponse = await planService.getPlanSubscription();
      setPlanDetails(response?.data?.result?.transformedArray);
      setActivePlanExpiration(response?.data?.result?.activePlanExpiration);
      const activePlan: PlanDetails =
        response?.data?.result?.transformedArray?.find(
          (plan: PlanDetails) => plan?.isActivePlan
        );
      dispatch(setUserActivePlanDetails(activePlan));
    } catch (error) {
      console.log("🚀 ~ getPlanSubscriptionList ~ error:", error);
    }
  };

  const handleStripePayment = async (id: string) => {
    try {
      const response: any = await planService.addStripePayment(id);
      document.open();
      document.write(response);
      document.close();
    } catch (error) {
      console.log("🚀 ~ handleStripePayment ~ error:", error);
    }
  };

  useWillMountHook(() => {
    getPlanSubscriptionList();
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center lg:justify-items-start">
        <div className="flex flex-col flex-wrap max-w-[360px] md:w-[384px] min-h-[572px] p-6 bg-[#623de7] group rounded-2xl relative overflow-hidden">
          <div className="text-start text-white">
            <span className="font-light text-3xl">Save More</span>
            <br />
            <span className="font-bold text-3xl">With Goodplans</span>
            <br />
            <div className="text-lg leading-7">
              Choose a plan and get onboard in minutes. Then get $100 credits
              for your next payment.
            </div>
            <FaArrowRight className="w-10 h-10 mt-5" />
          </div>
          <div className="absolute bottom-0 h-[300px]">
            <img
              src={IMAGE.paymentImage}
              alt="girl image for promot pricing plan"
            />
          </div>
        </div>

        {planDetails?.map((data: PlanDetails, index: number) => (
          <div
            key={index}
            className={`flex flex-col dark:bg-meta-4 dark:text-gray-3 max-w-[360px] md:w-[384px] min-h-[518px] md:min-h-[572px] p-6 bg-white group rounded-2xl border ${
              data.isActivePlan
                ? "border-green-500 border-2"
                : "border-[#0B0641]"
            } relative`}
          >
            {data.isActivePlan && (
              <p className="absolute top-0 right-4 py-1.5 px-4 bg-emerald-500 border-2 border-green-700 text-white rounded-full text-xs font-semibold uppercase tracking-wide  transform -translate-y-1/2">
                Active Plan
              </p>
            )}
            <div className="flex flex-row gap-5 items-center">
              <span className="text-3xl font-bold">{data.name}</span>
            </div>
            <span className="flex mt-4 text-[#A9A9AA] text-[22px]">
              What You&apos;ll Get
            </span>
            {data?.description?.map((myData, index) => (
              <div
                key={index}
                className="flex flex-row gap-3 items-start mt-6 text-left text-lg"
              >
                <div className="pt-1 shrink-0">
                  <TiTick className="w-7 h-7" />
                </div>
                <span>{myData}</span>
              </div>
            ))}
            <div className="border border-dashed border-[#A9A9AA] tracking-widest my-4" />
            <div className="h-28">
              <div className="flex flex-col gap-4 justify-between absolute left-6 right-6 bottom-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{data.price}</span>
                  <span>/ {data.type}</span>
                </div>
                {!data.isActivePlan && (
                  <div className="flex align-bottom">
                    <button
                      type="submit"
                      onClick={() => handleStripePayment(data?._id)}
                      className="inline-flex items-center justify-center rounded-full bg-[#623de7] py-4 px-8 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                      Choose
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {activePlanExpiration && (
        <p className="text-lg md:mt-16 mt-4 flex justify-center items-center">
          <strong className="mr-2">Plan expired on: </strong>
          {moment(activePlanExpiration).format("MMMM Do, YYYY")}
        </p>
      )}
    </>
  );
};

export default Subscription;
