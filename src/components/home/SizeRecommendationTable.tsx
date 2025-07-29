"use client";

import React from "react";
import { ThemeConfig } from "@/configs";

// 👇 แยกข้อมูลตารางไว้ตรงนี้
const sizeData = [
  {
    size: "S",
    height: "155 - 165",
    weight: "45 - 55",
    note: "เหมาะกับผู้รูปร่างเล็ก",
  },
  {
    size: "M",
    height: "160 - 170",
    weight: "55 - 65",
    note: "ขนาดมาตรฐานทั่วไป",
  },
  {
    size: "L",
    height: "165 - 175",
    weight: "65 - 75",
    note: "รูปร่างใหญ่ขึ้นเล็กน้อย",
  },
  {
    size: "XL",
    height: "170 - 185",
    weight: "75 - 90+",
    note: "เหมาะกับผู้รูปร่างใหญ่",
  },
];

const SizeRecommendationTable = () => {
  return (
    <div className="mt-10">
      <h3
        className="text-2xl font-bold mb-4"
        style={{ color: ThemeConfig.colors.textPrimary }}
      >
        ตารางแนะนำการเลือกขนาด
      </h3>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-left border border-gray-200">
          <thead
            style={{ backgroundColor: ThemeConfig.colors.accentGold }}
            className="text-white"
          >
            <tr>
              <th className="px-6 py-3 text-center">ขนาด</th>
              <th className="px-6 py-3 text-center">ส่วนสูง (ซม.)</th>
              <th className="px-6 py-3 text-center">น้ำหนัก (กก.)</th>
              <th className="px-6 py-3 text-center">คำแนะนำ</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: ThemeConfig.colors.backgroundAlt }}>
            {sizeData.map((row) => (
              <tr key={row.size} className="border-t border-gray-200">
                <td className="px-6 py-3 font-semibold text-sm text-center whitespace-nowrap">
                  {row.size}
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  {row.height}
                </td>
                <td className="px-6 py-3 text-center whitespace-nowrap">
                  {row.weight}
                </td>
                <td className="px-6 py-3">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeRecommendationTable;
