import React, { ReactNode } from 'react';

type BtnType = 'primary' | 'secondary' | 'transparent' | 'link';

type BtnProps = {
  children: ReactNode;
  disabled?: boolean;
  type?: BtnType;
  onClick: () => void;
};
const CustomButton: React.FC<BtnProps> = ({
  children,
  onClick,
  type = 'primary',
  ...props
}) => (
  <button
    onClick={onClick}
    {...props}
    className={type === 'primary' ? "bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
     : "bg-pink-700 hover:bg-pink-900 text-white font-semibold py-2 cursor-pointer px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"}
  >
    {children}
  </button>
);

export default CustomButton;
