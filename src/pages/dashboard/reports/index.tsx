import { CustomButton } from '../../../components';
import React, { useEffect, useState } from 'react';
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
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formatCurrency } from '../../../config/pesoSign';
import DropdownSelect from '../../../components/Dropdown/dropdown';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function Reports() {
  const dispatch = useDispatch();
  const [value, setValue] = useState<Dayjs | null>(null);
  const order = useSelector((state: RootState) => state.orders);
  const dataTable: OrderInfo[] = order?.data || [];
  const [filteredData, setFilteredData] = useState<OrderInfo[]>(dataTable);
  const[sort,setSort] = useState({
    Order_Type: "",
    Payment_Method:"",
    Status:"",
    Order_Date: ""
  })

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() =>{
      filtered();
  },[sort,value,dataTable])

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
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const columnCount = Object.keys(filteredData[0] || {}).length; 
    const defaultWidth = 200;
    const columnWidths = Array(columnCount).fill({ wpx: defaultWidth });
    ws['!cols'] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are zero-based, so we add 1 to get the actual month
    const day = today.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, `Wash 107.5-${formattedDate}.xlsx`);
  };

  const typeOpt =[
    {value:"" ,label:"All"},
    {value:"REGULAR" ,label:"Regular"},
    {value:"ADVANCE" ,label:"Advance"},
  ]
  const methodOpt =[
    {value:"" ,label:"All"},
    {value:"COD" ,label:"COD"},
    {value:"Cash" ,label:"Cash"},
    {value:"GCash" ,label:"GCash"},
  ]
  const statusOpt =[
    {value:"" ,label:"All"},
    {value:"Pending" ,label:"Pending"},
    {value:"For Pickup & Processing" ,label:"For Pickup & Processing"},
    {value:"In Laundy Process" ,label:"In Laundy Process"},
    {value:"Servicing" ,label:"Servicing"},
    {value:"Packaging" ,label:"Packaging"},
    {value:"For Delivery" ,label:"For Delivery"},
    {value:"In Transit" ,label:"In Transit"},
    {value:"Cancelled" ,label:"Cancelled"},
    {value:"Completed" ,label:"Completed"},
  ]
  const filtered = () => {
    const filtered = dataTable.filter((item) => {
      const itemDate = dayjs(item.Order_Date);
      const ordermatch = sort.Order_Type === "" || item.Order_Type === sort.Order_Type;
      const methodmatch = sort.Payment_Method === "" || item.Payment_Method === sort.Payment_Method;
      const statusmatch = sort.Status === "" || item.Status === sort.Status;
      const dateMatch = value ? itemDate.isSame(value, 'day') : true;
      return ordermatch && methodmatch && statusmatch && dateMatch;
    });
    setFilteredData(filtered);

  };

  const handleOptionChange = (value: string, name: string) => {
    setSort((prevSort: any) => ({
      ...prevSort,
      [name]: value,
    }));
  };

  function calculateTotalPrice(orders: any[]) {
    let totalPrice = 0;
    orders.forEach(order => {
      if (order.Total_Price) {
        totalPrice += parseFloat(order.Total_Price);
      }
    });
  
    return totalPrice.toFixed(2);
  }
  const completed = dataTable?.filter(data => data.Status === 'Completed')
  const total = Number(calculateTotalPrice(completed));
  const formatTotal = formatCurrency(total)

  return (
    <>
  <div>
    <div className='flex w-3/4 justify-between'>
    <h1 className="text-4xl font-extrabold text-blue-700 tracking-wide">
        Reports
    </h1>
    <CustomButton 
    addedClass='ml-10'
    onClick={exportToExcel}
    >
      Export to Excel
    </CustomButton>
    </div>
    <div className='flex w-full flex-col mt-10'>
    <div className='w-4/5 h-22 flex justify-between'>
    <DropdownSelect
          value={sort.Order_Type}
          label="Filter by Order Type"
          options={typeOpt}
          name='Order_Type'
          onChange={handleOptionChange}
    />     
    <DropdownSelect
          value={sort.Payment_Method}
          label="Filter by Payment Method"
          options={methodOpt}
          name="Payment_Method"
          onChange={handleOptionChange}
    />     
    <DropdownSelect
          value={sort.Status}
          label="Filter by Status"
          options={statusOpt}
          name="Status"
          onChange={handleOptionChange}
    />  
    <div className='mt-1.5'>
      <label htmlFor="" className="block text-gray-700 text-sm font-bold rounded-t-md">
        Filter by Date
      </label>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          slotProps={{
                    textField: {
                    size: "small",
                    error: false,
                  },
              }}
          value={value}
          views={['year', 'month', 'day']}
          onChange={(newValue) => setValue(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider> 
    </div>
    
    </div>
    <div>
      <h1 className='mt-6'><strong>Total Income:</strong> {formatTotal}</h1>
    </div>
    <div className='w-5/6 h-full overflow-x-auto'>
    <DataTable
        loading={order.loading}
        headers={headerTable}
        data={filteredData}
      />
    </div>
    </div>
  </div>
  </>);
}
