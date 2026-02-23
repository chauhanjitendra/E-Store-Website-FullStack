'use client'

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";
import ViewAction from "@/components/Application/Admin/ViewAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_ORDER_COLUMN } from "@/lib/columns";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_ORDER_ADD,
  ADMIN_ORDER_EDIT,
  ADMIN_ORDER_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_ORDER_DETAILS,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import React, { useCallback, useMemo } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, Label: "Home" },
  { href: '', Label: "Order" },
];
const ShowOrder = () => {

  const columns = useMemo(() => {
    return columnConfig(DT_ORDER_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
    actionMenu.push(<ViewAction key="view" href={ADMIN_ORDER_DETAILS(row.original.order_id)} />)
    actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
    return actionMenu
  }, [])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded-sm shadow-sm gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">Orders</h4>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <DatatableWrapper
            //  queryKey={orders-data} 
            queryKey={['orders-data']}
            fetchUrl='/api/orders'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint='/api/orders/export'
            deleteEndpoint='/api/orders/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=orders`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowOrder;
