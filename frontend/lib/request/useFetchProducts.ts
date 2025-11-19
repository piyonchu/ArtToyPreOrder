"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppDispatch } from "@/redux/hooks";
import { setAllArtToys, setAllArtToyLoading } from "@/redux/slice/productSlice";
import { IAllArtToys, IArtToy } from "../interface";

interface UseFetchArtToysProps {
  query?: string;
  limit?: number;
}

const fetchArtToys = async (query = "", limit = 12): Promise<IArtToy[]> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/arttoys?limit=${limit}${query}`
  );
  console.log("Fetched arttoys", data.data);
  return data.data;
};

const useFetchArtToys = ({ query = "", limit = 12 }: UseFetchArtToysProps) => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery(
    ["arttoys", query],
    () => fetchArtToys(query, limit),
    {
      refetchOnWindowFocus: false,
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
