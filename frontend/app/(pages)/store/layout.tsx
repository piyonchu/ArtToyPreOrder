"use client";

import Categories from "@/components/store/Categories";
import Filters from "@/components/store/Filters";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { Suspense, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { setOpenFilter } from "@/redux/slice/filterSlice";
import Loading from "../loading";
import useFetchArtToys from "@/lib/request/useFetchProducts";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [queryParams, setQueryParams] = useState<string>("");

  const {  openFilter, sort, rating, offer, price, arrivalDate, availableQuota, tags } = useAppSelector(
    (state) => state.filter
  );

  const catFilter =
    params.filter === "all"
      ? ""
      : params.filter
      ? `&category=${params.filter}`
      : "";

  // Create query string based on state values
  useEffect(() => {
    let query = `${catFilter}`;

    if (rating) query += `&rating=${rating}`;
    if (offer) query += `&discountPercentage=${offer}`;
    if (price) query += `&price=${price}`;
    if (arrivalDate) query += `&arrivalDate=${arrivalDate}`;
    if (availableQuota) query += `&availableQuota=${availableQuota}`;
    if (tags && tags.length > 0) query += `&tags=${tags.join(",")}`;

    setQueryParams(query);
  }, [rating, offer, price, arrivalDate, availableQuota, tags, params.filter]);

  // Fetch products with the combined filters
  useFetchArtToys({ query: queryParams });

  return (
    <main className="overflow-hidden">
      <Suspense fallback={<Loading />}>
        {/* <Categories /> */}
        <section className="grid lg:grid-cols-[300px_1fr] md:grid-cols-[250px_1fr] relative border-t">
          {openFilter && (
            <div
              className="fixed inset-0 bg-black/60"
              onClick={() => dispatch(setOpenFilter(false))}
            ></div>
          )}
          <Filters />
          {children}
        </section>
      </Suspense>
      
    </main>
  );
};

export default StoreLayout;
