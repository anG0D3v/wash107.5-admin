import clsx from 'clsx';
import React, { ReactNode } from 'react';

type BtnType = 'primary' | 'secondary' | 'transparent' | 'link';

type BtnProps = {
  children: ReactNode;
  disabled?: boolean;
  type?: BtnType;
  onClick: () => void;
  addedClass?: string;
  icon?: React.ReactNode;
};
const CustomButton: React.FC<BtnProps> = ({
  children,
  onClick,
  type = 'primary',
  disabled,
  addedClass,
  icon,
  ...props
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    {...props}
    className={clsx(
      type === 'primary'
        ? 'bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105'
        : 'bg-pink-700 hover:bg-pink-900 text-white font-semibold py-2 cursor-pointer px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105',
      disabled ? 'bg-gray-400 hover:bg-gray-400' : '',
      addedClass,
    )}
  >
    <div
      className={clsx(
        'w-full flex',
        icon ? 'items-center gap-3' : 'items-center justify-center',
      )}
    >
      {icon}
      {children}
    </div>
  </button>
);

export default CustomButton;
