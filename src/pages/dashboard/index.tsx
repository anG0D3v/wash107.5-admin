import React, { useEffect, useState } from 'react';
import { RootState } from '../../Redux/store';
import { OrderInfo, UserInfo,AnnouncementInfo, inventoryList } from '../../types/global';
import { 
  getOrderPending,
  getOrderFulfilled,
  getOrderFailed
 } from '../../Redux/OrderSlice';
import { 
  getUsersPending,
  getUsersFulfilled,
  getUsersFailed
} from '../../Redux/UserSlice';
import { 
  getInventoryPending,
  getInventoryFulfilled,
  getInventoryFailed
 } from '../../Redux/InventorySlice';
import { 
  getAnnouncementPending,
  getAnnouncementFulfilled,
  getAnnouncementFailed
 } from '../../Redux/announcementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../hooks/useFetchData';
import CompletedIcon from '../../assets/completed.png';
import NotVerifiedIcon from '../../assets/user-x-svgrepo-com.png';
import VerifiedIcon from '../../assets/user-check-svgrepo-com.png';
import CancelIcon from '../../assets/cancelled.png';
import CustomCard from '../../components/Card/card';
import Piecharts from '../../components/Charts/pie';
import Barcharts from '../../components/Charts/bar';
import DropdownSelect from '../../components/Dropdown/dropdown';

