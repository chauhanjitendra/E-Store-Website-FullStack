'use client'
import Loading from "@/components/Application/Loading";
import UserPanelLayout from "@/components/Application/website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/Application/website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";
import Link from "next/link";
import React from "react";

const Orders = () => {
  const breadCrumbData = {
    title: "Orders",
    links: [{ label: "Orders" }],
  };
  const { data: ordersData, loading } = useFetch('/api/user-order')

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border-b">Orders</div>
          <div className="p-5">
            {loading ?
              <div className="text-center py-5">Loading...</div>
              :
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
                    {ordersData &&
                      ordersData?.data?.map((order, index) => (
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
            }
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default Orders;
