import React, { createRef, ReactNode, useRef } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaArrowLeft, FaCopy } from "react-icons/fa";
import { MdMedicalServices } from "react-icons/md";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { setHeaderTitle } from "../../../Redux/auth/reducer";
import { useWillMountHook } from "../../../Utils/helper";

interface SidebarProps {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg: boolean) => void;
}

interface MenuItems {
  path: string;
  label: string;
  headerTitle: string;
  icon: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const trigger = createRef<HTMLButtonElement>();
  const sidebar = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useWillMountHook(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen) return;
      if (target instanceof Node) {
        if (
          sidebar.current.contains(target) ||
          trigger.current.contains(target)
        )
          return;
      }
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const menuItems: MenuItems[] = [
    {
      path: "/profile",
      label: "Profile",
      headerTitle: "Profile Management",
      icon: <BsPersonCircle />,
    },
    {
      path: "/service",
      label: "Service",
      headerTitle: "Service Management",
      icon: <MdMedicalServices />,
    },
    {
      path: "/subscription",
      label: "Subscription",
      headerTitle: "Plan Subscription",
      icon: <RiMoneyDollarBoxFill />,
    },
    {
      path: "/coupon-code",
      label: "Coupon Code",
      headerTitle: "Coupon Code",
      icon: <FaCopy />,
    },
    // {
    //   path: "/directory",
    //   label: "Directory",
    //   headerTitle: "Directory of Providers",
    //   icon: <ImProfile />,
    // },
  ];

  return (
    <div>
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <div className="text-white font-semibold  flex text-center text-2xl">
            SpEd Connect
          </div>
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen === true || sidebarOpen === "true"}
            className="block lg:hidden"
          >
            <FaArrowLeft className="fill-white" />
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6 h-180">
            <div>
              {menuItems.map((data: MenuItems, index: number) => (
                <ul className="mb-6 flex flex-col gap-1.5" key={index}>
                  <li>
                    <NavLink
                      to={data.path}
                      onClick={() =>
                        dispatch(setHeaderTitle(data?.headerTitle))
                      }
                      className={({ isActive }) =>
                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-white " +
                        (isActive ? "text-white bg-gray-700" : "text-bodydark2")
                      }
                    >
                      {data.icon}
                      {data.label}
                    </NavLink>
                  </li>
                </ul>
              ))}
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