export function Dashboard() {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.orders);
  const user = useSelector((state: RootState) => state.users);
  const inventory = useSelector((state: RootState) => state.inventory);
  const [select,setSelected] = useState('Wash Cycle')
  const [pieStat, setPieStat] = useState<{
    Pending: number;
    For_Pickup_Processing: number;
    In_Laundry_Process: number;
    Servicing: number;
    Packaging: number;
    For_Delivery: number;
    In_Transit: number;
  }>({
    Pending: 0,
    For_Pickup_Processing: 0,
    In_Laundry_Process: 0,
    Servicing: 0,
    Packaging: 0,
    For_Delivery: 0,
    In_Transit: 0,
  });
  const announcement = useSelector((state: RootState) => state.announcement);
  const dataTable1: OrderInfo[] = order?.data || [];
  const dataTable2: inventoryList[] = inventory?.data || [];
  const dataTable3: UserInfo[] = user?.data || [];
  const dataTable4: AnnouncementInfo[] = announcement?.data || [];

  useEffect(() => {
    loadOrdered();
    loadUser();
    loadInventory();
    loadAnnouncement();
  }, []);

  useEffect(() =>{
    PieData(dataTable1)
  },[dataTable1])

    async function loadOrdered() {
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
    async function loadUser() {
    try {
      dispatch(getUsersPending());
      const data = (await fetchData('userTable')) as UserInfo[];
      data?.shift()
      dispatch(
        getUsersFulfilled(
          data,
        ),
      );
    } catch (error) {
      dispatch(getUsersFailed(error));
    }
  }
  async function loadInventory() {
    try {
      dispatch(getInventoryPending());
      const data = (await fetchData('inventoryTable')) as inventoryList[];
      data?.shift()
      dispatch(
        getInventoryFulfilled(
          data,
        ),
      );
    } catch (error) {
      dispatch(getInventoryFailed(error));
    }
  }
    async function loadAnnouncement() {
    try {
      dispatch(getAnnouncementPending());
      const data = (await fetchData('announcementTable')) as AnnouncementInfo[];
      data?.shift()
      dispatch(
        getAnnouncementFulfilled(
          data,
        ),
      );
    } catch (error) {
      dispatch(getAnnouncementFailed(error));
    }
  }
  const totalCompleted = dataTable1.filter(data => data.Status === 'Completed').length;
  const totalCancelled = dataTable1.filter(data => data.Status === 'Cancelled').length;
  const totalVerified = dataTable3.filter(data => data.Verified && data.Role === "USER").length;
  const totalNot = dataTable3.filter(data => !data.Verified && data.Role === "USER").length;
  const annVisible = dataTable4?.filter(data => data.Visibility)
  const filteredAnnouncements = annVisible
  .filter(announcement => announcement.Created_On) 
  .sort((a: { Created_On: string }, b: { Created_On: string }) => new Date(b.Created_On).getTime() - new Date(a.Created_On).getTime());

  const PieData = (data: OrderInfo[]) => {
    const d1 = data.filter((item) => item.Status === 'Pending').length;
    const d2 = data.filter((item) => item.Status === 'For Pickup & Processing').length;
    const d3 = data.filter((item) => item.Status === 'In Laundy Process').length;
    const d4 = data.filter((item) => item.Status === 'Servicing').length;
    const d5 = data.filter((item) => item.Status === 'Packaging').length;
    const d6 = data.filter((item) => item.Status === 'For Delivery').length;
    const d7 = data.filter((item) => item.Status === 'In Transit').length;
    const updatedPieStat = {
      ...pieStat,
      Pending: d1,
      For_Pickup_Processing: d2,
      In_Laundry_Process: d3,
      Servicing: d4,
      Packaging: d5,
      For_Delivery: d6,
      In_Transit: d7,
    };
    setPieStat(updatedPieStat);
  };
  const BarData = (data: inventoryList[],data1: OrderInfo[]) =>{
    const categories = ['Dry Cycle', 'Wash Cycle', 'Fabric Conditioner', 'Laundry Detergent', 'Service'];

    const d1 = data1?.filter((item) => item.Status === 'Completed');
  
    const resultArray: { Name: string; value: number; Category:string; }[] = [];
  
    categories.forEach((category) => {
      const categoryData = data?.filter((item) => item.Category === category);
      const countObj: { [key: string]: number } = {};
  
      for (let i = 0; i < categoryData.length; i++) {
        for (let j = 0; j < d1.length; j++) {
          if (categoryData[i].Name === d1[j].Dry_Cycle ||
              categoryData[i].Name === d1[j].Detergent ||
              categoryData[i].Name === d1[j].Fabric_Conditioner ||
              categoryData[i].Name === d1[j].Services ||
              categoryData[i].Name === d1[j].Wash_Cycle) {
            countObj[categoryData[i].Name] = (countObj[categoryData[i].Name] || 0) + 1;
          }
        }
      }
      resultArray.push(
        ...Object.keys(countObj).map((key) => ({
          Name: key,
          value: countObj[key],
          Category: category,
        }))
      );
    });
  
    return resultArray;
  }
  const convertPieStatToArray = (pieStat: { [x: string]: any; Pending?: number; For_Pickup_Processing?: number; In_Laundy_Process?: number; Servicing?: number; Packaging?: number; For_Delivery?: number; In_Transit?: number; }) => {
    const pieChartDataArray = Object.keys(pieStat).map((status) => ({
      name: status,
      value: pieStat[status],
    }));
    return pieChartDataArray;
  };
  const pieChartData = convertPieStatToArray(pieStat);

  const options = [
    { value: 'Wash Cycle', label: 'Wash Cycle'},
    { value: 'Dry Cycle', label: 'Dry Cycle'},
    { value: 'Laundry Detergent', label: 'Laundry Detergent'},
    { value: 'Fabric Conditioner', label: 'Fabric Conditioner'},
    { value: 'Service', label: 'Service'},
  ];
  const handleOptionChange = (value: string) => {
    setSelected(value);
  };
  const resultofFiltered = BarData(dataTable2, dataTable1);
  const resultBarData = resultofFiltered?.filter(data => data.Category === select) 

  return (
  <>
  <div>
  <h1 className="text-4xl font-extrabold text-gray-700 tracking-wide mb-4 ">Dashboard</h1>
    <div className="flex flex-col w-full h-max overflow-x-auto p-4 rounded-5 border-8 justify-center items-center">
      <div className='w-full'>
      <h1 className="text-2xl font-extrabold text-gray-700 tracking-wide mb-4">Visible Announcements</h1>
      </div>
         
          <div className='flex mx-12 overflow-x-auto h-max whitespace-nowrap justify-center items-center w-2/3 gap-4'>
          {filteredAnnouncements?.map((data,index) =>{
            if(!data){return null;}
              else{
                return (
              <div className='flex-none w-86 h-80 border p-2 box-border'
               key={index}>
                <img
                className='w-86 h-64 max-h-64 object-contain'
                 src={data.Image_Url}
                 alt="" />
                 <h1 className='ml-2'>{data.Announcement_Name}</h1>
              </div>)
          }
          })}
          </div>
    </div>
    <div className="flex flex-wrap">
    <CustomCard data={totalCompleted} iconSrc={CompletedIcon}>
        Completed Orders
    </CustomCard>
    <CustomCard data={totalCancelled} iconSrc={CancelIcon}>
        Cancelled Orders
    </CustomCard>
    <CustomCard data={totalVerified} iconSrc={VerifiedIcon}>
        Verified Users
    </CustomCard>
    <CustomCard data={totalNot} iconSrc={NotVerifiedIcon}>
        Not Verified Users
    </CustomCard>
    </div>
    <hr />
    <div className='flex justify-center items-center w-full'>
    <div  className="w-10/12 h-max p-5 m-5 relative flex flex-col justify-center items-center rounded-5 border-8">
        <h1 className="text-4xl font-extrabold text-gray-700 tracking-wide mb-4">Current Orders</h1>
        <Piecharts data={pieChartData} />
    </div>
    </div>
    <hr />
    <div>
        <DropdownSelect
          value={select}
          label="Choose Category"
          options={options}
          onChange={handleOptionChange}
        />
        <div className='mt-20'>
        <Barcharts data={resultBarData} />
        </div>

    </div>
  </div>
  </>
  );
}
