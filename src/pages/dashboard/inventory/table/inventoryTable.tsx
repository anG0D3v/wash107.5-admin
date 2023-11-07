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
import DropdownSelect from '../../../../components/Dropdown/dropdown';
import Swal from 'sweetalert2';
import Checkbox from '@mui/material/Checkbox';
import { addData } from '../../../../hooks/useAddData';

function InventoryTable() {
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.admin);
  const inventory = useSelector((state: RootState) => state.inventory);
  const [open, setOpen] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgPrev, setImagePrev] = useState('');
  const [imgPrev1, setImagePrev1] = useState('');
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [category,setCategory] = useState('Wash Cycle');
  const [productAdd, setProductsAdd] = useState({
    Availability: true,
    Category: category,
    Created_By: admin.info?.id,
    Created_On: new Date().toISOString().slice(0, 19).replace('T', ' '),
    Description: '',
    Image_Url: '',
    Name: '',
    Price: 0,
    Duration: 0,
    Quantity_In_Stock: 0,
  });
  const [productDetails, setProductsDetails] = useState({
    Availability: true,
    Category: '',
    Description: '',
    Image_Url: '',
    Name: '',
    Price: 0,
    Quantity_In_Stock: 0,
    Inventory_Id: '',
    Duration: 0
  });

  
  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      dispatch(getInventoryPending());
      const data = (await fetchData('inventoryTable')) as inventoryList[];
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
      checked?: boolean;
      name?: any;
      value?: any;
      type?: any;
    };
  }) => {
    const { name, value, type, files,checked } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        const file = files[0];
        const blob = new Blob([file], { type: file.type });
        const blobURL = URL.createObjectURL(blob);
        
        if(open === 'Edit'){
          setImagePrev1(blobURL);
          setProductsDetails({ ...productDetails, [name]: file });
        }
        if(open === 'Add'){
          setImagePrev(blobURL);
          setProductsAdd({ ...productAdd, [name]: file });
        }

      }
    }else if(type === 'checkbox'){
      if(open === 'Edit'){
        setProductsDetails({ ...productDetails, [name]: checked });
      }
      if(open === 'Add'){
        setProductsAdd({ ...productAdd, [name]: checked });
      }
    } else {
      if(open === 'Edit'){
        setProductsDetails({ ...productDetails, [name]: value });
      }
      if(open === 'Add'){
        setProductsAdd({ ...productAdd, [name]: value });
      }
    }
  };

  const handleOptionChange = (value: string) => {
    setCategory(value);
    setProductsAdd({ ...productAdd, Category: value });
  };

  const handleOpen = (item: inventoryList | undefined) => {
   
    if(item){
      const { id, ...newproductDatawithId } = item;
      setProductsDetails(newproductDatawithId);
      setOpen('Edit');
    }else{
      setOpen('Add')
    }
  };

  const handleClose = () => {
    setImagePrev('');
    setOpen('');
  };


  const editProduct = (
    <div className="flex-col mx-4">
      <div className="mr-3">
        <label htmlFor="" className="block text-gray-700 font-bold mt-2"> Name</label>
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
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Product Image</label>
        <img
          src={imgPrev1 || productDetails.Image_Url}
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
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Price</label>
        <CustomInput
          ref={inputRef}
          type="number"
          name="Price"
          value={productDetails.Price}
          placeholder="Price"
          onChange={(e: {
            target: {
              files: any;
              checked?: boolean;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
        {category === 'Laundry Detergent' || category === 'Fabric Conditioner' ? (
        <>
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Quantity</label>
        <CustomInput
          ref={inputRef}
          type="number"
          value={productDetails.Quantity_In_Stock}
          name="Quantity_In_Stock"
          placeholder="Pieces"
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
        </>
        ) : (
          <>
          <label htmlFor="" className="block text-gray-700 font-bold mt-2">Duration</label>
          <CustomInput
            ref={inputRef}
            type="number"
            value={productDetails.Duration}
            name="Duration"
            placeholder="Minutes"
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
          </>
        )}
        <div className='flex align-center justfy-center'>
        <Checkbox
          name='Availability'
          checked={productDetails.Availability}
          onChange={(e: {
            target: {
              files: any;
              checked?: boolean;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <label htmlFor="Availability" className="block text-gray-700 font-bold mb-2 mt-2.5">Available{productDetails.Availability ? '(checked)' : '(unchecked)'}</label>
        </div>
        <label className="block text-gray-700 font-bold mt-2"
        htmlFor="">
          Description</label>
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
      </div>
    </div>
  );
  const createProduct = (
    <div className="flex-col mx-4">
      <div className="mr-3">
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Category</label>
        <CustomInput
          ref={inputRef}
          type="text"
          name="Name"
          value={productAdd.Category}
          disable={true}
        />
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Name *</label>
        <CustomInput
          ref={inputRef}
          type="text"
          name="Name"
          value={productAdd.Name}
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
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Image *</label>
        {imgPrev && (
          <img
            src={imgPrev}
            className="w-16 h-16 object-contain rounded-full"
            alt=""
          />
        )}
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
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Price *</label>
        <CustomInput
          ref={inputRef}
          type="number"
          name="Price"
          value={productAdd.Price}
          placeholder="Price"
          onChange={(e: {
            target: {
              files: any;
              checked?: boolean;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          helperMsg=""
        />
        {category === 'Laundry Detergent' || 
        category === 'Fabric Conditioner' ? (
        <>
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Quantity *</label>
        <CustomInput
          ref={inputRef}
          type="number"
          value={productAdd.Quantity_In_Stock}
          name="Quantity_In_Stock"
          placeholder="Pieces"
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
        </>
        ) : (category === 'Service' ? null :
          (<>
          <label htmlFor="" className="block text-gray-700 font-bold mt-2">Duration *</label>
          <CustomInput
            ref={inputRef}
            type="number"
            value={productAdd.Duration}
            name="Duration"
            placeholder="Minutes"
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
          </>)
        )}
        <div className='flex align-center justfy-center'>
        <Checkbox
          name='Availability'
          checked={productAdd.Availability}
          onChange={(e: {
            target: {
              files: any;
              checked?: boolean;
              name?: any;
              value?: any;
              type?: any;
            };
          }) => handleInputChange(e)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <label htmlFor="" className="block text-gray-700 font-bold mt-2.5">Available{productAdd.Availability ? '(checked)' : '(unchecked)'}</label>
        </div>
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Description *</label>
        <CustomInput
          ref={inputRef}
          type="textarea"
          name="Description"
          value={productAdd.Description}
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
      </div>
    </div>
  );
  const addProduct = async () => {
    if (
      productAdd.Name &&
      productAdd.Category &&
      productAdd.Description &&
      productAdd.Image_Url
    ) {
      const productData = { 
        ...productAdd, 
        Price: Number(productAdd.Price),
        Quantity_In_Stock: Number(productAdd.Quantity_In_Stock),
        Duration: Number(productAdd.Duration),
       };
       if(productData.Duration < 0 || productData.Price < 0 || productData.Quantity_In_Stock < 0){
        toast.error('Input value must not be negative')
        return
      }
      const check = category === 'Dry Cycle' || category === 'Wash Cycle' ? productData.Duration : productData.Quantity_In_Stock;
      if(!check || check === 0 || isNaN(check)){
        toast.error('Input value must not be 0')
        return
      }
      if(check.toString().includes('.')){
        let warn = '';
        if(category === 'Dry Cycle' || category === 'Wash Cycle'){
          warn += `No decimal places in Duration field`
        }else{
          warn += `No decimal places in Quantity fields`
        }
        toast.error(warn)
        return
      }
      if(category !== 'Service' && (productData.Price === 0 || isNaN(productData.Price) || !productData.Price)){
        toast.error('Input value must not be 0')
        return
      }
      try {
        setOpen('');
        setShowBackdrop(true);
        const imageFile: any = productAdd.Image_Url;
        const storagePath = `/inventoryItems/${imageFile.name}`;
        const imageUrl = await uploadImageToStorage(imageFile, storagePath);
        const productData = { 
          ...productAdd, 
        Image_Url: imageUrl,
        Price: Number(productAdd.Price),
        Quantity_In_Stock: Number(productAdd.Quantity_In_Stock),
        Duration: Number(productAdd.Duration),
         };
         let data;
         if(category === 'Service'){
           const {Quantity_In_Stock,Duration, ...newproductDatawithId} = productData;
           data = newproductDatawithId;
         }
         if(category === 'Wash Cycle' || category === 'Dry Cycle'){
           const {Quantity_In_Stock, ...newproductDatawithId} = productData;
           data = newproductDatawithId
         }
         if(category === 'Laundry Detergent' || category === 'Fabric Conditioner'){
           const {Duration, ...newproductDatawithId} = productData;
           data = newproductDatawithId
         }

        const docRef = await addData('inventoryTable',data)
        const Inventory_Id = docRef;
        const productDatawithId = { 
          ...data,
          Inventory_Id: Inventory_Id
        };
        await updateData('inventoryTable', Inventory_Id,productDatawithId)
        .then(async () => {
          await loadInventory()
          setImagePrev('')
          setShowBackdrop(false);
          toast.success('Added successfully.');
        })
        .catch((error) => {
          setShowBackdrop(false);
          console.error('Error updating document: ', error);
        });

      } catch (error) {
        setShowBackdrop(false);
        toast.error('Error adding document');
      }
    } else {
      toast.error('Details are incomplete. Required fields are missing.');
    }
  };
  const handleEdit = async () => {
    let imageUrl = productDetails.Image_Url; 
  
    if (imgPrev1) {
      const imageFile: any = productDetails.Image_Url;
      const storagePath = `/inventoryItems/${imageFile.name}`;
      imageUrl = await uploadImageToStorage(imageFile, storagePath);
    }
  
    const updatedOn = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedBy = admin.info?.id;
    const documentId = productDetails.Inventory_Id;
    const productData1 = {
      ...productDetails, 
      Image_Url: imageUrl,
      Price: Number(productDetails.Price),
      Quantity_In_Stock: Number(productDetails.Quantity_In_Stock),
      Duration: Number(productDetails.Duration),
      Last_Updated_By: updatedBy,
      Last_Updated_On: updatedOn,
    };
    if(category !== 'Service' && (productData1.Price === 0 || isNaN(productData1.Price) || !productData1.Price)){
      toast.error('Input value must not be 0')
      return
    }
    let data;
    if(productData1.Duration < 0 || productData1.Price < 0 || productData1.Quantity_In_Stock < 0){
      toast.error('Input value must not be negative')
      return
    }
    const check = category === 'Dry Cycle' || category === 'Wash Cycle' ? productData1.Duration : productData1.Quantity_In_Stock;
    if(!check || check === 0 || isNaN(check)){
      toast.error('Input value must not be 0')
      return
    }
    if(check.toString().includes('.')){
      let warn = '';
      if(category === 'Dry Cycle' || category === 'Wash Cycle'){
        warn += `No decimal places in Duration field`
      }else{
        warn += `No decimal places in Quantity fields`
      }
      toast.error(warn)
      return
    }

    if (category === 'Service') {
      const { Quantity_In_Stock, Duration, ...newproductDatawithId } = productData1;
      data = newproductDatawithId;
    } else if (category === 'Wash Cycle' || category === 'Dry Cycle') {
      const { Quantity_In_Stock, ...newproductDatawithId } = productData1;
      data = newproductDatawithId;
    } else if (category === 'Laundry Detergent' || category === 'Fabric Conditioner') {
      const { Duration, ...newproductDatawithId } = productData1;
      data = newproductDatawithId;
    }
    setOpen('');
    setShowBackdrop(true);
    await updateData('inventoryTable', documentId, data)
      .then(async () => {
        await loadInventory();
        setImagePrev1('')
        setShowBackdrop(false);
        toast.success('Updated successfully');
      })
      .catch((error) => {
        setShowBackdrop(false);
        console.error('Error updating document: ', error);
      });
  };
  const handleDelete = async(item: inventoryList) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then(async(result) => {
      if (result.isConfirmed) {
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
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'The Selected item/Service deletion has cancelled. :)',
          'error'
        )
      }
    })  

  };

  const ActionsEdit: Array<{
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
        label: 'Save changes',
        color: 'primary',
        onClick: handleEdit,
      },
    ];

  const ActionsCreate: Array<{
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
      label: `Add ${category}`,
      color: 'primary',
      onClick: addProduct,
    },
  ];
  const options = [
    { value: 'Wash Cycle', label: 'Wash Cycle'},
    { value: 'Dry Cycle', label: 'Dry Cycle'},
    { value: 'Laundry Detergent', label: 'Laundry Detergent'},
    { value: 'Fabric Conditioner', label: 'Fabric Conditioner'},
    { value: 'Service', label: 'Service'},
  ];


    let headTable: string[] = [];
    let datafilter: inventoryList[] = inventory?.data || [];
    switch (category) {
      case "Wash Cycle":
        headTable = [
          "Name",
          "Image",
          "Description",
          "Price",
          "Duration",
          "Availability",
        ]
        datafilter = datafilter?.filter(data => data.Category === 'Wash Cycle');
        break;
      case "Dry Cycle":
        headTable = [
          "Name",
          "Image",
          "Description",
          "Price",
          "Duration",
          "Availability",
        ]
        datafilter = datafilter?.filter(data => data.Category === 'Dry Cycle');
        break;
      case "Laundry Detergent":
        headTable = [
          "Name",
          "Image",
          "Description",
          "Price",
          "Quantity_In_Stock",
          "Availability",
      
        ]
        datafilter = datafilter?.filter(data => data.Category === 'Laundry Detergent');
        break;
      case "Fabric Conditioner":
        headTable = [
          "Name",
          "Image",
          "Description",
          "Price",
          "Quantity_In_Stock",
          "Availability",
        ]
        datafilter = datafilter?.filter(data => data.Category === 'Fabric Conditioner');
        break;
        case "Service":
          headTable = [
            "Name",
            "Image",
            "Description",
            "Price",
            "Availability",
          
          ]
          datafilter = datafilter?.filter(data => data.Category === 'Service');
          break;
      default:
        console.log("Invalid");
    }
  const headerTable: string[] = headTable;
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
  const d = Math.round(productDetails.Price * 100) / 100;
  console.log(d)

  return (
    <>
      <BackdropLoading open={showBackdrop} />
      <Toaster position="top-center" reverseOrder={false} />
      <Modal
        open={open === 'Edit'}
        onClose={handleClose}
        content={editProduct}
        actions={ActionsEdit}
      />
      <Modal
        open={open === 'Add'}
        onClose={handleClose}
        content={createProduct}
        actions={ActionsCreate}
      />
      <div className='flex justify-between align-center'>
        <DropdownSelect
          value={category}
          label="Choose Category"
          options={options}
          onChange={handleOptionChange}
        />
        <CustomButton 
        addedClass='h-max mt-8'
        type="primary" 
        onClick={() =>handleOpen(undefined)}>
          Add {`${category}`}
        </CustomButton>
      </div>
      <DataTable
        loading={inventory.loading}
        headers={headerTable}
        data={datafilter}
        actionHeader="Actions" 
        actionValue={actionValue}
      />

    </>
  );
}
export default InventoryTable;
