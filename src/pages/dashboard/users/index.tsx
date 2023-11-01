import { CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
import Pagination from '../../../components/Pagination/pagination';

export function Users() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginateData =
    users?.data && users?.data?.slice(indexOfFirstPost, indexOfLastPost);
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

  return (
    <div>
      <Typography variant="h4" className="font-semibold">
        Users
      </Typography>

      <div className="mt-5 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto md:overflow-visible sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
            <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mb-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-800  text-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 sm:pl-6 text-left text-sm font-semibold text-white"
                    >
                      Client ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 sm:pl-6 text-left text-sm font-semibold text-white"
                    >
                      First Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Last Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Email Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Date Registered
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users?.loading ? (
                    <tr className="w-full ">
                      <td className="p-10" colSpan={10}>
                        <div className="flex items-center justify-center flex-col space-y-4">
                          <CircularProgress />
                          <Typography variant="h6">Fetching Data...</Typography>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginateData &&
                    paginateData?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-3.5 text-sm font-medium text-gray-900 sm:pl-6">
                          {item?.Client_Id}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {item?.First_Name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {item?.Last_Name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {item?.Email_Address}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {item.Phone_Number}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {item?.Registration_Date}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {item?.Address}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 flex">
                          <div className="pr-3">
                            <CustomButton
                              type="secondary"
                              disabled
                              onClick={() => {
                                console.log('dfdf');
                              }}
                            >
                              Verify
                            </CustomButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div>
              {users?.data && (
                <Pagination
                  postPerPage={postsPerPage}
                  totalPosts={users?.data?.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
