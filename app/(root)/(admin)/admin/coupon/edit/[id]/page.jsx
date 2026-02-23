"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, Label: "Home" },
  { href: ADMIN_COUPON_SHOW, Label: "Coupons" },
  { href: "", Label: "Edit Coupons" },
];

const EditCoupon = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const { data: getCouponData } = useFetch(`/api/coupon/get/${id}`)
  const [editorKey, setEditorKey] = useState(0);



  const formSchema = zSchema.pick({
    _id: true,
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      code: "",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: 0,
    },
  });

  useEffect(() => {
    if (getCouponData && getCouponData.success) {
      const coupon = getCouponData.data
      form.reset({
        _id: coupon._id,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        minShoppingAmount: coupon.minShoppingAmount,
        validity: dayjs(coupon.validity).format('YYYY-MM-DD'),
      })
    }
  }, [getCouponData])

  const onSubmit = async (values) => {
    setLoading(true);
    try {

      const { data: response } = await axios.put(
        "/api/coupon/update",
        values,
      );
      if (!response.success) {
        throw new Error(response.message);
      }

      // form.reset();
      setEditorKey((prev) => prev + 1); // 🔥 description clear
      // setSelectedMedia([]);
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded-sm shadow-sm">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <h4 className="font-semibold text-xl">Edit Coupon</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Code <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="alt"
                            placeholder="Enter Code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Discount Percentages{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Discount Percentages"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Min Shopping Amount{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Min Shopping Amount"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Validity{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="Date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mb-5 mt-5">
                <ButtonLoading
                  loading={loading}
                  type="submit"
                  text="Save Changes"
                  className="cursor-pointer"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoupon;
