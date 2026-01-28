'use client'

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CUSTOMERS_COLUMN } from "@/lib/columns";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import React, { useCallback, useMemo } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, Label: "Home" },
  { href: '', Label: "Customers" },
];
const ShowCustomers = () => { 

  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMERS_COLUMN)
  }, [])

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = []
    actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType} />)
    return actionMenu
  }, [])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded-sm shadow-sm gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">Customers</h4>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <DatatableWrapper
            //  queryKey={customers-data} 
            queryKey={['customers-data']}
            fetchUrl='/api/customers'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint='/api/customers/export'
            deleteEndpoint='/api/customers/delete'
            deleteType='SD'
            trashView={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCustomers;
