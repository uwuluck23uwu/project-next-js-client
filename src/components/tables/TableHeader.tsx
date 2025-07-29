"use client";

import { ThemeConfig } from "@/configs";

interface TableHeaderProps {
  columns: string[];
}

const TableHeader = ({ columns }: TableHeaderProps) => {
  return (
    <thead>
      <tr
        className="uppercase text-sm leading-normal"
        style={{
          backgroundColor: ThemeConfig.colors.primary,
          color: ThemeConfig.colors.white,
        }}
      >
        <th className="py-3 px-6 text-center">เลือกรายการ</th>

        {columns.map((col) => (
          <th key={col} className="py-3 px-6 text-left">
            {col}
          </th>
        ))}

        <th className="py-3 px-6 text-center">การจัดการ</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
