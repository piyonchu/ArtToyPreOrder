"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setOpenFilter } from "@/redux/slice/filterSlice";
import { Filter } from "lucide-react";
import Spinner from "../Spinner";
import ArtToyCard from "../Card";

const ArtToyList = () => {
  const dispatch = useAppDispatch();
  const { allArtToys, allArtToyLoading } = useAppSelector(
    (state) => state.product // Redux slice renamed for art toys
  );

  if (allArtToyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="md:p-4 p-2">
      {allArtToys && (
        <button
          onClick={() => dispatch(setOpenFilter(true))}
          className="md:hidden pt-2 pb-4 flex gap-1 items-center"
        >
          Sort & Filter <Filter strokeWidth={1.25} size={20} />
        </button>
      )}
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 sm:gap-4 gap-2">
        {allArtToys.products.length > 0 ? (
          allArtToys.products.map((toy) => (
            <ArtToyCard toy={toy} key={toy._id} />
          ))
        ) : (
          <div>Sorry! There is no art toy related to your query.</div>
        )}
      </div>
    </div>
  );
};

export default ArtToyList;
