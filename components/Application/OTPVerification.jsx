// "use client";

// import { zSchema } from "@/lib/zodSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import ButtonLoading from "./ButtonLoading";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../ui/form";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
// import { showToast } from "@/lib/showToast";
// import axios from "axios";
// import UpdatePassword from "./UpdatePassword";
// import { USER_DASHBOARD, WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
// import { useDispatch } from "react-redux";
// import { login } from "@/store/reducer/authReducer";
// import { useRouter } from "next/navigation";

// /**
//  * @param {string} email - User email
//  * @param {"login"|"reset"} type - Type of OTP verification
//  */
// const OTPVerification = ({ email, type = "reset" }) => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [isResendingOtp, setResendingOtp] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   const formSchema = zSchema.pick({
//     otp: true,
//     email: true,
//   });

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       otp: "",
//       email: email || "",
//     },
//   });

//   // ✅ Verify OTP
//   // youtube code
//   // const handleOtpVerification = async (value) => {
//   //   try {
//   //     setIsLoading(true);

//   //     const { data } = await axios.post("/api/auth/verify-otp", value);

//   //     if (!data.success) throw new Error(data.message);

//   //     // ✅ Store user data in localStorage
//   //     if (typeof window !== "undefined") {
//   //       localStorage.setItem("user", JSON.stringify(data.data));
//   //     }

//   //     showToast("success", data.message);

//   //     // 🔥 LOGIN FLOW → redirect to login page
//   //     if (type === "login") {
//   //       window.location.href = WEBSITE_LOGIN;
//   //       return; // return early to prevent showing UpdatePassword
//   //     }

//   //     // 🔥 RESET FLOW → show UpdatePassword component
//   //     if (type === "reset") {
//   //       setOtpVerified(true);
//   //     }
//   //   } catch (error) {
//   //     showToast("error", error.response?.data?.message || error.message);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handleOtpVerification = async (value) => {
//     try {
//       setIsLoading(true);

//       const { data } = await axios.post("/api/auth/verify-otp", value);

//       if (!data.success) throw new Error(data.message);

//       // ✅ Store user data in localStorage
//       if (typeof window !== "undefined") {
//         localStorage.setItem("user", JSON.stringify(data.data));
//       }

//       showToast("success", data.message);

//       // ✅ Update Redux state
//       dispatch(login(data.data));

//       // 🔥 LOGIN FLOW → redirect
//       if (type === "login") {
//         if (data.data?.role === "admin") {
//           router.push("/admin/media"); // ✅ ADMIN MEDIA
//         } else {
//           router.push(USER_DASHBOARD);  // ✅ USER DASHBOARD (Fixed from WEBSITE_LOGIN)
//         }
//         return;
//       }

//       // 🔥 RESET FLOW → show UpdatePassword component
//       if (type === "reset") {
//         setOtpVerified(true);
//       }
//     } catch (error) {
//       showToast("error", error.response?.data?.message || error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const resendOTP = async () => {
//     try {
//       setResendingOtp(true);

//       const { data } = await axios.post("/api/auth/resend-otp", { email });

//       if (!data.success) throw new Error(data.message);

//       showToast("success", data.message);
//     } catch (error) {
//       showToast("error", error.response?.data?.message || error.message);
//     } finally {
//       setResendingOtp(false);
//     }
//   };

//   // ✅ Conditional render for Reset Password
//   if (type === "reset" && otpVerified) {
//     return <UpdatePassword email={email} />;
//   }

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(handleOtpVerification)}>
//           <div className="text-center">
//             <h1 className="text-2xl font-bold mb-2">
//               Please Complete Verification
//             </h1>
//             <p className="text-md">
//               We have sent a One-Time Password (OTP) to your registered email.
//               The OTP is valid for 10 minutes only.
//             </p>
//           </div>

//           <div className="mb-3 mt-5 flex justify-center">
//             <FormField
//               control={form.control}
//               name="otp"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="flex justify-center font-semibold">
//                     One-Time Password (OTP)
//                   </FormLabel>
//                   <FormControl>
//                     <InputOTP
//                       maxLength={6}
//                       value={field.value}
//                       onChange={field.onChange}
//                     >
//                       <InputOTPGroup>
//                         {[...Array(6)].map((_, i) => (
//                           <InputOTPSlot
//                             key={i}
//                             index={i}
//                             className="text-xl w-12 h-12 text-center"
//                           />
//                         ))}
//                       </InputOTPGroup>
//                     </InputOTP>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="mb-3">
//             <ButtonLoading
//               loading={isLoading}
//               type="submit"
//               className="w-full cursor-pointer"
//               text="Verify"
//             />

//             <div className="text-center mt-5">
//               {!isResendingOtp ? (
//                 <button
//                   type="button"
//                   onClick={resendOTP}
//                   className="text-blue-500 cursor-pointer hover:underline"
//                 >
//                   Resend
//                 </button>
//               ) : (
//                 <span className="text-md">Resending....</span>
//               )}
//             </div>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default OTPVerification;


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
import UpdatePassword from "./UpdatePassword";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";

/**
 * @param {string} email
 * @param {"login"|"reset"} type
 * @param {function} onSuccess  // ✅ parent callback
 */
const OTPVerification = ({ email, type = "reset", onSuccess }) => {
  const dispatch = useDispatch();
  const [isResendingOtp, setResendingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email || "",
    },
  });

  // ✅ OTP VERIFY (NO REDIRECT HERE)
  const handleOtpVerification = async (value) => {
    try {
      setIsLoading(true);

      const { data } = await axios.post("/api/auth/verify-otp", value);

      if (!data.success) throw new Error(data.message);

      // Save user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      // Update Redux
      dispatch(login(data.data));

      showToast("success", data.message);

      // 🔥 LOGIN FLOW → notify parent
      if (type === "login" && onSuccess) {
        onSuccess(data.data); // ✅ parent will handle redirect
        return;
      }

      // 🔥 RESET FLOW
      if (type === "reset") {
        setOtpVerified(true);
      }

    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setResendingOtp(true);

      const { data } = await axios.post("/api/auth/resend-otp", { email });

      if (!data.success) throw new Error(data.message);

      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setResendingOtp(false);
    }
  };

  if (type === "reset" && otpVerified) {
    return <UpdatePassword email={email} />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)}>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Please Complete Verification
            </h1>
            <p className="text-md">
              We have sent a One-Time Password (OTP) to your registered email.
              The OTP is valid for 10 minutes only.
            </p>
          </div>

          <div className="mb-3 mt-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-center font-semibold">
                    One-Time Password (OTP)
                  </FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="text-xl w-12 h-12 text-center"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <ButtonLoading
            loading={isLoading}
            type="submit"
            className="w-full cursor-pointer"
            text="Verify"
          />

          <div className="text-center mt-5">
            {!isResendingOtp ? (
              <button
                type="button"
                onClick={resendOTP}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Resend
              </button>
            ) : (
              <span className="text-md">Resending....</span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OTPVerification;
