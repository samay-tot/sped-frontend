import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import DirectoryCard from "../../components/Card";
import authService from "../../Services/auth.service";
import providerService from "../../Services/provider.service";
import { useWillMountHook } from "../../Utils/helper";
import { IMAGE } from "../../assets/images";

interface ProviderData {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  occupation: string;
  phoneNumber: string;
  address: string;
  averageRate: number;
  ratingsCount: number;
}

interface InsuranceList {
  _id: string;
  name: string;
}

const Directory: React.FC = () => {
  const isMobile = window.innerWidth < 768;
  const token = new URLSearchParams(location.search).get("token") || "";
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedRatingOptions, setSelectedRatingOptions] = useState({
    value: "",
    label: "All",
  });
  const [selectedPlanOptions, setSelectedPlanOptions] = useState({
    value: "",
    label: "All",
  });
  const [insurancePlanList, setInsurancePlanList] = useState<InsuranceList[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(12);
  const [providerData, setProviderData] = useState<ProviderData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const tokenDetails = async () => {
    await localStorage.setItem("directoryToken", token);
  }

  useEffect(() => {
    tokenDetails();
    getAllInsuranceList();
  }, [token]);

  useEffect(() => {
    if (isMobile) {
      fetchProviderData();
    }
  }, [currentPage, searchValue, selectedRatingOptions, selectedPlanOptions]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setHasMore(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    if (!observer.current) {
      observer.current = new IntersectionObserver(callback);
    }

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current && observer.current) {
        observer.current.unobserve(lastItemRef.current);
      }
    };
  }, [loading, hasMore]);

  useWillMountHook(async () => {
    await tokenDetails();
    getAllInsuranceList();
  });

  useEffect(() => {
    if (selectedRatingOptions || selectedPlanOptions) {
      getAllProviderList(
        currentPage,
        searchValue.trim(),
        selectedRatingOptions?.value,
        selectedPlanOptions?.value
      );
    }
  }, [selectedRatingOptions, selectedPlanOptions]);

  const ratingOptions = [
    { value: "", label: "All" },
    { value: "0", label: "0" },
    { value: "1-2", label: "1-2" },
    { value: "2-3", label: "2-3" },
    { value: "3-4", label: "3-4" },
    { value: "4-5", label: "4-5" },
  ];

  const insuranceOptions = [
    { value: "", label: "All" },
    ...(insurancePlanList?.map((data) => ({
      value: data.name,
      label: data.name,
    })) || []),
  ];

  const handleSearchChange = () => {
    getAllProviderList(
      1,
      searchValue.trim(),
      selectedRatingOptions?.value,
      selectedPlanOptions?.value
    );
    setCurrentPage(1);
  };

  const handlePageClick = (data: { selected: number }) => {
    if (!loading) {
      setCurrentPage(data.selected + 1);
    }
    getAllProviderList(
      data.selected + 1,
      searchValue,
      selectedRatingOptions?.value,
      selectedPlanOptions?.value
    );
  };

  const getAllInsuranceList = async () => {
    try {
      const response: AxiosResponse = await authService.insuranceList();
      setInsurancePlanList(response?.data?.result);
    } catch (error) {
      console.log("🚀 ~ getAllInsuranceList ~ error:", error);
    }
  };

  const getAllProviderList = async (
    currentPage?: string | number,
    searchValue?: string,
    rating?: string,
    insurancePlan?: string
  ) => {
    const tokenData: string | null = await localStorage.getItem(
      "directoryToken"
    );
    try {
      const response: AxiosResponse = await providerService.getAllProviderList(
        currentPage ?? "",
        usersPerPage ?? "",
        searchValue ?? "",
        rating ?? "",
        insurancePlan ?? "",
        tokenData ?? ""
      );
      setProviderData(response?.data?.result?.providersDetails);
      setTotal(response?.data?.result?.totalCount);
    } catch (error) {
      console.log("🚀 ~ getAllServiceList ~ error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isMobile) {
      fetchProviderData();
    }
  }, [currentPage, searchValue, selectedRatingOptions, selectedPlanOptions]);

  const fetchProviderData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const tokenData = localStorage.getItem("directoryToken");
    try {
      const response: AxiosResponse = await providerService.getAllProviderList(
        currentPage,
        usersPerPage,
        searchValue.trim(),
        selectedRatingOptions.value,
        selectedPlanOptions.value,
        tokenData || ""
      );

      const newProviders = response.data.result.providersDetails;
      setProviderData((prev) => [...prev, ...newProviders]);
      setTotal(response.data.result.totalCount);
      setHasMore(newProviders.length > 0);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastItemRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setHasMore(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    if (!observer.current) {
      observer.current = new IntersectionObserver(callback);
    }

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => {
      if (lastItemRef.current && observer.current) {
        observer.current.unobserve(lastItemRef.current);
      }
    };
  }, [loading, hasMore]);

  useEffect(() => {
    if (selectedRatingOptions || selectedPlanOptions) {
      getAllProviderList(
        currentPage,
        searchValue.trim(),
        selectedRatingOptions?.value,
        selectedPlanOptions?.value
      );
    }
  }, [selectedRatingOptions, selectedPlanOptions]);

  return (
    <>
      <header className="sticky top-0 z-999 shadow-2 p-5 gap-10 w-full bg-gray-3 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-center">
          <div className="relative">
            <div className="w-full bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125" />
            <h1 className="lg:text-2xl text-lg text-center font-bold">
              Directory of Providers
            </h1>
          </div>
        </div>
        <div className="md:flex justify-between items-center gap-10">
          <div className="relative flex justify-around items-center mt-5">
            <button className="absolute md:left-3 left-4 2xl:top-5.5 xl:top-5 top-5 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition">
              <IoSearchOutline />
            </button>
            <input
              type="text"
              placeholder="Type to search..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (e.target.value === "") {
                  setCurrentPage(1);
                  fetchProviderData();
                  setHasMore(true);
                  getAllProviderList(
                    currentPage,
                    e.target.value,
                    selectedRatingOptions?.value,
                    selectedPlanOptions?.value
                  );
                } else {
                  handleSearchChange();
                }
              }}
              className="md:max-w-80 max-w-70 w-full bg-white dark:bg-meta-4 border border-gray-300 rounded-lg shadow-sm pl-10 pr-4 p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-blue-300 xl:w-150 transition"
            />
            <button
              type="button"
              onClick={handleSearchChange}
              className="inline-flex items-center md:ml-5 ml-2 justify-center rounded-full bg-[#623de7] py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Search
            </button>
          </div>
          <div className="grid grid-cols-2 lg:gap-5 md:gap-8 gap-2">
            {/* Rating Filter */}
            <div className="xl:mt-0 mt-5">
              <div className="w-full sm:w-60 md:w-72 lg:w-80">
                <label className="mb-3 block lg:text-base text-sm font-medium text-black dark:text-white">
                  Rating
                </label>
                <Select
                  options={ratingOptions}
                  onChange={(selectedOptions) => {
                    if (selectedOptions?.value === "") {
                      setSelectedRatingOptions({ value: "", label: "All" });
                      setCurrentPage(1);
                      setHasMore(true);
                      scrollToTop();
                    }
                    if (selectedOptions) {
                      setSelectedRatingOptions(selectedOptions);
                      fetchProviderData();
                      setCurrentPage(1);
                      scrollToTop();
                    }
                  }}
                  className="basic-multi-select w-full"
                  classNamePrefix="select"
                  menuPortalTarget={document.body}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "#f0f3fb",
                      borderColor: state.isFocused ? "#623de7" : "#d1d5db",
                      color: "#000000",
                      "&:hover": {
                        borderColor: "#623de7",
                      },
                      width: "100%",
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "#000000",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "#6b7280",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor:
                        state.isFocused || state.isSelected
                          ? "#623de7"
                          : "#ffffff",
                      color:
                        state.isFocused || state.isSelected
                          ? "#ffffff"
                          : "#000000",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
            </div>
            {/* Insurance Plan Filter */}
            <div className="xl:mt-0 mt-5">
              <div className="w-full sm:w-60 md:w-72 lg:w-80">
                <label className="mb-3 block lg:text-base text-sm font-medium text-black dark:text-white">
                  Insurance Plan
                </label>
                <Select
                  options={insuranceOptions}
                  onChange={(selectedOptions) => {
                    if (selectedOptions?.value === "") {
                      setSelectedPlanOptions({ value: "", label: "All" });
                      setCurrentPage(1);
                      setHasMore(true);
                      scrollToTop();
                    }
                    if (selectedOptions) {
                      setSelectedPlanOptions(selectedOptions);
                      fetchProviderData();
                      setCurrentPage(1);
                      scrollToTop();
                    }
                  }}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  menuPortalTarget={document.body}
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      backgroundColor: "#f0f3fb",
                      borderColor: state.isFocused ? "#623de7" : "#d1d5db",
                      color: "#000000",
                      "&:hover": {
                        borderColor: "#623de7",
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: "#000000",
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: "#6b7280",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor:
                        state.isFocused || state.isSelected
                          ? "#623de7"
                          : "#ffffff",
                      color:
                        state.isFocused || state.isSelected
                          ? "#ffffff"
                          : "#000000",
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobile && (
        <div className="lg:p-10 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-5">
            {providerData.map((data, index) => (
              <DirectoryCard
                key={index}
                id={data._id}
                firstName={data.firstName}
                lastName={data.lastName}
                occupation={data.occupation}
                rating={data.averageRate}
                ratingsCount={data.ratingsCount}
                address={data.address}
                phoneNumber={data.phoneNumber}
                profilePhoto={IMAGE.dummyUser}
              />
            ))}
            {loading && <p>Loading...</p>}
            {providerData?.length === 0 && (
              <p className="flex justify-center items-center lg:text-2xl text-lg mt-5">
                No providers found.
              </p>
            )}
            <div ref={lastItemRef} />
          </div>
        </div>
      )}

      {!isMobile && (
        <>
          <div className="2xl:h-[590px] h-[700px] lg:p-10 p-4">
          {loading ? (
            <div>Loading...</div>
          ) : total === 0 ? (
            <div className="flex justify-center items-center lg:text-2xl text-lg mt-5">
              No Provider found!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4 2xl:gap-x-5">
              {providerData?.map((data: ProviderData, index: number) => (
                <DirectoryCard
                  key={index}
                  id={data?._id}
                  firstName={data?.firstName}
                  lastName={data?.lastName}
                  occupation={data?.occupation}
                  rating={data?.averageRate}
                  ratingsCount={data?.ratingsCount}
                  address={data?.address}
                  phoneNumber={data?.phoneNumber}
                  profilePhoto={IMAGE.dummyUser}
                />
              ))}
            </div>)}
          </div>
          <>
            {total > 0 && (
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
                  breakLinkClassName="inline-block w-10.5 h-10.5 px-2 py-1 border border-gray-300 rounded-md text-gray-700"
                  forcePage={currentPage - 1}
                />
              </div>
            )}
          </>
        </>
      )}
    </>
  );
};

export default Directory;
