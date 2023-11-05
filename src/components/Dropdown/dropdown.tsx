import React from 'react';

type DropdownSelectProps<T> = {
  value: T;
  label: React.ReactNode;
  name?:string;
  options: { value: T; label: string}[];
  onChange: (value: T,name:T) => void;
};

function DropdownSelect<T extends string | number | readonly string[] | undefined>({ value, label, options,name, onChange }: DropdownSelectProps<T>) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold p-2 rounded-t-md">{label}</label>
      <select
        value={value}
        name={name}
        onChange={(e) => onChange(e.target.value as T,e.target.name as T)}
        className="block w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      >
        {options.map((option,index) => (
          <option 
          key={index}
          value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownSelect;
