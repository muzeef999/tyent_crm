import React, { useEffect } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { motion } from "framer-motion";
import CustomDropdown from "./CustomDropdown";

type PaginationProps = {
  totalCustomers: number;
  page: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  setLimit: (limit: number) => void;
};

const generatePageLimits = (totalCustomers: number, step: number = 10) => {
  const limits = [];
  for (let i = 10; i <= totalCustomers; i += step) {
    limits.push({
      label: `${i} / page`,
      value: i,
    });
  }

  // make sure last option is exactly totalCustomers (show all customers in one page if needed)
  if (limits[limits.length - 1]?.value !== totalCustomers) {
    limits.push({
      label: `${totalCustomers} / page`,
      value: totalCustomers,
    });
  }

  return limits;
};


const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalCustomers,
  limit,
  onPageChange,
  setLimit,
}) => {


const pagesLimit = generatePageLimits(totalCustomers);

  useEffect(() => {
    if (!limit) {
      setLimit(10);
    }
  }, [limit, setLimit]);



  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="w-full flex justify-end py-2 bg-linear-to-r from-transparent via-[yourColor10%] to-background"
    >
      <div className="flex items-center gap-2 px-6  ">
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 flex items-center gap-1 rounded  hover:bg-gray-100 disabled:opacity-50"
        >
          <IoIosArrowRoundBack size={20} />
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`px-2  rounded-full ${
                  page === pageNumber
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 flex items-center gap-1 rounded  hover:bg-gray-100 disabled:opacity-50"
        >
          Next
          <IoIosArrowRoundForward size={20} />
        </button>

        <CustomDropdown
          id="pages"
          options={pagesLimit}
          selectedValue={limit ?? 10}
          onSelect={(newLimit) => {
            setLimit(newLimit as number);
            onPageChange(1); // ✅ reset to first page when limit changes
          }}
        />
      </div>
    </motion.div>
  );
};

export default Pagination;
