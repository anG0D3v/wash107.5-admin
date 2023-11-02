import { Typography } from '@mui/material';
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

  const handleVerify = async() =>{
    console.log('dsd')
  }

  const headerTable: string[] = [
    "Client_Id",
    "First_Name",
    "Last_Name",
    "Email_Address",
    "Phone_Number",
    "Registration_Date",
    "Address"
  ]
  const dataTable: UserInfo[] = users?.data || [];
  const actionValue = () =>[
    <CustomButton
    addedClass='mr-3 px-5'
    type="secondary" 
    onClick={() => handleVerify()}
    >
      Verify
    </CustomButton>
];
  return (
    <div>
      <Typography variant="h4" className="font-semibold">
        Users
      </Typography>
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
