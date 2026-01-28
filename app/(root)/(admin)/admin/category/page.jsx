'use client'

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN } from "@/lib/columns";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import { FilePlus } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, Label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, Label: "Category" },
];
const ShowCategory = () => {

  const columns = useMemo(()=>{
    return columnConfig(DT_CATEGORY_COLUMN)
  },[])

  const action = useCallback((row,deleteType,handleDelete)=>{
    let actionMenu = []
    actionMenu.push(<EditAction key="edit" href={ADMIN_CATEGORY_EDIT(row.original._id)}/>)
    actionMenu.push(<DeleteAction key="delete" handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
    return actionMenu
  },[])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded-sm shadow-sm gap-0">
        <CardHeader className="pt-2 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">Show Category</h4>
            <Button>
              <FilePlus />
              <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <DatatableWrapper
             queryKey={['category-data']} 
             fetchUrl='/api/category'
             initialPageSize={10}
             columnsConfig={columns}
             exportEndpoint='/api/category/export' 
             deleteEndpoint='/api/category/delete'
             deleteType='SD'
             trashView={`${ADMIN_TRASH}? trashof=category`}
             createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCategory;
