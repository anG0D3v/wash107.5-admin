import React, { useEffect, useState } from 'react';
import { fetchInventory } from '../../../../hooks/useGetInventory';
import { inventoryList } from '../../../../types/global';
import Pagination from '../../../../components/Pagination/pagination';
import { CustomButton } from '../../../../components';


function InventoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [inventory,setInventory] = useState<inventoryList[]>([]);
  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginateData =
  inventory &&
  inventory.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() =>{
    const fetchData = async () => {
      try {
        const loadedInventory = await fetchInventory('inventoryTable');
        loadedInventory?.shift();
        setInventory(loadedInventory as unknown as inventoryList[]);
      } catch (error) {
        setInventory([]); 
      }
    };

    fetchData();
  },[]) 

  const handleEdit = () =>{
    
  }
  const handleDelete = () =>{

  }
    return(
      <>
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Prcie
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Quantity Stock
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
                  {paginateData &&
                    paginateData?.map(
                      (item: inventoryList, index: number) => (
                        <tr key={index}>
                          <td className="px-3 py-3.5 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.Name}
                          </td>
                          <td className="px-3 py-4 text-gray-500">
                            <img className="w-16 h-16 object-contain rounded-full"
                             src={item.Image_Url} 
                             alt="Noimage" 
                             />
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.Description}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.Price}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.Category}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {item.Quantity_In_Stock}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500 flex">
                            <div className='pr-3'>
                            <CustomButton
                            type="secondary"
                            onClick={handleEdit} 
                            disabled={true}>
                              Edit Products
                            </CustomButton>
                            </div>
                            <div>
                            <CustomButton type="secondary"onClick={handleDelete} disabled={true}>
                              Delete Products
                            </CustomButton>
                            </div>
                          </td>

                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div>
          {inventory && (
            <Pagination
              postPerPage={postsPerPage}
              totalPosts={inventory.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
    </>
    )
}
export default InventoryTable

