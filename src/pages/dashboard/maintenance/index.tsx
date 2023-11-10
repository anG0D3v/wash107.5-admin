import React, { useEffect, useRef, useState } from 'react';
import { AnnouncementInfo } from '../../../types/global';
import { 
  getAnnouncementPending,
  getAnnouncementFulfilled,
  getAnnouncementFailed
 } from '../../../Redux/announcementSlice';
import { RootState } from '../../../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../../../hooks/useFetchData';
import DataTable from '../../../components/Table/table';
import Modal from '../../../components/modal/modal';
import { CustomInput } from '../../../components';
import { Checkbox } from '@mui/material';
import { uploadImageToStorage } from '../../../config/imageUpload';
import { addData } from '../../../hooks/useAddData';
import { updateData } from '../../../hooks/useUpdateData';
import toast, { Toaster } from 'react-hot-toast';
import BackdropLoading from '../../../components/Backdrop/backdrop';

export function Maintenance() {
  const dispatch = useDispatch();
  const announcement = useSelector((state: RootState) => state.announcement);
  const admin = useSelector((state: RootState) => state.admin);
  const dataTable: AnnouncementInfo[] = announcement?.data || [];
  const [open, setOpen] = useState(false);
  const [imgPrev, setImagePrev] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [announceDetails,setAnnounceDet] = useState({
    Announcement_Id:'',
    Announcement_Name:'',
    Created_By:admin.info?.id,
    Created_On:new Date().toISOString().slice(0, 19).replace('T', ' '),
    Image_Url:'',
    Visibility:true,
  })

  useEffect(() => {
    loadAnnouncement();
  }, []);

  async function loadAnnouncement() {
    try {
      dispatch(getAnnouncementPending());
      const data = (await fetchData('announcementTable')) as AnnouncementInfo[];
      data?.shift()
      dispatch(
        getAnnouncementFulfilled(
          data,
        ),
      );
    } catch (error) {
      dispatch(getAnnouncementFailed(error));
    }
  }

  const headerTable: string[] = [
    "Announcement_Id",
    "Announcement_Name",
    "Created_By",
    "Created_On",
    "Image_Url",
    "Visibility"

  ];
  const handleOpen = () =>{
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false);
  };

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
        setImagePrev(blobURL);
        setAnnounceDet({ ...announceDetails, [name]: file });
    }
    }else if(type === 'checkbox'){
      setAnnounceDet({ ...announceDetails, [name]: checked });

    } else {
      setAnnounceDet({ ...announceDetails, [name]: value });
    }
  };
  const Form = (
    <div className="flex-col mx-4">
        <label htmlFor="" className="block text-gray-700 font-bold mt-2">Name *</label>
        <CustomInput
          ref={inputRef}
          type="text"
          name="Announcement_Name"
          value={announceDetails.Announcement_Name}
          placeholder="Announcement Name"
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
        <label htmlFor="" className="block text-gray-700 font-bold mt-2"> Image *</label>
        {imgPrev && <img
          src={imgPrev}
          className="w-16 h-16 object-contain rounded-full"
          alt=""
        />}
        <CustomInput
          ref={inputRef}
          type="file"
          name="Image_Url"
          value={null}
          placeholder="Image_Url"
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
                <div className='flex align-center justfy-center'>
        <Checkbox
          name='Visibility'
          checked={announceDetails.Visibility}
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
        <label htmlFor="Availability" className="block text-gray-700 font-bold mb-2 mt-2.5">IsVisible{announceDetails.Visibility ? '(checked)' : '(unchecked)'}</label>
        </div>     
    </div>
  )
  const handleAdd = async () => {
    if (
      announceDetails.Announcement_Name &&
      announceDetails.Image_Url 
    ) {
      try {
        setOpen(false);
        setShowBackdrop(true);
        const imageFile: any = announceDetails.Image_Url;
        const storagePath = `/announcements/${imageFile.name}`;
        const imageUrl = await uploadImageToStorage(imageFile, storagePath);
        const announceData = { 
          ...announceDetails, 
          Image_Url: imageUrl
         };
        const docRef = await addData('announcementTable',announceData)
        const Announcement_Id = docRef;
        const announceDatawithId = { 
          ...announceData,
          Announcement_Id: Announcement_Id
        };
        await updateData('announcementTable', Announcement_Id,announceDatawithId)
        .then(async () => {
          await loadAnnouncement()
          setImagePrev('')
          setShowBackdrop(false);
          setAnnounceDet({
            Announcement_Id:'',
            Announcement_Name:'',
            Created_By:admin.info?.id,
            Created_On:new Date().toISOString().slice(0, 19).replace('T', ' '),
            Image_Url:'',
            Visibility:true,
          })
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
        label: 'Create',
        color: 'primary',
        onClick: handleAdd,
      },
    ];
  return (
  <>
      <Toaster position="top-center" reverseOrder={false} />
    <BackdropLoading open={showBackdrop} />
    <Modal
    open={open}
    onClose={handleClose}
    content={Form}
    actions={Actions}
  />
  <div className="text-black">
    <div className='flex justify-between items-center mt-2'>
    <h1>Maintenance</h1>
    <button onClick={handleOpen} className='text-white font-semibold py-2 px-4 rounded-[3px] shadow-md transition duration-300 ease-in-out transform hover:scale-105 bg-blue-700'>
      Create Announcement
    </button>
    </div>

    <DataTable
        loading={announcement.loading}
        headers={headerTable}
        data={dataTable}
      />
    </div>
    </>);
}
