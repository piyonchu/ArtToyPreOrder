"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAllArtToys, setAllArtToyLoading } from "@/redux/slice/productSlice";
import { IAllArtToys, IArtToy } from "../interface";

interface UseFetchArtToysProps {
  query?: string;
  limit?: number;
}

const fetchArtToys = async (params: Record<string, any>, limit = 12): Promise<IArtToy[]> => {
  const qs = new URLSearchParams();

  qs.append("limit", limit.toString());

  // Add params to URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      qs.append(key, value);
    }
  });

  const url = `${process.env.NEXT_PUBLIC_API_URL}/arttoys?${qs.toString()}`;

  console.log("FETCH URL →", url);

  const { data } = await axios.get(url);

  return data.data;
};

const useFetchArtToys = ({ limit = 12 }: UseFetchArtToysProps) => {
  const dispatch = useAppDispatch();

  // Grab filters from Redux
  const { sort, rating, offer, tags, price, arrivalDate, availableQuota } =
    useAppSelector((state) => state.filter);

  // Build dynamic params
  const params = {
    sortField: sort.field,
    sortOrder: sort.order,
    rating,
    discountPercentage: offer,
    price,
    arrivalDate,
    availableQuota,
    tags: tags.length ? tags.join(",") : "",
  };

  const { data, isLoading } = useQuery(
    ["arttoys", params], // react-query refetches when filters change
    () => fetchArtToys(params, limit),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    dispatch(setAllArtToyLoading(isLoading));

    if (data) {
      const payload: IAllArtToys = {
        page: 1,
        totalPages: 1,
        totalProducts: data.length,
        products: data,
      };

      dispatch(setAllArtToys(payload));
    }
  }, [data, isLoading, dispatch]);

  return null;
};

export default useFetchArtToys;
