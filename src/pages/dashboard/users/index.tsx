import React, { useEffect } from 'react';
import { fetchData } from '../../../hooks/useFetchData';
import { UserInfo } from '../../../types/global';
import { USER_ROLES } from '../../../config/contants';
import {
  getUsersFailed,
  getUsersFulfilled,
  getUsersPending,
} from '../../../Redux/UserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { CustomButton } from '../../../components';
import DataTable from '../../../components/Table/table';
import { updateData } from '../../../hooks/useUpdateData';
import toast, { Toaster } from 'react-hot-toast';

export function Users() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      dispatch(getUsersPending());
      const data = (await fetchData('userTable')) as UserInfo[];
      dispatch(
        getUsersFulfilled(
          data?.filter((user) => user.Role === USER_ROLES.USER),
        ),
      );
    } catch (error) {
      dispatch(getUsersFailed(error));
    }
  }

  const handleVerify = async (item: UserInfo) => {
    const updatedInfo = { ...item, Verified: !item.Verified };
    await updateData('userTable', item.id, updatedInfo)
      .then(async () => {
        await loadUsers();
        toast.success('Verified successfully.');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };

  const headerTable: string[] = [
    'Client_Id',
    'First_Name',
    'Last_Name',
    'Email_Address',
    'Phone_Number',
    'Registration_Date',
    'Address',
    'Verified',
  ];
  const dataTable: UserInfo[] = users?.data || [];
  const actionValue = (item: UserInfo) => [
    <CustomButton
      addedClass="mr-3 px-5"
      type="secondary"
      onClick={() => handleVerify(item)}
      disabled={item.Verified}
    >
      {item.Verified ? 'Verified' : 'Verify'}
    </CustomButton>,
  ];
  return (
    <div>
      <Toaster />
      <h1 className="text-4xl font-extrabold text-gray-700 tracking-wide mb-4">
        Users
      </h1>
      <DataTable
        loading={users.loading}
        headers={headerTable}
        data={dataTable}
        actionHeader="Actions"
        actionValue={actionValue}
      />
    </div>
  );
}
