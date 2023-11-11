import React, { useEffect } from 'react';
import { RootState } from '../../Redux/store';
import { OrderInfo, UserInfo,AnnouncementInfo } from '../../types/global';
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

export function Dashboard() {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.orders);
  const user = useSelector((state: RootState) => state.users);
  const announcement = useSelector((state: RootState) => state.announcement);
  const dataTable1: OrderInfo[] = order?.data || [];
  const dataTable3: UserInfo[] = user?.data || [];
  const dataTable4: AnnouncementInfo[] = announcement?.data || [];

  useEffect(() => {
    loadOrdered();
    loadUser();
    loadAnnouncement();
  }, []);

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
  const totalVerified = dataTable3.filter(data => data.Verified).length;
  const totalNot = dataTable3.filter(data => !data.Verified).length;
  const annVisible = dataTable4?.filter(data => data.Visibility)
  const filteredAnnouncements = annVisible
  .filter(announcement => announcement.Created_On) 
  .sort((a: { Created_On: string }, b: { Created_On: string }) => new Date(b.Created_On).getTime() - new Date(a.Created_On).getTime());

  return (
  <>
    <div className="flex flex-wrap">
    <CustomCard data={totalCompleted} iconSrc={CompletedIcon}>
        Total Completed Order
    </CustomCard>
    <CustomCard data={totalCancelled} iconSrc={CancelIcon}>
        Total Cancelled Order
    </CustomCard>
    <CustomCard data={totalVerified} iconSrc={VerifiedIcon}>
        Total Verified Users
    </CustomCard>
    <CustomCard data={totalNot} iconSrc={NotVerifiedIcon}>
        Total Not Verified Users
    </CustomCard>
    </div>
    <div className='flex flex-wrap'>
      <div className="flex flex-col w-3/5  h-96">

      </div>
      <div className="flex flex-col w-2/5 -600 h-96 overflow-y-auto p-4 rounded-5 border-8">
          <h1 className='mb-4'>Recent Announcement</h1>
          {filteredAnnouncements?.map((data,index) =>{
            if(!data){return null;}
              else{
                return (
              <div className='mb-6 flex items-center' key={index}>
                <img
                className='w-36 h-24 object-contain rounded-md'
                 src={data.Image_Url}
                 alt="" />
                 <h1 className='ml-4'>{data.Announcement_Name}</h1>
              </div>)
          }
          })}
      </div>
    </div>
  </>
  );
}
