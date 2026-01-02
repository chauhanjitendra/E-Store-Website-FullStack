"use client";

import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ButtonLoading from "./ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const OTPVerification = ({ email, onSubmit, loading }) => {
    const [isResendingOtp, setResendingOtp] = useState(false)
    
  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

   // ✅ VERIFY OTP
  const handleOtpVerification = async (value) => {
    try {
      const { data } = await axios.post(
        "/api/auth/verify-otp",
        value // { email, otp }
      );

      // form.reset();
      if (!data.success) {
        throw new Error(data.message);
      }

      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };


const resendOTP = async () => {
  try {
    setResendingOtp(true);

    const { data: resendOtpResponse } = await axios.post(
      "/api/auth/resend-otp",
      { email }
    );

    if (!resendOtpResponse.success) {
      throw new Error(resendOtpResponse.message);
    }

    showToast("success", resendOtpResponse.message);
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setResendingOtp(false);
  }
};


  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Please Complete Verification
            </h1>
            <p className="text-md">
              We Have Sent One-Time Password(OTP) To Your Registered Email
              Address. The OTP Is Valid For 10 Minutes Only.{" "}
            </p>
          </div>
          <div className="mb-3 mt-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-center font-semibold">
                    One Time Password(OTP)
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup className="">
                        <InputOTPSlot className="text-xl size-12" index={0} />
                        <InputOTPSlot className="text-xl size-12" index={1} />
                        <InputOTPSlot className="text-xl size-12" index={2} />
                        <InputOTPSlot className="text-xl size-12" index={3} />
                        <InputOTPSlot className="text-xl size-12" index={4} />
                        <InputOTPSlot className="text-xl size-12" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
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
              text="Verify"
            />
            <div className="text-center mt-5">
             {!isResendingOtp ? 
                   <button
                    type="button"
                    onClick={resendOTP}
                    className="text-blue-500 cursor-pointer hover:underline">Resend</button>
                :   
                <span className="text-md">Resending....</span>
            }
              
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
