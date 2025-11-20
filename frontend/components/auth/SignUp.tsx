"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/lib/validation/signUp";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthStatus, setUser } from "@/redux/slice/userSlice";
import { fetcher } from "@/utils/api";
import { UserProfile } from "@/types";

const SignUp = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      const res = await fetcher<{
        success: boolean;
        _id: string;
        name: string;
        email: string;
        token: string;
      }>("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          tel: data.tel,
          password: data.password,
          role: "member",
        }),
      });

      // Update Redux directly from response
      dispatch(setAuthStatus(true));
      dispatch(
        setUser({
          _id: res._id,
          name: res.name,
          email: res.email,
          role: data.role || "user", // or your default
          avatar: "",
        })
      );

      // Save token in localStorage or cookies if needed
      localStorage.setItem("token", res.token);

      reset();
      router.push("/"); // redirect to home page
    } catch (err: any) {
      console.log(err);
      toast({
        title: err.message,
        variant: "destructive",
      });
    }
  };

  const isFormError = Object.entries(errors).length === 0;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

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

        <div className="grid gap-2">
          <Label htmlFor="tel">Telephone</Label>
          <Input
            {...register("tel")}
            id="tel"
            type="tel"
            placeholder="+1234567890"
          />
          {errors.tel && (
            <p className="text-sm text-red-500">{errors.tel.message}</p>
          )}
        </div>

        <div className="grid gap-2">
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

        {/* <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <select
            {...register("role")}
            id="role"
            className="border rounded p-2"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div> */}

        <div className="mt-4">
          <Button
            className="w-full bg-sky-500 hover:bg-sky-600 text-white"
            type="submit"
            disabled={!isFormError || isSubmitting || !isDirty}
          >
            {isSubmitting ? "Loading..." : "Create account"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
