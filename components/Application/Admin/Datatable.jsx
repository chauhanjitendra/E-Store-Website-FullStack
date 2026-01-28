import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import Link from "next/link";
import React, { useState } from "react";
import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "../ButtonLoading";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";

const Datatable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}) => {
  //  filter, sorting and pagination states
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // row selection state
  const [rowSelection, setRowSelection] = useState({});

  // export loading state
  const [exportLoading, setExportLoading] = useState(false)

  // export menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // handle delete method
  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint)
  const handleDelete = (ids, deleteType) => {
    let c
    if (deleteType === "PD") {
      c = confirm("Are You Sure You Want To Delete The Data Permanently");
    } else {
      c = confirm("Are You Sure You Want To Move data into trash?");
    }
    if (c) {
      deleteMutation.mutate({ ids, deleteType });
      setRowSelection({})
    }
  };

  // export method
  const handleExport = async (selectedRow, type = 'csv') => {
    setExportLoading(true)
    handleClose()
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: `data-${new Date().toISOString()}.${type}`
      })

      let csv

      if (Object.keys(rowSelection).length > 0) {
        // export only selected rows
        const rowData = selectedRow.map((row) => row.original)
        csv = generateCsv(csvConfig)(rowData)
      } else {
        // export all data
        const { data: response } = await axios.get(exportEndpoint)
        if (!response.success) {
          throw new Error(response.message)
        }

        const rowData = response.data
        csv = generateCsv(csvConfig)(rowData)
      }

      download(csvConfig)(csv)
    } catch (error) {
      console.log(error);
      showToast('error', error.message)

    } finally {
      setExportLoading(false)
    }
  }

  // data fetching logics
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      url.searchParams.set("deleteType", deleteType);

      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  //   init table
  const table = useMaterialReactTable({
    columns: columnsConfig,
    data,
    enableRowSelection: true,
    paginationDisplayMode: "pages",
    columnFilterDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    muiToolbarAlertBannerProps: isError
      ? {
        color: "error",
        children: "Error loading data",
      }
      : undefined,

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: meta?.totalRowCount ?? 0,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      deleteEndpoint,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },

    getRowId: (originalRow) => originalRow._id,

    renderToolbarInternalActions: ({ table }) => (
      <>
        {/* built in button */}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {deleteType === "SD" && (
          <Tooltip title="Delete All">
            <IconButton
              disabled={
                !table.getIsSomePageRowsSelected() &&
                !table.getIsAllRowsSelected()
              }
              onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}

        {deleteType === "PD" && (
          <>
            <Tooltip title="Restore Data">
              <IconButton
                disabled={
                  !table.getIsSomePageRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')}
              >
                <RestoreFromTrashIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Permanently Delete Data">
              <IconButton
                disabled={
                  !table.getIsSomePageRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </>
    ),

    enableRowActions: true,
    positionActionsColumn: 'last',
    renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete),

    renderTopToolbarCustomActions: ({ table }) => (
      <React.Fragment>
        <Tooltip title="Export Options">
          <span>
            <ButtonLoading
              type="button"
              text={<><SaveAltIcon fontSize="10" /> Export</>}
              loading={exportLoading}
              onClick={handleClick}
              className='cursor-pointer'
            />
          </span>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleExport(table.getSelectedRowModel().rows, 'csv')}>Export as CSV</MenuItem>
          <MenuItem onClick={() => handleExport(table.getSelectedRowModel().rows, 'xls')}>Export as Excel</MenuItem>
        </Menu>
      </React.Fragment>
    )

  });

  return (
    <MaterialReactTable table={table} />
  )
};

export default Datatable;
