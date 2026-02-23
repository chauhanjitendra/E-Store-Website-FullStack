"use client";
import UserPanelLayout from "@/components/Application/website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import { HiShoppingBag } from "react-icons/hi2";
import { FaCartArrowDown } from "react-icons/fa";
import useFetch from "@/hooks/useFetch";
import { useSelector } from "react-redux";
import Link from "next/link";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";

const MyAccount = () => {
  const breadCrumbData = {
    title: "Dashboard",
    links: [{ label: "Dashboard" }],
  };

  const { data: dashboardData } = useFetch("/api/dashboard/user");
  const cartStore = useSelector((store) => store.cartStore);

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="shadow rounded bg-white overflow-hidden">
          <div className="p-5 text-xl font-semibold border-b">Dashboard</div>
          <div className="p-5">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
              <div className="flex items-center justify-between gap-5 border rounded p-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Total Order</h4>
                  <span className="font-semibold text-gray-500">
                    {dashboardData?.data?.totalOrder || 0}
                  </span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <HiShoppingBag className="text-white" size={25} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-5 border rounded p-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Items In Cart</h4>
                  <span className="font-semibold text-gray-500">
                    {cartStore?.count}
                  </span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <FaCartArrowDown className="text-white" size={25} />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-lg font-semibold mb-3">Recent Orders</h4>
              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Sr.No.
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Order id
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Total Items
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData &&
                      dashboardData?.data?.recentOrders?.map((order, index) => (
                        <tr key={order._id}>
                          <td className="text-start text-sm text-gray-500 p-2 font-bold">
                            {index + 1}
                          </td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            <Link
                              href={WEBSITE_ORDER_DETAILS(order.order_id)}
                              className="underline hover:text-blue-500 underline-offset-2"
                            >
                              {order.order_id}
                            </Link>
                          </td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            {order.products.length}
                          </td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            {order.totalAmount.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                            })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default MyAccount;
