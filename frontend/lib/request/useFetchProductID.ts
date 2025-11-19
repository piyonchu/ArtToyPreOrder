import { useAppDispatch } from "@/redux/hooks";
import { setArtToy, setArtToyLoading } from "@/redux/slice/productSlice";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect } from "react";

const useFetchProductID = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useQuery(["product", id], {
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/${id}`);
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
