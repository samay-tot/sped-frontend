import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { IoIosArrowBack, IoMdMail, IoMdStar } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RatingModal from "../../components/RatingModal";
import { RootState } from "../../Redux";
import providerService from "../../Services/provider.service";
import { navigateToRoute, useWillMountHook } from "../../Utils/helper";
import { IMAGE } from "../../assets/images";

interface ServiceData {
  _id: string;
  name: string;
  description: string;
  rate: number;
  providerId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
interface ProviderDetails {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  occupation: string;
  phoneNumber: string;
  fullAddress: string;
  email: string;
  averageRate: number;
  ratingsCount: number;
  bio: string;
  insurancePlans: string[];
  services: ServiceData[];
}

const DirectoryDetails: React.FC = () => {
  const navigate = useNavigate();
  const { providerId } = useSelector((state: RootState) => state.auth);
  const [providerData, setProviderData] = useState<ProviderDetails>();
  const [ratingModal, setRatingModal] = useState<boolean>(false);

  const getProviderDetails = async () => {
    const token: string | null = await localStorage.getItem("directoryToken");
    try {
      const response: AxiosResponse = await providerService.getProviderData(
        providerId,
        token
      );
      setProviderData(response?.data?.result);
      console.log(
        "🚀 ~ getProviderDetails ~ response:",
        response?.data?.result
      );
    } catch (error) {
      console.log("🚀 ~ getAllInsuranceList ~ error:", error);
    }
  };

  const handleOnUserTrack = async (type: string) => {
    const token: string | null = await localStorage.getItem("directoryToken");
    try {
      const response: AxiosResponse = await providerService.UserTrackData(
        providerId,
        type,
        token
      );
      console.log("🚀 ~ handleOnUserTrack ~ response:", response);
    } catch (error) {
      console.log("🚀 ~ handleOnUserTrack ~ error:", error);
    }
  };

  useWillMountHook(async () => {
    getProviderDetails();
  });

  return (
    <>
      <header
        className={`sticky top-0 z-999 shadow-2 p-5 flex gap-10 w-full bg-gray-3 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none ${
          ratingModal ? "bg-black bg-opacity-20" : ""
        }`}
      >
        <div className="flex gap-5">
          <div
            className="flex justify-start items-start cursor-pointer"
            onClick={() => navigateToRoute(navigate, "/directory", true)}
          >
            <IoIosArrowBack className="lg:w-7 lg:h-7 w-5 h-5" />
          </div>
        </div>
      </header>
      <div className="p-5 bg-gray-3">
        <div className="p-5 bg-gray-3 h-[770px]">
          <div className="flex flex-col md:flex-row justify-evenly lg:gap-10 gap-1 items-start">
            <div className="flex flex-col items-center w-full md:w-2/3">
              <div className="lg:p-4 p-3 w-full">
                <div className="bg-white dark:bg-meta-4 shadow-md rounded-lg overflow-hidden">
                  <div className="flex flex-col justify-start items-center md:flex-row lg:p-6 p-4 gap-5">
                    <img
                      src={IMAGE.dummyUser}
                      alt="Profile Photo"
                      className="w-40 h-40 rounded mb-4 md:mb-0"
                    />
                    <div className="ml-0 md:ml-6">
                      <h2 className="lg:text-xl text-base font-bold capitalize">{`${providerData?.firstName} ${providerData?.lastName}`}</h2>
                      <p className="lg:text-base text-sm text-gray-400 mt-1">
                        {providerData?.occupation ?? "-"}
                      </p>
                      {/* <div className="flex mt-2">
                      <MdPhoneInTalk className="lg:w-5 lg:h-5 w-4 h-4 mt-0.5" />
                      <p className="lg:text-base text-sm text-gray-400 ml-3">
                        {providerData?.phoneNumber ?? "-"}
                      </p>
                    </div> */}
                      {/* <div className="flex justify-between items-center my-2">
                      <RatingStars rating={providerData?.averageRate ?? 0} />
                    </div> */}

                      <div className="flex items-center gap-3">
                        {providerData?.averageRate &&
                        providerData?.averageRate > 0 ? (
                          <button className="flex text-sm justify-between items-center my-2 mt-2 bg-green-600 text-white rounded-md px-2 py-1">
                            {providerData?.averageRate?.toFixed(1)}{" "}
                            <IoMdStar className="w-4 h-4 ml-1" />
                          </button>
                        ) : (
                          <button className="flex text-sm justify-between items-center my-2 mt-2 bg-green-600 text-white rounded-md px-2 py-1">
                            0 <IoMdStar className="w-4 h-4 ml-1" />
                          </button>
                        )}
                        <div className="text-sm">
                          {providerData?.ratingsCount} ratings
                        </div>
                      </div>
                      <button
                        className="bg-[#f69f1d] text-white rounded-lg lg:py-2 lg:px-4 py-1 px-2 lg:text-base text-sm transition cursor-pointer"
                        onClick={() => setRatingModal(true)}
                      >
                        Leave a rating
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {providerData?.bio && (
                <div className="lg:p-4 p-2 w-full">
                  <div className="bg-white dark:bg-meta-4 shadow-md rounded-lg overflow-hidden lg:p-6 p-4">
                    <h3 className="lg:text-xl text-base font-semibold">Bio</h3>
                    <div className="lg:text-base text-sm font-light ml-2 mt-5">
                      {providerData?.bio ?? "-"}
                    </div>
                  </div>
                </div>
              )}

              {providerData?.services && providerData?.services?.length > 0 && (
                <div className="lg:p-4 p-2 w-full">
                  <div className="bg-white dark:bg-meta-4 shadow-md rounded-lg overflow-hidden lg:p-6 p-4">
                    <h3 className="text-lg font-semibold">Provider Services</h3>
                    <table className="min-w-full mt-5">
                      <thead>
                        <tr className="border-b-2 border-gray">
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                            Service Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
                            Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {providerData.services.map((data, index) => (
                          <tr
                            key={index}
                            className="last:border-0 border-b-2 border-gray"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {data?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${data?.rate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-auto w-full md:w-1/4">
              <div className="lg:p-4 p-2">
                <a
                  href={`tel:+${providerData?.phoneNumber}`}
                  onClick={() => handleOnUserTrack("call")}
                  className="flex flex-row justify-start items-center lg:gap-3 gap-1 bg-[#d59af2] shadow-md rounded-lg overflow-hidden p-4"
                >
                  <IoCall className="w-6 h-6 text-white" />
                  <div className="text-white text-center lg:text-left lg:text-base text-sm font-light ml-2">
                    {providerData?.phoneNumber}
                  </div>
                </a>
                {/* <a
                    href={`tel:+${providerData?.phoneNumber}`}
                    onClick={() => handleOnUserTrack("call")}
                    className="bg-[#e4bdf7] text-white rounded-lg py-2 px-4 transition w-24 text-center lg:text-base text-sm"
                  >
                    Contact
                  </a> */}
              </div>
              <div className="lg:p-4 p-2">
                <a
                  href={`mailto:${providerData?.email}`}
                  onClick={() => handleOnUserTrack("email")}
                  className="flex flex-row justify-start items-center lg:gap-3 gap-1 bg-[#d59af2] shadow-md rounded-lg overflow-hidden p-4"
                >
                  <IoMdMail className="w-6 h-6 text-white" />
                  <div className="text-white lg:text-base text-sm font-light ml-2">
                    {providerData?.email}
                  </div>
                </a>
              </div>
              <div className="lg:p-4 p-2">
                <div className="bg-white shadow-md rounded-lg overflow-hidden lg:p-6 p-4">
                  <div>
                    <h3 className="lg:text-xl text-base font-semibold">
                      Location
                    </h3>
                    <div className="lg:text-base text-sm font-light ml-2 mt-5 capitalize">
                      {providerData?.fullAddress ?? "-"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:p-4 p-2">
                <div className="bg-white dark:bg-meta-4 shadow-md rounded-lg overflow-hidden lg:p-6 p-4">
                  <h3 className="lg:text-xl text-base font-semibold">
                    Accepted Insurance Plans
                  </h3>
                  {providerData?.insurancePlans && (
                    <ul className="list-disc list-inside text-gray-300 mt-5 lg:text-base text-sm font-light ml-2 capitalize">
                      {providerData.insurancePlans.map((data, index) => (
                        <li key={index}>{data}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <RatingModal
          id={providerId}
          isOpen={ratingModal}
          onClose={() => setRatingModal(false)}
          handleClick={getProviderDetails}
        />
      </div>
    </>
  );
};

export default DirectoryDetails;
