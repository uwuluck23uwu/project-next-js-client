"use client";

interface SelectableCheckboxProps {
  id: string;
  checked: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

const Checkbox = ({ id, checked, onSelect }: SelectableCheckboxProps) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onSelect(id, e.target.checked)}
      className="form-checkbox h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
    />
  );
};

export default Checkbox;
