import React, { useState,useRef } from 'react';
import InventoryTable from './table/inventoryTable';
import { CustomButton,CustomInput } from '../../../components';
import Modal from '../../../components/modal/modal';
import { db, collection, addDoc } from 'firebase/firestore';


export function Inventory() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [productDetails,setProductsDetails] = useState({
    Availability: false,
    Category: '',
    Created_By:'',
    Created_On: new Date(),
    Description:'',
    Image_Url: '',
    Name: '',
    Price:0,
    Quantity_In_Stock:0,
  })

  const handleInputChange = (e: { target: {
    files: any; checked?: any; name?: any; value?: any; type?: any; 
}; }) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setProductsDetails({ ...productDetails, [name]: e.target.files[0] });
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

      const productsCollection = collection(db, 'inventoryTable');
      await addDoc(productsCollection, productDetails);
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
        placeholder="Product Name"
        onChange={handleInputChange}
        helperMsg=""
      />
      <label htmlFor="">Description</label>
      <CustomInput
        ref={inputRef}
        type="text"
        placeholder="Description"
        onChange={handleInputChange}
        helperMsg=""
      />
      <label htmlFor="">Product Image</label>
      <CustomInput
        ref={inputRef}
        type="file"
        placeholder="Image"
        onChange={handleInputChange}
        helperMsg=""
      />
      </div>
      <div>
      <label htmlFor="">Price</label>
      <CustomInput
        ref={inputRef}
        type="number"
        placeholder="Price"
        onChange={handleInputChange}
        helperMsg=""
      />
      <label htmlFor="">Quantity</label>
      <CustomInput
        ref={inputRef}
        type="number"
        placeholder="Quantity"
        onChange={handleInputChange}
        helperMsg=""
      />
      </div>
    </div>
  );

  return (
    <>
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
