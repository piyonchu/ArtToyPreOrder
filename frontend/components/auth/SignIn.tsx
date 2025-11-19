"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInFormData, signInSchema } from "@/lib/validation/signIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthStatus, setUser } from "@/redux/slice/userSlice";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { fetcher } from "@/utils/api";
import { UserProfile } from "@/types";

const SignIn = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    try {
      // Call login endpoint
      const res = await fetcher<{
        success: boolean;
        _id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
        token: string;
      }>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.success) {
        throw new Error("Login failed");
      }

      // Update Redux state directly from response
      dispatch(setAuthStatus(true));
      dispatch(
        setUser({
          _id: res._id,
          name: res.name,
          email: res.email,
          role: res.role || "member",
          avatar: res.avatar || "",
        })
      );

      console.log("loggin res", res);

      // Save token for later requests
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

      reset();
      router.push("/"); // redirect to home
    } catch (err: any) {
      console.error(err);
      toast({
        title: err.message || "Login failed",
        variant: "destructive",
      });
    }
  };

  const isFormError = Object.entries(errors).length === 0;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="m@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2 mt-2">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="mt-4">
          <Button
            className="w-full"
            type="submit"
            disabled={!isFormError || isSubmitting || !isDirty}
          >
            {isSubmitting ? "Loading..." : "Sign in"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
