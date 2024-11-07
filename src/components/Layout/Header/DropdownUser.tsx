import { ReactNode, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoPerson } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IMAGE } from "../../../assets/images";
import { RootState } from "../../../Redux";
import { setHeaderTitle } from "../../../Redux/auth/reducer";
import authService from "../../../Services/auth.service";
import storeService from "../../../Services/store.service";
import ClickOutside from "../../ClickOutside";
import Modal from "../../Modal";

interface DropdownType {
  path: string;
  icon: ReactNode;
  title: string;
  headerTitle: string;
}

const DropdownUser: React.FC = () => {
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { LoginDetails } = useSelector((state: RootState) => state.auth);

  const dropdownData: DropdownType[] = [
    {
      path: "/profile",
      icon: <IoPerson />,
      title: "My Profile",
      headerTitle: "Profile Management",
    },
  ];

  const handleLogout = async () => {
    const token: string | null = await localStorage.getItem("token");
    try {
      await authService.logout(token);
      setModalOpen(false);
      storeService.logout();
    } catch (error) {
      console.error("🚀 ~ handleLogout ~ error:", error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {LoginDetails?.firstName}
          </span>
          <span className="block text-xs">{LoginDetails?.occupation}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <img src={IMAGE.dummyUser} alt="User" className="rounded-full" />
        </span>

        <IoIosArrowDown />
      </Link>

      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          {dropdownData?.map((data: DropdownType, index: number) => (
            <ul
              className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark"
              key={index}
            >
              <li>
                <Link
                  to={data.path}
                  onClick={() => {
                    setDropdownOpen(false);
                    dispatch(setHeaderTitle(data?.headerTitle));
                  }}
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  {data.icon}
                  {data.title}
                </Link>
              </li>
            </ul>
          ))}
          <button
            className="flex items-center px-6 py-7.5 gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            onClick={() => {
              setModalOpen(true);
              setDropdownOpen(false);
            }}
          >
            <TbLogout2 />
            Logout
          </button>
        </div>
      )}

      <Modal
        title="Are you sure want to logout?"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleLogout}
      />
    </ClickOutside>
  );
};

export default DropdownUser;
