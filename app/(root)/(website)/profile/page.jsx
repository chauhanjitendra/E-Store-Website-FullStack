"use client";
import ButtonLoading from "@/components/Application/ButtonLoading";
import UserPanelLayout from "@/components/Application/website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Dropzone from "react-dropzone";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import userIcon from "@/public/assets/images/user.png";
import { FaCamera } from "react-icons/fa";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CameraModal from "@/components/Application/website/CameraModal";

const breadCrumbData = {
  title: "Profile",
  links: [{ label: "Profile" }],
};

const Profile = () => {
  const dispatch = useDispatch();
  const { data: user } = useFetch("/api/profile/get");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();
  const [openCamera, setOpenCamera] = useState(false);

  // ✅ schema
  const formSchema = zSchema.pick({
    name: true,
    phone: true,
    address: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user && user.success) {
      const userData = user.data;
      form.reset({
        name: userData?.name,
        phone: userData?.phone,
        address: userData?.address,
      });
      setPreview(userData?.avatar?.url);
    }
  }, [user]);

  const handleFileSelection = (files) => {
    const file = files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreview(preview);
      setFile(file);
    }
  };

  const handleCameraCapture = (capturedFile) => {
    setFile(capturedFile);
    setPreview(URL.createObjectURL(capturedFile));
  };

  const updateProfile = async (values) => {
    setLoading(true);
    try {
      let formData = new FormData();
      if (file) {
        formData.set("file", file);
      }
      formData.set("name", values.name);
      formData.set("phone", values.phone);
      formData.set("address", values.address);

      const { data: response } = await axios.put(
        "/api/profile/update",
        formData,
      );
      if (!response.success) {
        throw new Error(response.message);
      }
      showToast("success", response.message);
      dispatch(login(response.data));
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="shadow rounded bg-white overflow-hidden">
          <div className="p-5 text-xl font-semibold border-b">Profile</div>
          <div className="p-5">
            <Form {...form}>
              <form
                className="grid md:grid-cols-2 grid-cols-1 gap-5"
                onSubmit={form.handleSubmit(updateProfile)}
              >
                <div className="md:col-span-2 col-span-1 flex justify-center items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <Avatar className="w-28 h-28 border-2 border-primary/20 hover:border-primary transition-all duration-300">
                          <AvatarImage src={preview ? preview : userIcon.src} className="object-cover" />
                          <div className="absolute z-10 w-full h-full top-0 left-0 bg-black/40 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                            <FaCamera className="text-white text-2xl" />
                          </div>
                        </Avatar>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <Dropzone
                          onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                          multiple={false}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()} className="flex items-center w-full">
                              <input {...getInputProps()} />
                              <span>Upload Photo</span>
                            </div>
                          )}
                        </Dropzone>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setOpenCamera(true)}
                      >
                        Capture from Camera
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <CameraModal
                    open={openCamera}
                    onOpenChange={setOpenCamera}
                    onCapture={handleCameraCapture}
                  />
                </div>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your Name"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3 md:col-span-2 col-span-1">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your Address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-3 md:col-span-2 col-span-1">
                  <ButtonLoading
                    loading={loading}
                    type="submit"
                    className=" mt-4 "
                    text="Save Changes"
                  />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default Profile;
