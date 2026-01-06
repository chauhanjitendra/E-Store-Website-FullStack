"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
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
import { email, z } from "zod";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

const Loginpage = () => {
  const searchParams =useSearchParams()
  const router = useRouter()
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [OTPVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [isTypePassword, setTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState();

  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min(6, "password fild is required."),
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
      setLoading(true);
      // const { confirmPassword, ...payload } = value;
      const { data: loginResponse } = await axios.post(
        "/api/auth/login",
        value
      );
      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }
      // Save OTP email to show OTP verification form
      setOtpEmail(value.email);
      // Reset form
      form.reset();
      showToast("success", loginResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // otp verification

  const handleOtpVerification = async (value) => {
    try {
      setOtpVerificationLoading(true);
      // const { confirmPassword, ...payload } = value;
      const { data: otpResponse } = await axios.post("/api/auth/verify-otp", value);

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }
      setOtpEmail("");

      form.reset();

      showToast("success", otpResponse.message);

      dispatch(login(otpResponse.data));

      if (searchParams.has('callback')){
        router.push(searchParams.get('callback'))
      }else{
        otpResponse.data.role === 'admin' ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD)
      }

    } catch (error) {
      showToast("error", error.message);
    } finally {
      setOtpVerificationLoading(false);
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

        {!otpEmail ? (
          <>
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
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-primary underline"
                      >
                        Create Account !
                      </Link>
                    </div>
                    <div className="mt-3">
                      <Link href={WEBSITE_RESETPASSWORD} className="text-primary underline">
                        Forgot Password ?
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <OTPVerification
            email={otpEmail}
            onSubmit={handleOtpVerification}
            loading={OTPVerificationLoading}
            type='login'
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Loginpage;
