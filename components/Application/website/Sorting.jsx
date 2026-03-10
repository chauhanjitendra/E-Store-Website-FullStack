import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortings } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaFilter } from "react-icons/fa";


const Sorting = ({
  limit,
  setLimit,
  sorting,
  setSorting,
  mobileFiltterOpen,
  setMobileFilterOpen,
}) => {
  return (
    <div className="flex justify-between items-center flex flex-wrap gap-2 p-4 bg-gray-50">
      <Button type='button' className='lg:hidden' variant="outline" onClick={() => setMobileFilterOpen(!mobileFiltterOpen)}>
        <FaFilter />
        Filter
      </Button>

      <ul className="flex items-center gap-5">
        <li className="font-semibold">Show</li>
        {[9, 12, 18, 24].map((limitNumber) => (
          <li key={limitNumber}>
            <button
              type="button"
              onClick={() => setLimit(limitNumber)}
              className={`${limitNumber === limit ? "w-8 h-8 flex justify-center items-center rounded-full bg-primary text-white text-sm" : ""}`}
            >
              {limitNumber}
            </button>
          </li>
        ))}
      </ul>
      <Select value={sorting} onValueChange={(value) => setSorting(value)}>
        <SelectTrigger className='md:w-[180px] w-full bg-white'>
          <SelectValue placeholder="Default Sorting" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {sortings.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sorting;
