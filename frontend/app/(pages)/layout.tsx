"use client";

import Footer from "../../components/Footer";
import Header from "@/components/Header";
import React, { Suspense, useEffect } from "react";
import Loading from "./loading";
import { useAppDispatch } from "../../redux/hooks";
import { setAuthStatus, setUser } from "../../redux/slice/userSlice";
import { fetcher } from "@/utils/api"; // make sure utils/api.ts exists
import { User } from "@/types";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // user not logged in

    const fetchUser = async () => {
      try {
        const profile: User = await fetcher("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setAuthStatus(true));
        dispatch(
          setUser({
            _id: profile._id,
            name: profile.name,
            avatar: "", // backend does not return avatar, leave empty or add field if needed
            email: profile.email,
            role: profile.role,
          })
        );
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        localStorage.removeItem("token"); // remove invalid token
        dispatch(setAuthStatus(false));
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Header />
        {children}
        <Footer />
      </Suspense>
    </>
  );
};

export default RootLayout;
