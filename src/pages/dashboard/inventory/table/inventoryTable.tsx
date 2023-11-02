import React, { useEffect, useState, useRef } from 'react';
import { 
  getInventoryPending,
  getInventoryFulfilled,
  getInventoryFailed 
} from '../../../../Redux/InventorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../../../hooks/useFetchData';
import { updateData } from '../../../../hooks/useUpdateData';
import { deleteData } from '../../../../hooks/useDelete';
import { inventoryList } from '../../../../types/global';
import { CustomButton, CustomInput } from '../../../../components';
import Modal from '../../../../components/modal/modal';
import { uploadImageToStorage } from '../../../../config/imageUpload';
import toast, { Toaster } from 'react-hot-toast';
import { RootState } from '../../../../Redux/store';
import BackdropLoading from '../../../../components/Backdrop/backdrop';
import DataTable from '../../../../components/Table/table';

function InventoryTable() {
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.admin);
  const inventory = useSelector((state: RootState) => state.inventory);
  console.log(inventory)
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
  
  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      dispatch(getInventoryPending());
      const data = (await fetchData('inventoryTable')) as inventoryList[];
      console.log(data)
      data?.shift()
      dispatch(
        getInventoryFulfilled(
          data
        ),
      );
    } catch (error) {
      dispatch(getInventoryFailed(error));
    }
  }

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
      setOpen(false);
      setShowBackdrop(true)
      await updateData('inventoryTable', documentId,productData)
        .then(async () => {
          await loadInventory()
          setShowBackdrop(false);
          toast('Document updated successfully');
        })
        .catch((error) => {
          setShowBackdrop(false);
          console.error('Error updating document: ', error);
        });
    } else {
      const documentId = productDetails.Inventory_Id;
      const updatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedBy = admin.info?.id;
      const productData = {
        ...productDetails,
        Last_Updated_By: updatedBy,
        Last_Updated_On: updatedOn,
      };
      setOpen(false);
      setShowBackdrop(true);
      await updateData('inventoryTable', documentId,productData)
        .then(async () => {
          await loadInventory()
          setShowBackdrop(false);
          toast('Product updated successfully');
        })
        .catch((error) => {
          setShowBackdrop(false);
          console.error('Error updating document: ', error);
        });
    }
  };
  const handleDelete = async(item: inventoryList) => {
    const documentId = item.Inventory_Id;
    setShowBackdrop(true);
    deleteData('inventoryTable', documentId)
      .then(async () => {
        await loadInventory()
        setShowBackdrop(false);
        toast('Product deleted successfully');
      })
      .catch((error) => {
        setShowBackdrop(false);
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

  const headerTable: string[] = [
    "Name",
    "Image",
    "Description",
    "Price",
    "Category",
    "Quantity_In_Stock"
  ]
  const dataTable: inventoryList[] = inventory?.data || [];
  const actionValue = (item: inventoryList) =>[
      <CustomButton
      addedClass='mr-3 px-5'
      type="primary" 
      onClick={() => handleOpen(item)}
      >
        Edit
      </CustomButton>,
      <CustomButton 
      type="secondary"
      onClick={() => handleDelete(item)}
      >
        Delete
      </CustomButton>,
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
      <DataTable
        loading={inventory.loading}
        headers={headerTable}
        data={dataTable}
        actionHeader="Actions" 
        actionValue={actionValue}
      />

    </>
  );
}
export default InventoryTable;
