"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { use, useState } from "react";
import logo from "@/public/assets/images/logo-black.png";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoute";
import axios from "axios";

const Loginpage = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setTypePassword] = useState(true);
  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min("6", "password fild is required."),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (value) => {
    try {
        setLoading(true)
        const { confirmPassword, ...payload } = value;
        const {data:RegisterResponse} = await axios.post('/api/auth/login',value)
        if (!RegisterResponse.success) {
            throw new Error(RegisterResponse.message)
        }
        form.reset()
        alert(RegisterResponse.message)
    } catch (error) {
        alert(error.message)
    }
    finally{
        setLoading(false)
    }
  };

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={logo.src}
            width={logo.width}
            height={logo.height}
            alt="logo"
            className="max-w-[150px]"
          ></Image>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Login Into Account</h1>
          <p>Login into your account by filling out the from below.</p>
        </div>
        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="shadcn@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={isTypePassword ? "password" : "text"}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <button
                        className="absolute top-8 right-5  cursor-pointer"
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
                  text="login"
                />
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-2">
                  <p>Don't Have Account ?</p>
                  <Link href={WEBSITE_REGISTER} className="text-primary underline">
                    Create Account !
                  </Link>
                </div>
                <div className="mt-3">
                  <Link href="" className="text-primary underline">
                    Forgot Password ?
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Loginpage;
