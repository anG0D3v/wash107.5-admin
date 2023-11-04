import React, { forwardRef } from 'react';

type InputProps = {
  placeholder?: string;
  helperMsg?: string;
  name?:string;
  type?: string;
  disable?: boolean;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ type, onChange, helperMsg,name,value, placeholder,disable, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          ref={ref}
          name={name}
          value={value}
          disabled={disable}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
        {helperMsg && <p className="text-red-600">{helperMsg}</p>}
      </>
    );
  },
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;
