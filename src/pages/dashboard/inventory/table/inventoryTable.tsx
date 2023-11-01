import React, { useEffect, useState, useRef } from 'react';
import { fetchData } from '../../../../hooks/useFetchData';
import { inventoryList } from '../../../../types/global';
import Pagination from '../../../../components/Pagination/pagination';
import { CustomButton, CustomInput } from '../../../../components';
import Modal from '../../../../components/modal/modal';
import { uploadImageToStorage } from '../../../../config/imageUpload';
import toast, { Toaster } from 'react-hot-toast';
import { RootState } from '../../../../Redux/store';
import { useSelector } from 'react-redux';
import { db } from '../../../../db';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import BackdropLoading from '../../../../components/Backdrop/backdrop';

function InventoryTable() {
  const admin = useSelector((state: RootState) => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const [inventory, setInventory] = useState<inventoryList[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgPrev, setImagePrev] = useState('');
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [productDetails, setProductsDetails] = useState({
    Availability: true,
    Category: '',
    Description: '',
    Image_Url: '',
    Name: '',
    Price: 0,
    Quantity_In_Stock: 0,
    Inventory_Id: '',
  });
  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const paginateData =
    inventory && inventory.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => {
    const loadInventories = async () => {
      try {
        const loadedInventory = await fetchData('inventoryTable');
        loadedInventory?.shift();
        setInventory(loadedInventory as unknown as inventoryList[]);
      } catch (error) {
        setInventory([]);
      }
    };

    loadInventories();
  }, []);

  const handleInputChange = (e: {
    target: {
      files: any;
      checked?: any;
      name?: any;
      value?: any;
      type?: any;
    };
  }) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        // Handle file input
        const file = files[0];
        const blob = new Blob([file], { type: file.type });
        const blobURL = URL.createObjectURL(blob);
        setImagePrev(blobURL);
        setProductsDetails({ ...productDetails, [name]: file });
      }
    } else {
      setProductsDetails({ ...productDetails, [name]: value });
    }
  };

  const handleOpen = (item: inventoryList) => {
    setProductsDetails(item);
    setOpen(true);
  };

  const handleClose = () => {
    setImagePrev('');
    setOpen(false);
  };

  const editProduct = (
    <div className="flex">
      <div className="mr-3">
        <label htmlFor="">Product Name</label>
        <CustomInput
          ref={inputRef}
          type="text"
          name="Name"
          value={productDetails.Name}
          placeholder="Product Name"
          onChange={(e: {
            target: {
              files: any;
              checked?: any;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
        <label htmlFor="">Description</label>
        <CustomInput
          ref={inputRef}
          type="text"
          name="Description"
          value={productDetails.Description}
          placeholder="Description"
          onChange={(e: {
            target: {
              files: any;
              checked?: any;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
        <label htmlFor="">Product Image</label>
        <img
          src={imgPrev || productDetails.Image_Url}
          className="w-16 h-16 object-contain rounded-full"
          alt=""
        />
        <CustomInput
          ref={inputRef}
          type="file"
          name="Image_Url"
          value={null}
          placeholder="Image"
          onChange={(e: {
            target: {
              files: any;
              checked?: any;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
      </div>
      <div>
        <label htmlFor="">Category</label>
        <CustomInput
          ref={inputRef}
          type="text"
          name="Category"
          value={productDetails.Category}
          placeholder="Category"
          onChange={(e: {
            target: {
              files: any;
              checked?: any;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
        <label htmlFor="">Price</label>
        <CustomInput
          ref={inputRef}
          type="number"
          name="Price"
          value={productDetails.Price}
          placeholder="Price"
          onChange={(e: {
            target: {
              files: any;
              checked?: any;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
        <label htmlFor="">Quantity</label>
        <CustomInput
          ref={inputRef}
          type="number"
          value={productDetails.Quantity_In_Stock}
          name="Quantity_In_Stock"
          placeholder="Quantity"
          onChange={(e: {
            target: {
              files: any;
              checked?: any;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
      </div>
    </div>
  );

  const handleEdit = async () => {
    if (imgPrev) {
      const imageFile: any = productDetails.Image_Url;
      const storagePath = `/inventoryItems/${imageFile.name}`;
      const imageUrl = await uploadImageToStorage(imageFile, storagePath);
      const updatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedBy = admin.info?.id;
      const documentId = productDetails.Inventory_Id;
      const productData = {
        ...productDetails,
        Image_Url: imageUrl,
        Last_Updated_By: updatedBy,
        Last_Updated_On: updatedOn,
      };

      const docRef = doc(db, 'inventoryTable', documentId);
      setOpen(false);
      setShowBackdrop(true);
      updateDoc(docRef, productData)
        .then(async () => {
          const loadedInventory = await fetchData('inventoryTable');
          loadedInventory?.shift();
          setInventory(loadedInventory as unknown as inventoryList[]);
          setShowBackdrop(false);
          toast('Document updated successfully');
        })
        .catch((error) => {
          setShowBackdrop(false);
          console.error('Error updating document: ', error);
        });
    } else {
      const documentId = productDetails.Inventory_Id;
      const docRef = doc(db, 'inventoryTable', documentId);
      const updatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedBy = admin.info?.id;
      const productData = {
        ...productDetails,
        Last_Updated_By: updatedBy,
        Last_Updated_On: updatedOn,
      };
      setOpen(false);
      setShowBackdrop(true);
      updateDoc(docRef, productData)
        .then(async () => {
          const loadedInventory = await fetchData('inventoryTable');
          loadedInventory?.shift();
          setInventory(loadedInventory as unknown as inventoryList[]);
          setShowBackdrop(false);
          toast('Product updated successfully');
        })
        .catch((error) => {
          setShowBackdrop(false);
          console.error('Error updating document: ', error);
        });
    }
  };
  const handleDelete = (item: inventoryList) => {
    const documentId = item.Inventory_Id;
    const docRef = doc(db, 'inventoryTable', documentId);
    setOpen(false);
    setShowBackdrop(true);
    deleteDoc(docRef)
      .then(async () => {
        const loadedInventory = await fetchData('inventoryTable');
        loadedInventory?.shift();
        setInventory(loadedInventory as unknown as inventoryList[]);
        setShowBackdrop(false);
        toast('Product deleted successfully');
      })
      .catch((error) => {
        setShowBackdrop(false);
        setOpen(true);
        console.error('Error deleting document: ', error);
      });
  };
  const Actions: Array<{
    label: string;
    color: 'primary' | 'secondary';
    onClick: () => void;
  }> = [
    {
      label: 'Cancel',
      color: 'primary',
      onClick: handleClose,
    },
    {
      label: 'Submit',
      color: 'primary',
      onClick: handleEdit,
    },
  ];
  return (
    <>
      <BackdropLoading open={showBackdrop} />
      <Toaster position="top-center" reverseOrder={false} />
      <Modal
        open={open}
        onClose={handleClose}
        title="Edit Products"
        content={editProduct}
        actions={Actions}
      />
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
                    paginateData?.map((item: inventoryList, index: number) => (
                      <tr key={index}>
                        <td className="px-3 py-3.5 text-sm font-medium text-gray-900 sm:pl-6">
                          {item.Name}
                        </td>
                        <td className="px-3 py-4 text-gray-500">
                          <img
                            className="w-16 h-16 object-contain rounded-full"
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
                          <div className="pr-3">
                            <CustomButton
                              type="secondary"
                              onClick={() => handleOpen(item)}
                              disabled={false}
                            >
                              Edit Products
                            </CustomButton>
                          </div>
                          <div>
                            <CustomButton
                              type="secondary"
                              onClick={() => handleDelete(item)}
                              disabled={false}
                            >
                              Delete Products
                            </CustomButton>
                          </div>
                        </td>
                      </tr>
                    ))}
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
  );
}
export default InventoryTable;
