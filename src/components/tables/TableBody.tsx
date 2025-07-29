"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { useSelector } from "react-redux";
import { Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { ThemeConfig } from "@/configs";
import { Button, Checkbox } from "@/components";
import { decodeAccessToken } from "@/configs";
import { useGetUserMutation } from "@/stores/api/authen.api";
import { convertToBuddhistYear } from "@/constants";
import { RootState } from "@/stores/store";

const BASE_URL = process.env.BASE_URL;

interface TableRowProps {
  data: any[];
  columns: string[];
  columnMapping: Record<string, string>;
  selectedIds: string[];
  rowKey: string;
  loading?: boolean;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  onView?: (data: any) => void;
  handleSelect?: (id: string, checked: boolean) => void;
}

const TableBody = ({
  data,
  columns,
  columnMapping,
  selectedIds,
  rowKey,
  loading = false,
  onEdit,
  onDelete,
  onView,
  handleSelect,
}: TableRowProps) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  accessToken ? decodeAccessToken(accessToken) : null;

  const [getUser] = useGetUserMutation();
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [userNameMap, setUserNameMap] = useState<Record<string, string>>({});

  useEffect(() => {
    data.forEach((row) => {
      const createdById = row[columnMapping["ผู้สร้าง"]];
      const updatedById = row[columnMapping["ผู้แก้ไข"]];

      if (createdById) fetchUserName(createdById);
      if (updatedById) fetchUserName(updatedById);
    });
  }, [data]);

  const fetchUserName = async (userId: string) => {
    if (!userId || userNameMap[userId]) return;

    try {
      const response = await getUser(userId).unwrap();

      const decoded = decodeAccessToken(response.data.accessToken);
      if (!decoded) throw new Error("โทเค็นไม่ถูกต้อง");

      setUserNameMap((prev) => ({
        ...prev,
        [userId]: decoded.unique_name || "ไม่พบชื่อ",
      }));
    } catch (error) {
      console.error("ไม่สามารถโหลดชื่อผู้ใช้:", error);
      setUserNameMap((prev) => ({
        ...prev,
        [userId]: "ไม่พบชื่อ",
      }));
    }
  };

  return (
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={columns.length + 1} className="text-center py-5">
            กำลังโหลดข้อมูล...
          </td>
        </tr>
      ) : data.length === 0 ? (
        <tr>
          <td
            colSpan={columns.length + 1}
            className="text-center py-5"
            style={{ color: ThemeConfig.colors.textSecondary }}
          >
            ไม่มีข้อมูล
          </td>
        </tr>
      ) : (
        data.map((row, index) => (
          <tr
            key={row.id || index}
            className="border-b hover:bg-secondary transition-all"
            style={{
              borderColor: ThemeConfig.colors.platinum,
              backgroundColor: ThemeConfig.colors.backgroundAlt,
            }}
          >
            <td className="py-3 px-6 text-center">
              {handleSelect && (
                <Checkbox
                  id={row[rowKey]}
                  checked={selectedIds.includes(row[rowKey])}
                  onSelect={handleSelect}
                />
              )}
            </td>

            {columns.map((col) => (
              <td key={col} className="py-3 px-6 text-left align-top">
                {col === "รูปภาพ" ? (
                  row[columnMapping[col]]?.length > 0 ? (
                    <Image
                      src={`${BASE_URL}${row[columnMapping[col]][0].imageUrl}`}
                      alt="shirt"
                      width={100}
                      height={100}
                      className="object-cover rounded cursor-zoom-in"
                      onClick={() =>
                        setOpenImage(
                          `${BASE_URL}${row[columnMapping[col]][0].imageUrl}`
                        )
                      }
                    />
                  ) : (
                    "-"
                  )
                ) : col === "วันที่สร้าง" || col === "วันที่แก้ไข" ? (
                  convertToBuddhistYear(row[columnMapping[col]])
                ) : col === "ผู้สร้าง" || col === "ผู้แก้ไข" ? (
                  userNameMap[row[columnMapping[col]]] ||
                  row[columnMapping[col]]
                ) : col === "คำอธิบาย" ? (
                  <div className="max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {row[columnMapping[col]]?.replace(/,\s*/g, "\n") || "-"}
                  </div>
                ) : (
                  (() => {
                    const value = row[columnMapping[col]];

                    if (
                      Array.isArray(value) &&
                      value.length > 0 &&
                      typeof value[0] === "object"
                    ) {
                      return value
                        .map((item: any) => item.name || "")
                        .join(", ");
                    }

                    if (typeof value === "object" && value !== null) {
                      return value.name || "[object]";
                    }

                    return value ?? "-";
                  })()
                )}
              </td>
            ))}

            <td className="py-3 px-6 text-left">
              <div className="flex space-x-2 justify-center">
                <Button
                  onClick={() => onEdit && onEdit(row)}
                  icon={<Edit size={16} />}
                  className="px-3 py-1"
                />

                <Button
                  onClick={() => onDelete && onDelete(row)}
                  icon={<Trash2 size={16} />}
                  style={{
                    backgroundColor: ThemeConfig.colors.accentGreen,
                    color: ThemeConfig.colors.white,
                  }}
                  className="px-3 py-1"
                />

                {/* <Button
                  onClick={() => onView && onView(row)}
                  icon={<Eye size={16} />}
                  style={{
                    backgroundColor: ThemeConfig.colors.secondary,
                    color: ThemeConfig.colors.white,
                  }}
                  className="px-3 py-1"
                /> */}
              </div>
            </td>
          </tr>
        ))
      )}

      <Dialog
        open={!!openImage}
        onClose={() => setOpenImage(null)}
        maxWidth="xl"
      >
        {openImage?.trim() && (
          <img
            src={openImage ?? ""}
            alt="preview"
            className="w-full h-full object-contain"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
          />
        )}
      </Dialog>
    </tbody>
  );
};

export default TableBody;
