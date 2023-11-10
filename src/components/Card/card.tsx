// CustomCard.tsx
import React from 'react';
import { Card, CardProps } from '@mui/material'; // Adjust the import based on your project structure

interface CustomCardProps {
  data: number;
  iconSrc?: string;
  children: string;
}

const CustomCard: React.FC<CustomCardProps & CardProps> = ({ data, iconSrc, children }) => (
  <Card className="flex flex-col flex-1 flex-basis-[calc(33.33%-20px)] min-w-[200px] max-w-[calc(50%-20px)] h-[200px] p-5 m-5 relative rounded-5 border-8 ">
    {iconSrc && (
      <img
        className="absolute w-24 right-2"
        src={iconSrc}
        alt=""
      />
    )}
    <div className="w-3/4 flex flex-col justify-center items-center mt-4 z-20">
      <h1 className="text-5xl mb-2 text-fuchsia-600 font-black bg-neutral-900 px-2 py-1.5 rounded-md">
        {data}
      </h1>
      <p className="text-2xl font-bold text-black leading-[23.57px] font-roboto-serif text-center">
        {children}
      </p>
    </div>
  </Card>
);

export default CustomCard;
