import { CustomButton } from '../../../components';
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { 
  getOrderPending,
  getOrderFulfilled,
  getOrderFailed
 } from '../../../Redux/OrderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import DataTable from '../../../components/Table/table';
import { fetchData } from '../../../hooks/useFetchData';
import { OrderInfo } from '../../../types/global';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function Reports() {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      dispatch(getOrderPending());
      const data = (await fetchData('orderTable')) as OrderInfo[];
      data?.shift()
      dispatch(
        getOrderFulfilled(
          data,
        ),
      );
    } catch (error) {
      dispatch(getOrderFailed(error));
    }
  }
  const headerTable: string[] = [
    "Order_Id",
    "Order_Type",
    "Order_Date",
    "Status",
    "Completed_On",
    "Has_Checklist",
    "Checklist_Id",
    "Client_Id",
    "Client_Name",
    "Address",
    "Phone_Number",
    "SMS_Request_Count",
    "Total_Weight",
    "Load_Count",
    "Total_Price",
    "Payment_Method",
    "Wash_Cycle_Id",
    "Wash_Cycle",
    "Wash_Cost",
    "Dry_Cycle_Id",
    "Dry_Cycle",
    "Dry_Cost",
    "Detergent_Id",
    "Detergent",
    "Detergent_Cost",
    "Fabric_Conditioner_Id",
    "Fabric_Conditioner",
    "FabCon_Cost",
    "Services_Id",
    "Services",
    "Service_Cost",
  ]
  const dataTable: OrderInfo[] = order?.data || [];
  console.log(dataTable)
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dataTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, 'exportedData.xlsx');
  };
  return (
    <>
   
  <div className="text-black overflow-auto">
    <div className='flex'>
    <Typography variant="h4" className="font-semibold">
        Reports
      </Typography>
    <CustomButton 
    addedClass='ml-10'
    onClick={exportToExcel}
    >
      Export to Excel
    </CustomButton>
    </div>

        <DataTable
        loading={order.loading}
        headers={headerTable}
        data={dataTable}
      />
  </div>
  </>);
}
