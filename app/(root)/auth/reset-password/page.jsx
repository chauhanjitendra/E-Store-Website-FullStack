"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import logo from "@/public/assets/images/logo-black.png";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";

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
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import UpdatePassword from "@/components/Application/UpdatePassword";

const ResetPassword = () => {
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [OTPVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState(null);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // ✅ schema
  const formSchema = zSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // ✅ SEND OTP
  const handleEmailVerification = async (value) => {
    try {
      setEmailVerificationLoading(true);

      const { data } = await axios.post(
        "/api/auth/reset-password/send-otp",
        value
      );

      if (!data.success) throw new Error(data.message);

      setOtpEmail(value.email);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleOtpVerification = async (value) => {
    try {
      setOtpVerificationLoading(true);

      // Always send email along with OTP
      const { data } = await axios.post("/api/auth/verify-otp", {
        ...value,
        email: otpEmail,
      });

      if (!data.success) throw new Error(data.message);

      showToast("success", data.message);
      setIsOtpVerified(true); // ✅ triggers UpdatePassword
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
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
          />
        </div>

        {!otpEmail ? (
          <>
            <div className="text-center">
              <h1 className="text-4xl font-bold">Reset Password</h1>
              <p>Enter your email to reset password.</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEmailVerification)}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ButtonLoading
                    loading={emailVerificationLoading}
                    type="submit"
                    className="w-full mt-4"
                    text="Send OTP"
                  />

                  <div className="text-center mt-4">
                    <Link
                      href={WEBSITE_LOGIN}
                      className="text-primary underline"
                    >
                      Back to Login
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : !isOtpVerified ? (
          <OTPVerification
            email={otpEmail}
            onSubmit={handleOtpVerification}
            loading={OTPVerificationLoading}
            type= 'reset'
          />
        ) : (
          <UpdatePassword email={otpEmail} />
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
