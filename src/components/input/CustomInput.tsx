import React, { forwardRef } from 'react';

type InputProps = {
  placeholder?: string;
  helperMsg?: string;
  name?:string;
  type?: string;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ type, onChange, helperMsg,name,value, placeholder, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          ref={ref}
          name={name}
          value={value}
          className="appearance-none placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-3 shadow-sm focus:outline-none focus:border-amberOrange focus:ring-amberOrangefocus:ring-1 sm:text-sm mb-3"
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
