import React from 'react';
import InventoryTable from './table/inventoryTable';


export function Inventory() {


  return (
    <>
      <div className="text-black flex flex-col w-full justify-between h-auto">
        <div className="text-black flex w-full justify-between">
        <h1 className="text-4xl font-extrabold text-gray-700 tracking-wide">
          Inventory
        </h1>
        </div>
        <div>
        <InventoryTable />
        </div>
      </div>


    </>
  );
}
