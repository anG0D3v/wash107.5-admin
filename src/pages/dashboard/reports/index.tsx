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
import { 
  filterByToday,
  filterByThisMonth,
  filterByThisWeek,
  filterByThisYear } from '../../../config/annualRep';
import DropdownSelect from '../../../components/Dropdown/dropdown';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function Reports() {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.orders);
  const dataTable: OrderInfo[] = order?.data || [];
  const [filteredData, setFilteredData] = useState<OrderInfo[]>(dataTable);
  const[sort,setSort] = useState({
    Order_Type: '',
    Payment_Method:'',
    Status:'',
    Order_Date: ''
  })

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() =>{
      filtered()
  },[sort])

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
    "Client_Name",
    "Order_Date",
    "Order_Type",
    "Total_Price",
    "Payment_Method",
    "Status",
  ]

  const exportToExcel = () => {
    const columnsToExport = filteredData.map((item) => ({
      Order_Id: item.Order_Id,
      Client_Name: item.Client_Name,
      Order_Date: item.Order_Date,
      Order_Type: item.Order_Type,
      Total_Price: item.Total_Price,
      Payment_Method: item.Payment_Method,
      Status: item.Status,
    }));
    const ws = XLSX.utils.json_to_sheet(columnsToExport);
    ws['!cols'] = [
      { wpx: 200 }, 
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 150 },
      { wpx: 200 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, 'exportedData.xlsx');
  };

  const typeOpt =[
    {value:"" ,label:"All"},
    {value:"REGULAR" ,label:"Regular"},
    {value:"ADVANCE" ,label:"Advance"},
    {value:"APP" ,label:"App"},
  ]
  const methodOpt =[
    {value:"" ,label:"All"},
    {value:"COD" ,label:"COD"},
    {value:"Cash" ,label:"Cash"},
    {value:"GCash" ,label:"GCash"},
  ]
  const statusOpt =[
    {value:"" ,label:"All"},
    {value:"Cancelled" ,label:"Cancelled"},
    {value:"Completed" ,label:"Completed"},
    {value:"For Pickup & Processing" ,label:"For Pickup & Processing"},
  ]
  const dateOpt = [
    {value:"" ,label:"All"},
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'thisYear', label: 'This Year' },
  ]
  const filtered = () => {
    const filtered = dataTable.filter((item) => {
      return (
        (sort.Order_Type === '' || item.Order_Type === sort.Order_Type) &&
        (sort.Payment_Method === '' || item.Payment_Method === sort.Payment_Method) &&
        (sort.Status === '' || item.Status === sort.Status)
      );
    });
    switch (sort.Order_Date) {
      case 'today':
        setFilteredData(filterByToday(filtered));
        break;
      case 'thisWeek':
        setFilteredData(filterByThisWeek(filtered));
        break;
      case 'thisMonth':
        setFilteredData(filterByThisMonth(filtered));
        break;
      case 'thisYear':
        setFilteredData(filterByThisYear(filtered));
        break;
      default:
        setFilteredData(filtered);
    }
  };

  const handleOptionChange = ( value: string, name: string) => {

    setSort((prevSort) => ({
      ...prevSort,
      [name]: value,
    }));
  };
  return (
    <>
  <div>
    <div className='flex justify-between'>
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
    <div className='w-full h-22 flex justify-between'>
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
        <DropdownSelect
          value={sort.Order_Date}
          label="Sort by Date"
          name='Order_Date'
          options={dateOpt}
          onChange={handleOptionChange}
        />       
    </div>
    <div className='w-full'>
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
