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
    className={type === 'primary' ? 'bg-blue-700' : ''}
  >
    {children}
  </button>
);

export default CustomButton;
