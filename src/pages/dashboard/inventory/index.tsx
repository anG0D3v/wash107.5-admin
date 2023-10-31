import React, { useState,useRef } from 'react';
import InventoryTable from './table/inventoryTable';
import { CustomButton,CustomInput } from '../../../components';
import Modal from '../../../components/modal/modal';
import { db } from '../../../db';
import { collection, addDoc } from 'firebase/firestore';
import { uploadImageToStorage } from '../../../config/imageUpload';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import toast, { Toaster } from 'react-hot-toast';

export function Inventory() {
  const admin = useSelector((state: RootState) => state.login);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [productDetails,setProductsDetails] = useState({
    Availability: true,
    Category: '',
    Created_By:admin.info?.id,
    Created_On: new Date().toISOString().slice(0, 19).replace('T', ' '),
    Description:'',
    Image_Url: '',
    Name: '',
    Price:0,
    Quantity_In_Stock:0,
  })

  const handleInputChange = (e: { target: {
    files: any; checked?: any; name?: any; value?: any; type?: any; 
}; }) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        // Handle file input
        const file = files[0];
        setProductsDetails({ ...productDetails, [name]: file });
      }
    } else {
      setProductsDetails({ ...productDetails, [name]: value });
    }
  };


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const addProduct = async() =>{
    if (
      productDetails.Name &&
      productDetails.Category &&
      productDetails.Price &&
      productDetails.Quantity_In_Stock &&
      productDetails.Description &&
      productDetails.Image_Url
    ) {
      const imageFile:any = productDetails.Image_Url;
      const storagePath = `/inventoryItems/${imageFile.name}`;
      const imageUrl = await uploadImageToStorage(imageFile, storagePath);
      const productData = { ...productDetails, Image_Url: imageUrl };
      console.log(productData)
      const productsCollection = collection(db, 'inventoryTable');
      try {
        await addDoc(productsCollection, productData);
        toast('Document added successfully.');
      } catch (error) {
        console.log(error)
        toast('Error adding document');
      }
    } else {
      console.log(productDetails)
     toast('Product details are incomplete. Required fields are missing.');
    }
  }
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
      onClick: addProduct,
    },

  ];
  const createProduct = (
    <div className='flex'>
      <div className='mr-3'>
      <label htmlFor="">Product Name</label>
      <CustomInput
        ref={inputRef}
        type="text"
        name='Name'
        placeholder="Product Name"
        onChange={(e: { target: { files: any; checked?: any; name?: any; value?: any; type?: any; }; }) =>handleInputChange(e)}
        helperMsg=""
      />
      <label htmlFor="">Description</label>
      <CustomInput
        ref={inputRef}
        type="text"
        name='Description'
        placeholder="Description"
        onChange={(e: { target: { files: any; checked?: any; name?: any; value?: any; type?: any; }; }) =>handleInputChange(e)}
        helperMsg=""
      />
      <label htmlFor="">Product Image</label>
      <CustomInput
        ref={inputRef}
        type="file"
        name='Image_Url'
        placeholder="Image"
        onChange={(e: { target: { files: any; checked?: any; name?: any; value?: any; type?: any; }; }) =>handleInputChange(e)}
        helperMsg=""
      />
      </div>
      <div>
      <label htmlFor="">Category</label>
      <CustomInput
        ref={inputRef}
        type="text"
        name='Category'
        placeholder="Category"
        onChange={(e: { target: { files: any; checked?: any; name?: any; value?: any; type?: any; }; }) =>handleInputChange(e)}
        helperMsg=""
      />
      <label htmlFor="">Price</label>
      <CustomInput
        ref={inputRef}
        type="number"
        name='Price'
        placeholder="Price"
        onChange={(e: { target: { files: any; checked?: any; name?: any; value?: any; type?: any; }; }) =>handleInputChange(e)}
        helperMsg=""
      />
      <label htmlFor="">Quantity</label>
      <CustomInput
        ref={inputRef}
        type="number"
        name='Quantity_In_Stock'
        placeholder="Quantity"
        onChange={(e: { target: { files: any; checked?: any; name?: any; value?: any; type?: any; }; }) =>handleInputChange(e)}
        helperMsg=""
      />
      </div>
    </div>
  );

  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
      <Modal
        open={open}
        onClose={handleClose}
        title="Create Products"
        content={createProduct}
        actions={Actions}
      />
  <div className="text-black flex w-full justify-between">
    <h1 className="text-black text-2xl truncate font-extrabold">Inventory</h1>
    <CustomButton type="primary"onClick={handleOpen} >
      Add Products
    </CustomButton>
  </div>
  <InventoryTable/>
  </>
  );
}
