import React, { ReactNode, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<string | boolean | undefined>(
    false
  );
  const { LoginDetails } = useSelector((state: RootState) => state.auth);

  return LoginDetails?.email !== "" ? (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default Layout;
