import React, { ChangeEvent } from "react";
import { Checkbox } from "../ui/checkbox";
import { ITag } from "@/lib/interface"; // Adjust import based on your interface for types
import { Slider } from "../ui/slider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  setTags, // Adjust the action to set type instead of brand
  setOffer,
  setOpenFilter,
  setRating,
  setSort,
} from "@/redux/slice/filterSlice";
import clsx from "clsx";
import useDeviceSize from "@/lib/useDeviceSize";
import { Star, X } from "lucide-react";
import { Toggle } from "../ui/toggle";
import { useEffect, useState } from "react";

const Filters = () => {
  const dispatch = useAppDispatch();
  const { width } = useDeviceSize();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    openFilter,
    sort,
    rating,
    offer,
    tags: tagsState, // Updated to reflect 'tags' instead of 'type'
  } = useAppSelector((state) => state.filter);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  // Updated handle function (to handle multiple tags selection)
  const handleTags = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    // Dispatch an action to update the tags list: either add or remove a tag
    if (isChecked) {
      dispatch(setTags([...tagsState, value])); // Add selected tag to the state
    } else {
      dispatch(setTags(tagsState.filter((tag) => tag !== value))); // Remove unselected tag
    }
  };

  return (
    <>
      <aside
        className={clsx(
          openFilter ? "max-md:translate-y-0" : "max-md:translate-y-[100%]",
          "shadow-2xl shadow-gray-900 py-2 px-6 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:h-[80%] max-md:overflow-y-scroll max-md:z-30 bg-sky-50  transition-transform"
        )}
      >
        {width < 768 && (
          <div className="flex items-center pb-4 pt-2">
            <h2 className="flex-1 font-medium text-2xl text-sky-800">Sort and filter</h2>
            <button onClick={() => dispatch(setOpenFilter(false))}>
              <X strokeWidth={1.25} />
            </button>
          </div>
        )}

        {/* ------SORT FILTER------ */}
        <div className="mb-8">
          <h3 className="font-medium mb-4 text-sky-800">Sort</h3>
          <div>
            {sortBy.map((sortItem) => (
              <div className="flex items-center gap-4" key={sortItem.id}>
                <input
                  type="radio"
                  id={sortItem.field + sortItem.order}
                  value={sortItem.order}
                  onChange={(e) =>
                    dispatch(
                      setSort({ field: sortItem.field, order: e.target.value })
                    )
                  }
                  checked={
                    sort.field === sortItem.field &&
                    sort.order === sortItem.order
                  }
                />
                <label htmlFor={sortItem.field + sortItem.order}>
                  {sortItem.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ------TYPE FILTER (TOYS, FIGURINES, ART) ------ */}
        <div>
          <h3 className="font-medium mb-4 text-sky-800">Tags</h3>
          <div>
            {tags.map((tag) => (
              <div key={tag.value} className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id={tag.value}
                  value={tag.value}
                  onChange={handleTags} // Call 'handleTags' for selection logic
                  checked={tagsState.includes(tag.value)} // Check if the tag is selected
                />
                <label htmlFor={tag.value}>{tag.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* ------RATING FILTER------ */}
        <div className="mt-8">
          <h3 className="font-medium mb-4 text-sky-800">Rating</h3>
          <div className="grid grid-cols-5 justify-items-center">
            {[1, 2, 3, 4, 5].map((btn) => (
              <button
                key={btn}
                value={btn}
                onClick={(e) => dispatch(setRating(e.currentTarget.value))}
                className={clsx(
                  rating === btn.toString() ? "bg-black text-white" : "",
                  "border-2 hover:bg-sky-800 border-sky-800 hover:text-white rounded-md  w-10 h-10 flex items-center justify-center"
                )}
              >
                {btn}
                <Star
                  className="fill-yellow-400"
                  size={16}
                  strokeWidth={1.25}
                  absoluteStrokeWidth
                />
              </button>
            ))}
          </div>
        </div>

        {/* ------OFFER FILTER------ */}
        <div className="mt-8">
          <h3 className="font-medium mb-4 text-sky-800">Offer</h3>
          <div className="grid grid-cols-5 justify-items-center">
            {[10, 20, 30, 40, 50].map((offerBtn) => (
              <button
                key={offerBtn}
                value={offerBtn}
                onClick={(e) => dispatch(setOffer(e.currentTarget.value))}
                className={clsx(
                  offer === offerBtn.toString() ? "bg-black text-white" : "",
                  "border-2 hover:bg-sky-800 border-sky-800 hover:text-white rounded-md  w-10 h-10 flex items-center justify-center"
                )}
              >
                {offerBtn}%
              </button>
            ))}
          </div>
        </div>

        {/* <div className="mt-8">
          <h3 className="font-medium mb-4">Price Range</h3>
          <div>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </div> */}
        
      </aside>
    </>
  );
};

export default Filters;

const sortBy = [
  {
    id: 1,
    field: "price",
    order: "asc",
    label: "Price(Low to High)",
  },
  {
    id: 2,
    field: "price",
    order: "desc",
    label: "Price(High to Low)",
  },
];

const tags = [
  {
    value: "figurine",
    label: "Figurines",
  },
  {
    value: "art",
    label: "Art",
  },
  {
    value: "plushies",
    label: "Plush Toys",
  },
];
