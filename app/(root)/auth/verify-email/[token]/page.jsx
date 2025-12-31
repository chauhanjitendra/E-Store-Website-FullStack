'use client'
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { use, useEffect, useState } from "react";
import  VerifiedImg  from "@/public/assets/images/verified.gif";
import  VerificationFailedImg  from "@/public/assets/images/verification-failed.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";

const EmailVerification = ({ params }) => {
  
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(false)
  useEffect(() => {
    const verify = async () => {
      const { data: VerificationResponse } = await axios.post(
        "/api/auth/verify-email",
        { token }
      );
      if (VerificationResponse.success) {
        setIsVerified(true)
      }
    };
    verify()
  }, [token]);

  return (
    <Card className='w-[400px]'>
      <CardContent className='rounded-5xl bg-amber-800'>
        {
          isVerified ? 
            <div>
              <div className="flex justify-center items-center ">
                <Image src={VerifiedImg.src} height={VerifiedImg.height} width={VerifiedImg.width} className="h-[100px] w-auto" alt="sucees"></Image>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold my-5 text-green-500">Email Verification Success!</h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Countinue Shopping</Link>
                </Button>
              </div>
            </div>
            :
            <div>
              <div className="flex justify-center items-center">
                <Image src={VerificationFailedImg.src} height={VerificationFailedImg.width} width={VerificationFailedImg.width} className="h-[100px] w-auto" alt="failed"></Image>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold my-5 text-red-500">Email Verification Failed!</h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Countinue Shopping</Link>
                </Button>
              </div>
            </div>
        }
      </CardContent>
    </Card>
  )
};

export default EmailVerification;
