"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components";
import { ThemeConfig } from "@/configs";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  return (
    <div className="flex justify-center items-center gap-3 mt-4">
      {/* ไปหน้าแรก */}
      <Button
        onClick={handleFirstPage}
        icon={<ChevronsLeft className="w-4 h-4" />}
        style={{
          backgroundColor: ThemeConfig.colors.secondary,
          color: ThemeConfig.colors.white,
          borderRadius: "50%",
          height: "50px",
        }}
        hoverScale={1.05}
      />

      {/* ถอยกลับ */}
      <Button
        onClick={handlePrevious}
        icon={<ChevronLeft className="w-4 h-4" />}
        style={{
          backgroundColor: ThemeConfig.colors.accentGreen,
          color: ThemeConfig.colors.white,
          borderRadius: "50%",
          height: "50px",
        }}
        hoverScale={1.05}
      />

      <span className="text-gray-600">
        หน้า {currentPage} จาก {totalPages}
      </span>

      {/* ไปข้างหน้า */}
      <Button
        onClick={handleNext}
        icon={<ChevronRight className="w-4 h-4" />}
        style={{
          backgroundColor: ThemeConfig.colors.accentGreen,
          color: ThemeConfig.colors.white,
          borderRadius: "50%",
          height: "50px",
        }}
        hoverScale={1.05}
      />

      {/* ไปหน้าสุดท้าย */}
      <Button
        onClick={handleLastPage}
        icon={<ChevronsRight className="w-4 h-4" />}
        style={{
          backgroundColor: ThemeConfig.colors.secondary,
          color: ThemeConfig.colors.white,
          borderRadius: "50%",
          height: "50px",
        }}
        hoverScale={1.05}
      />
    </div>
  );
};

export default TablePagination;
