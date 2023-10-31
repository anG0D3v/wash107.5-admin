import React, { useState } from 'react';
import InventoryTable from './table/inventoryTable';
import { CustomButton } from '../../../components';
import Modal from '../../../components/modal/modal';

export function Inventory() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const Actions = [
    {
      label: 'Cancel',
      color: 'primary', // Set the color to "primary"
      onClick: handleClose,
    },

  ];
  const createProduct = (
    <div>
      <p>This is custom content for the modal.</p>
      <p>You can add any JSX content you want here.</p>
    </div>
  );

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="My Modal"
        content={createProduct}
        actions={Actions}
      />
  <div className="text-black flex w-full justify-between">
    <h1 className="text-black text-2xl truncate font-extrabold">Inventory</h1>
    <CustomButton type="primary"onClick={handleOpen} disabled={true}>
      Add Products
    </CustomButton>
  </div>
  <InventoryTable/>
  </>
  );
}
