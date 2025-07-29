"use client";

import { useState } from "react";

interface SelectProps {
  options: { label: string; value: string | number }[];
  placeholder?: string;
  onChange?: (value: string | number) => void;
  defaultValue?: string | number;
  disabled?: boolean;
};

const Select = ({
  options,
  placeholder = "เลือกตัวเลือก",
  onChange,
  defaultValue,
  disabled = false,
}: SelectProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    if (onChange) onChange(value);
  };

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
      className={"w-full p-4 border rounded border-gray-300 focus:outline-none"}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
