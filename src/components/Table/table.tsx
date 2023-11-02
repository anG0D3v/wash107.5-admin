import React, { useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import Pagination from '../Pagination/pagination';

type TableProps = {
  headers: string[];
  data: any[];
  loading:boolean;
  actionHeader: string;
  actionValue: (item: any) => React.ReactNode;
};

const DataTable: React.FC<TableProps> = ({ headers, data, actionHeader,loading, actionValue}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const postsPerPage = 5;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const paginateData =
    data && data?.slice(indexOfFirstPost, indexOfLastPost);
  return (
    <div className="mt-5 flow-root mb-5">
      <div className="-mx-4 -my-2 overflow-x-auto md:overflow-visible sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
          <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mb-5">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-3 py-3.5 sm:pl-6 text-left text-sm font-semibold text-white"
                    >
                      {header}
                    </th>
                  ))}
                  <th scope="col" className="px-3 py-3.5 sm:pl-6 text-left text-sm font-semibold text-white">
                    {actionHeader}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                    <tr className="w-full ">
                      <td className="p-10" colSpan={10}>
                        <div className="flex items-center justify-center flex-col space-y-4">
                          <CircularProgress />
                          <Typography variant="h6">Fetching Data...</Typography>
                        </div>
                      </td>
                    </tr>
                  ) : (paginateData?.map((item, index) => (
                    <tr key={index}>
                    {headers.map((header, dataIndex) => (
                        <td key={dataIndex} className="px-3 py-4 text-sm text-gray-500">
                            {header === 'Image' ? (
                            <img
                                src={item.Image_Url}
                                alt="Image"
                                className="w-16 h-16 object-contain rounded-full"
                            />
                            ) : (
                            item[header]
                            )}
                        </td>
                    ))}
                    <td className="px-3 py-4 text-sm text-gray-500">
                        {actionValue(item)}
                    </td>
                    </tr>
                )))}
              </tbody>
            </table>
          </div>
          <div>
              {data && (
                <Pagination
                  postPerPage={postsPerPage}
                  totalPosts={data.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;