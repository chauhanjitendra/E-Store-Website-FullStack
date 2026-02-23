"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
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
import slugify from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/Application/Select";
import Editor from "@/components/Application/Admin/Editor";
import MediaModel from "@/components/Application/Admin/MediaModal";
import Image from "next/image";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, Label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, Label: "Products" },
  { href: "", Label: "Edit Products" },
];

const EditProduct = ({ params }) => {

  const { id } = use(params);


  const [loading, setLoading] = useState(false);
  const [categoryOption, setCetegoryOption] = useState([]);
  const [editorKey, setEditorKey] = useState(0);
  const { data: getCategory } = useFetch(
    "/api/category?deleteType=SD&&size=10000",
  );
  const { data: getproduct, loading: getProductLoading } = useFetch(`/api/product/get/${id}`);

  // console.log(getproduct);

  //   media modal states
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data;
      const options = data.map((cat) => ({ label: cat.name, value: cat._id }));
      setCetegoryOption(options);
    }
  }, [getCategory]);

  const formSchema = zSchema.pick({
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
      description: "",
    },
  });

  useEffect(() => {
    if (getproduct && getproduct.success) {
      const productData = getproduct.data;
      form.reset({
        name: productData.name,
        slug: productData.slug,
        category: productData.category,
        mrp: productData.mrp,
        sellingPrice: productData.sellingPrice,
        discountPercentage: productData.discountPercentage,
        description: productData.description
      })

      if (productData) {
        const media = productData.media.map((media) => ({ _id: media._id, url: media.secure_url }))
        setSelectedMedia(media);
      }
    }
  }, [getproduct]);


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

  // discount Percentages calculation
  useEffect(() => {
    const mrp = Number(form.getValues("mrp"));
    const sellingPrice = Number(form.getValues("sellingPrice"));

    if (!mrp || mrp <= 0 || !sellingPrice) {
      form.setValue("discountPercentage", "");
      return;
    }

    const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
    form.setValue("discountPercentage", Math.round(discountPercentage));
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue("description", data);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please Select Media.");
      }

      const mediaIds = selectedMedia.map((media) => media._id);
      values.media = mediaIds;
      values._id = id;

      const { data: response } = await axios.post(
        "/api/product/update",
        values,
      );
      if (!response.success) {
        throw new Error(response.message);
      }

      // form.reset();
      setEditorKey((prev) => prev + 1); // 🔥 description clear
      setSelectedMedia([]);
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
          <h4 className="font-semibold text-xl">Edit Products</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className="text-red-500">*</span>
                        </FormLabel>
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
                <div className="">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Slug"
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
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
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MRP <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter MRP"
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
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Selling Price <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter selling Price"
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
                            readOnly
                            placeholder="Enter Discount Percentages"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5 md:col-span-2">
                  <FormLabel className="mb-3">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  {!getProductLoading &&
                    <Editor key={editorKey} onChange={editor} initialData={form.getValues('description')} />

                  }
                  <FormMessage></FormMessage>
                </div>
              </div>

              <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModel
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                    {selectedMedia.map((media) => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          src={media.url}
                          height={100}
                          width={100}
                          alt=""
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer"
                >
                  <span className="font-semibold">Selected Media</span>
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

export default EditProduct;
