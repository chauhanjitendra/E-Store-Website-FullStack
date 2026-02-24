'use client';
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/useFetch";
import Image from "next/image";
import notFound from '@/public/assets/images/not-found.png'
import { statusBadge } from "@/lib/helperFunction";

const LatestOrder = () => {
  const [latestOrders, setLatestOrders] = useState([]);

  const { data, loading } = useFetch("/api/dashboard/admin/latest-order")

  useEffect(() => {
    if (data && data.success) {
      setLatestOrders(data.data)
    }
  }, [data])

  if (loading) return <div className="w-full h-full flex justify-center items-center">
    Loading...
  </div>

  if (!latestOrders || latestOrders.length === 0) return <div className="h-full w-full flex justify-center items-center">
    <Image src={notFound.src} width={notFound.width} height={notFound.height} alt="not found" className="w-20" />
  </div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Id</TableHead>
          <TableHead>Payment Id</TableHead>
          <TableHead>Total Item</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>

        {latestOrders?.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order.order_id}</TableCell>
            <TableCell>{order.payment_id}</TableCell>
            <TableCell>{order.products.length}</TableCell>
            <TableCell>{statusBadge(order.status)}</TableCell>
            <TableCell>{order.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestOrder;
