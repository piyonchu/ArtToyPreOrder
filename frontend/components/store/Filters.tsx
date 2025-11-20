import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setTags,
  setOffer,
  setOpenFilter,
  setRating,
  setSort,
  setSearchQuery, // Import the new action
} from "@/redux/slice/filterSlice";
import clsx from "clsx";
import useDeviceSize from "@/lib/useDeviceSize";
import { Star, X, Search } from "lucide-react";

const Filters = () => {
  const dispatch = useAppDispatch();
  const { width } = useDeviceSize();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    openFilter,
    sort,
    rating,
    offer,
    tags: tagsState,
    searchQuery, // Get search state
  } = useAppSelector((state) => state.filter);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  // Handle tag selection
  const handleTags = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      dispatch(setTags([...tagsState, value]));
    } else {
      dispatch(setTags(tagsState.filter((tag) => tag !== value)));
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    dispatch(setSearchQuery(searchQuery)); // Dispatch the search query when search icon is clicked
  };

  return (
  <>
    <aside
      className={clsx(
        openFilter ? "max-md:translate-y-0" : "max-md:translate-y-[100%]",
        "shadow-2xl shadow-gray-900 py-2 px-6 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:h-[80%] max-md:overflow-y-scroll max-md:z-30 bg-sky-50 pink:bg-pink-50 green:bg-green-50 purple:bg-purple-50 transition-all duration-300"
      )}
    >
      {/* Mobile Header */}
      {width < 768 && (
        <div className="flex items-center pb-4 pt-2">
          <h2 className="flex-1 font-medium text-2xl text-sky-800 pink:text-pink-800 green:text-green-800 purple:text-purple-800 transition-colors duration-300">
            Sort and filter
          </h2>
          <button onClick={() => dispatch(setOpenFilter(false))}>
            <X strokeWidth={1.25} />
          </button>
        </div>
      )}

      {/* ------ SEARCH BAR ------ */}
      <div className="mb-8 mt-2">
        <h3 className="font-medium mb-2 text-sky-800 pink:text-pink-800 green:text-green-800 purple:text-purple-800 transition-colors duration-300">Search</h3>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-800/50 pink:text-pink-800/50 green:text-green-800/50 purple:text-purple-800/50 cursor-pointer transition-colors duration-300"
            size={18}
            onClick={handleSearchClick} // Trigger search on click of the Search icon
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-10 pr-4 py-2 bg-white border border-sky-200 pink:border-pink-200 green:border-green-200 purple:border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-800/20 pink:focus:ring-pink-800/20 green:focus:ring-green-800/20 purple:focus:ring-purple-800/20 focus:border-sky-800 pink:focus:border-pink-800 green:focus:border-green-800 purple:focus:border-purple-800 transition-all text-sm"
          />
        </div>
      </div>

      {/* ------ SORT FILTER ------ */}
      <div className="mb-8">
        <h3 className="font-medium mb-4 text-sky-800 pink:text-pink-800 green:text-green-800 purple:text-purple-800 transition-colors duration-300">Sort</h3>
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

      {/* ------ TYPE FILTER (TAGS) ------ */}
      <div>
        <h3 className="font-medium mb-4 text-sky-800 pink:text-pink-800 green:text-green-800 purple:text-purple-800 transition-colors duration-300">Tags</h3>
        <div>
          {tags.map((tag) => (
            <div key={tag.value} className="flex items-center gap-4">
              <input
                type="checkbox"
                id={tag.value}
                value={tag.value}
                onChange={handleTags}
                checked={tagsState.includes(tag.value)}
              />
              <label htmlFor={tag.value}>{tag.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* ------ RATING FILTER ------ */}
      <div className="mt-8">
        <h3 className="font-medium mb-4 text-sky-800 pink:text-pink-800 green:text-green-800 purple:text-purple-800 transition-colors duration-300">Rating</h3>
        <div className="grid grid-cols-5 justify-items-center">
          {[1, 2, 3, 4, 5].map((btn) => (
            <button
              key={btn}
              value={btn}
              onClick={(e) => dispatch(setRating(e.currentTarget.value))}
              className={clsx(
                rating === btn.toString() ? "bg-black text-white" : "",
                "border-2 hover:bg-sky-800 pink:hover:bg-pink-800 green:hover:bg-green-800 purple:hover:bg-purple-800 border-sky-800 pink:border-pink-800 green:border-green-800 purple:border-purple-800 hover:text-white rounded-md w-10 h-10 flex items-center justify-center transition-colors duration-300"
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

      {/* ------ OFFER FILTER ------ */}
      <div className="mt-8">
        <h3 className="font-medium mb-4 text-sky-800 pink:text-pink-800 green:text-green-800 purple:text-purple-800 transition-colors duration-300">Offer</h3>
        <div className="grid grid-cols-5 justify-items-center">
          {[10, 20, 30, 40, 50].map((offerBtn) => (
            <button
              key={offerBtn}
              value={offerBtn}
              onClick={(e) => dispatch(setOffer(e.currentTarget.value))}
              className={clsx(
                offer === offerBtn.toString() ? "bg-black text-white" : "",
                "border-2 hover:bg-sky-800 pink:hover:bg-pink-800 green:hover:bg-green-800 purple:hover:bg-purple-800 border-sky-800 pink:border-pink-800 green:border-green-800 purple:border-purple-800 hover:text-white rounded-md w-10 h-10 flex items-center justify-center transition-colors duration-300"
              )}
            >
              {offerBtn}%
            </button>
          ))}
        </div>
      </div>
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
