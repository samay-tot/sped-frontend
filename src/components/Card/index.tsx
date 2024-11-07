import { AxiosResponse } from "axios";
import React from "react";
import { IoMdStar } from "react-icons/io";
import { MdCall } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProviderId } from "../../Redux/auth/reducer";
import providerService from "../../Services/provider.service";
import { navigateToRoute } from "../../Utils/helper";

interface DirectoryCardProps {
  id: string;
  firstName: string;
  lastName: string;
  occupation: string;
  rating: number;
  ratingsCount: number;
  address: string;
  phoneNumber: string;
  profilePhoto: string | null;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({
  id,
  firstName,
  lastName,
  occupation,
  rating,
  address,
  phoneNumber,
  profilePhoto,
  ratingsCount
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnUserTrack = async (type: string) => {
    const token: string | null = await localStorage.getItem("directoryToken");
    try {
      const response: AxiosResponse = await providerService.UserTrackData(
        id,
        type,
        token
      );
      console.log("🚀 ~ handleOnUserTrack ~ response:", response);
    } catch (error) {
      console.log("🚀 ~ handleOnUserTrack ~ error:", error);
    }
  };

  return (
    <div className="rounded-xl border border-stroke bg-white p-4 shadow-xl dark:border-strokedark dark:bg-boxdark">
      <div
        className="flex justify-around items-center"
        onClick={() => {
          navigateToRoute(navigate, "/directory-details", true);
          dispatch(setProviderId(id));
        }}
      >
        <div className="flex md:h-25 md:w-25 h-20 w-20 items-center justify-center rounded-full mt-3.5">
          {profilePhoto !== null ? (
            <img src={profilePhoto} alt="photo" className="rounded-full" />
          ) : (
            <div>No photo</div>
          )}
        </div>

        <div className="lg:w-50 w-40 lg:ml-0 ml-2">
          <h4 className="lg:text-title-sm text-lg font-bold text-black dark:text-white capitalize">
            {`${firstName} ${lastName}`}
          </h4>
          <div className="text-sm font-light mt-2 capitalize">{occupation}</div>
          <div className="flex items-center gap-3">
          {rating > 0 ? (
            <button className="flex text-sm justify-between items-center my-2 mt-2 bg-green-600 text-white rounded-md px-2 py-1">
              {rating?.toFixed(1)} <IoMdStar className="w-4 h-4 ml-1" />
            </button>
          ) : (
            <button className="flex text-sm justify-between items-center my-2 mt-2 bg-green-600 text-white rounded-md px-2 py-1">
              0 <IoMdStar className="w-4 h-4 ml-1" />
            </button>
          )}
          <div className="text-sm">{ratingsCount} ratings</div>
          </div>
          <div className="text-sm font-light mt-2 capitalize">{address}</div>
        </div>

        <div className="cursor-pointer lg:p-7 p-3">
          {phoneNumber && (
            <div className="flex mt-2 hover:animate-vibrate hover:text-green-600">
              <a
                href={`tel:+${phoneNumber}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOnUserTrack("call");
                }}
              >
                <MdCall className="w-5 h-5" /> Call
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectoryCard;
