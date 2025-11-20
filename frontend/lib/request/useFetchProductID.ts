import { useAppDispatch } from "@/redux/hooks";
import { setArtToy, setArtToyLoading } from "@/redux/slice/productSlice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";

const useFetchProductID = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery(["product", id], {
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/arttoys/${id}`);
      console.log("fetch id toy", data);
      return data;
    },
  });

  useEffect(() => {
    dispatch(setArtToyLoading(isLoading));
    dispatch(setArtToy(data));
  }, [data, dispatch, isLoading]);

  return data;
};

export default useFetchProductID;
