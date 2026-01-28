"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
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
import slugify from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, Label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, Label: "Category" },
  { href: "", Label: "Edit Category" },
];

const EditCategory = ({ params }) => {
  const { id } = use(params);
  // const { id } = params; // Correct

  const { data: categoryData } = useFetch(`/api/category/get/${id}`);

  const [loading, setLoading] = useState(false);
  const formSchema = zSchema.pick({
    name: true,
    slug: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (categoryData && categoryData.success) {
      const data = categoryData.data;
      // console.log(data);
      form.reset({
        name: data?.name,
        slug: data?.slug,
      });
    }
  }, [categoryData]);

  useEffect(() => {
    const name = form.getValues("name");

    // ✅ Name empty → slug bhi empty
    if (!name || name.trim() === "") {
      form.setValue("slug", "");
      return;
    }

    // ✅ Name me input start → slug auto-generate
    form.setValue("slug", slugify(name).toLowerCase());
  }, [form.watch("name")]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/category/create",
        values
      );
      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset();
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
          <h4 className="font-semibold text-xl">Edit Category</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="alt"
                          placeholder="Enter Category Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Slug"
                          {...field}
                          value={field.value ?? ""}
                        />
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
                  className="cursor-pointer"
                  text="Update Category"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
