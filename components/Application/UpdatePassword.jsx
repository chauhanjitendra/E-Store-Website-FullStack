"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { z } from "zod";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

const UpdatePassword = ({ email }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setTypePassword] = useState(true);

  const formSchema = zSchema
    .pick({
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and confirm password must be the same",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordUpdate = async (value) => {
    try {
      setLoading(true);
      const { confirmPassword, ...payload } = value;

      const { data: passwordUpdate } = await axios.put(
        "/api/auth/reset-password/update-password",
        payload
      );

      if (!passwordUpdate.success) {
        throw new Error(passwordUpdate.message);
      }

      form.reset();
      router.push(WEBSITE_LOGIN);
      showToast("success", passwordUpdate.message);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Update Password!</h1>
          <p>Create new password by filling below form</p>
        </div>
        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordUpdate)}>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="relative mt-5">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type={isTypePassword ? "password" : "text"}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <button
                        className="absolute top-8 right-5 cursor-pointer"
                        type="button"
                        onClick={() => setTypePassword(!isTypePassword)}
                      >
                        {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  className="w-full cursor-pointer"
                  text="Update Password"
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
  );
};

export default UpdatePassword;
