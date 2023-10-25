import React, { forwardRef } from 'react';

type InputProps = {
  placeholder?: string;
  helperMsg?: 'string';
  type?: 'string';
  onChange?: () => void;
};

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ type, onChange, helperMsg, placeholder, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          ref={ref}
          className="w-full"
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
