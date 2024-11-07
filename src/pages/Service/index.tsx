import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { MdDeleteForever, MdModeEditOutline } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import Modal from "../../components/Modal";
import servicesService from "../../Services/services.service";
import { useWillMountHook } from "../../Utils/helper";
import ServiceFormModal from "./ServiceForm";

interface ServiceData {
  _id: string;
  name: string;
  description: string;
  rate: string;
}

const Service: React.FC = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [usersPerPage] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] =
    useState<boolean>(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] =
    useState<boolean>(false);
  const [isServiceData, setIsServiceData] = useState<ServiceData>();
  const [serviceData, setServiceData] = useState<ServiceData[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getAllServiceList = async (
    currentPage?: string | number,
    searchValue?: string
  ) => {
    try {
      const response: AxiosResponse = await servicesService.getProviderService(
        currentPage ?? "",
        usersPerPage ?? "",
        searchValue ?? ""
      );
      setServiceData(response?.data?.result?.ServiceDetails);
      setTotal(response?.data?.result?.totalCount);
    } catch (error) {
      console.log("🚀 ~ getAllServiceList ~ error:", error);
    }
  };

  useWillMountHook(() => {
    getAllServiceList(currentPage, searchValue);
  });

  const handleSearchChange = () => {
    setCurrentPage(1);
    getAllServiceList(currentPage, searchValue);
  };

  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected + 1);
  };

  const handleDeleteServiceDetails = async () => {
    try {
      const response: AxiosResponse =
        await servicesService.deleteServiceDetails(serviceId);
      setCurrentPage(1);
      getAllServiceList(currentPage, searchValue);
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
      console.log("🚀 ~ handleDeleteServiceDetails ~ error:", error);
    }
  };

  useEffect(() => {
    getAllServiceList(currentPage, searchValue);
  }, [currentPage]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <div className="relative">
          <button className="absolute left-3 top-5 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
            <IoSearchOutline />
          </button>

          <input
            type="text"
            placeholder="Type to search..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value === "") {
                getAllServiceList(currentPage, e.target.value);
              }
              const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

              if (specialCharRegex.test(e.target.value)) {
                setErrorMessage(
                  "Invalid search. Please avoid special characters."
                );
              } else {
                setErrorMessage("");
                setSearchValue(e.target.value);
              }
            }}
            className="w-full bg-white dark:bg-meta-4 border border-gray-300 rounded-lg shadow-sm pl-10 pr-4 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-300 xl:w-125 transition"
          />
          <button
            onClick={handleSearchChange}
            className="inline-flex items-center ml-5 justify-center rounded-full bg-[#623de7] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Search
          </button>
        </div>
        <button onClick={() => setIsAddServiceModalOpen(true)}>
          <IoMdAddCircle className="w-10 h-10 text-[#623de7] cursor-pointer" />
        </button>
      </div>

      {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}

      {serviceData?.length > 0 || total === 0 ? (
        <div className="px-5 pt-6 pb-2.5 sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto h-[610px]">
            {total === 0 ? (
              <div className="text-xl text-center p-2">No services Found.</div>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      Name
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Description
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Rate
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceData.map((details: ServiceData, index: number) => (
                    <tr key={index} className="text-left">
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {details.name}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white line-clamp-1">
                          {details.description}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          ${details.rate}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-[#623de7]"
                            onClick={() => {
                              setIsEditServiceModalOpen(true);
                              setIsServiceData(details);
                            }}
                          >
                            <MdModeEditOutline className="w-6 h-6" />
                          </button>
                          <button
                            className="hover:text-[#623de7]"
                            onClick={() => {
                              setDeleteModalOpen(true);
                              setServiceId(details?._id);
                            }}
                          >
                            <MdDeleteForever className="w-6 h-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pagination-container sticky">
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

          <Modal
            title="Are you sure want to delete service?"
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onSave={() => {
              setDeleteModalOpen(false);
              handleDeleteServiceDetails();
            }}
          />
        </div>
      ) : (
        <h1 className="text-xl text-center">No services available!</h1>
      )}

      <ServiceFormModal
        title="Add Service"
        isOpen={isAddServiceModalOpen}
        onClose={() => {
          setCurrentPage(1);
          setIsAddServiceModalOpen(false);
          getAllServiceList(currentPage, searchValue);
        }}
      />

      <ServiceFormModal
        isEditData={isServiceData}
        title="Edit Service"
        isOpen={isEditServiceModalOpen}
        onClose={() => {
          setCurrentPage(1);
          setIsEditServiceModalOpen(false);
          getAllServiceList(currentPage, searchValue);
        }}
      />
    </div>
  );
};

export default Service;
