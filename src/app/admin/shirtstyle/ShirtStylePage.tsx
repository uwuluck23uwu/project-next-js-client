"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TableContainer,
} from "@mui/material";
import { RootState } from "@/stores/store";
import { ThemeConfig } from "@/configs";
import { useGenerateFields } from "@/constants";
import {
  Search,
  Button,
  TableHeader,
  TableBody,
  TablePagination,
  GenericModal,
  DeleteModal,
  NotificationModal,
  Loader,
} from "@/components";
import {
  useGetShirtStylesQuery,
  useCreateShirtStyleMutation,
  useUpdateShirtStyleMutation,
  useDeleteShirtStylesMutation,
} from "@/stores/api/shirtstyle.api";
import {
  AddShirtStyleSchema,
  UpdateShirtStyleSchema,
} from "@/validations/shirtstyle.validation";

export interface ShirtStyleData {
  shirtStyleId: string;
  name: string;
  description: string;
  price?: number | string;
  createdBy: string;
  updatedBy?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  shirtStyleImages?: { imageUrl: string }[];
  sizes?: { name: string }[];
};

const ShirtStylePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<ShirtStyleData | null>(null);
  const [deleteData, setDeleteData] = useState<ShirtStyleData | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [showAppModal, setShowAppModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMultipleDelete, setShowMultipleDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [createShirtStyle] = useCreateShirtStyleMutation();
  const [updateShirtStyle] = useUpdateShirtStyleMutation();
  const [deleteShirtStyles] = useDeleteShirtStylesMutation();

  const { user_id } = useSelector((state: RootState) => state.auth);

  const {
    data: ShirtStylesData,
    isLoading,
    refetch,
  } = useGetShirtStylesQuery({
    pageSize: 10,
    currentPage,
    search: searchQuery,
  });

  const pagination = ShirtStylesData?.pagin || {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalRows: 0,
  };

  const ShirtStyleColumnMapping: Record<string, keyof ShirtStyleData> = {
    รหัสสไตล์เสื้อ: "shirtStyleId",
    ชื่อสไตล์เสื้อ: "name",
    รูปภาพ: "shirtStyleImages",
    ขนาด: "sizes",
    ราคา: "price",
    คำอธิบาย: "description",
    ผู้สร้าง: "createdBy",
    ผู้แก้ไข: "updatedBy",
    วันที่สร้าง: "createdAt",
    วันที่แก้ไข: "updatedAt",
  };

  const ShirtStyleColumns = Object.keys(ShirtStyleColumnMapping);

  const ShirtStyleFieldsForAdd = useGenerateFields(ShirtStyleColumnMapping, [
    "ชื่อสไตล์เสื้อ",
    "รูปภาพ",
    "ขนาด",
    "ราคา",
    "คำอธิบาย",
  ]);

  const ShirtStyleFieldsForUpdate = useGenerateFields(ShirtStyleColumnMapping, [
    "ชื่อสไตล์เสื้อ",
    "รูปภาพ",
    "ขนาด",
    "ราคา",
    "คำอธิบาย",
  ]);

  if (isLoading) {
    return <Loader />;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    refetch();
  };

  const notify = (message: string, type: "success" | "error") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      const priceNum = values.price === "" ? 0 : parseFloat(values.price);

      if (showEditModal && selectedData?.shirtStyleId) {
        formData.append("ShirtStyleId", selectedData.shirtStyleId);
      }

      formData.append("Name", values.name);
      formData.append("Description", values.description);
      formData.append("Price", priceNum.toString());
      formData.append("CreatedBy", values.createdBy || "ระบบ");

      if (Array.isArray(values.shirtStyleImages)) {
        values.shirtStyleImages.forEach((img: any) => {
          if (img instanceof File) {
            formData.append("ShirtStyleImages", img);
          }
        });
      }

      if (Array.isArray(values.sizes)) {
        values.sizes.forEach((size: any) => {
          const sizeVal =
            typeof size === "string" ? size : size.value || size.name;
          formData.append("Sizes", sizeVal.toString());
        });
      }

      if (showEditModal) {
        await updateShirtStyle(formData).unwrap();
        notify("แก้ไขข้อมูลสำเร็จ!", "success");
      } else {
        await createShirtStyle(formData).unwrap();
        notify("เพิ่มข้อมูลสำเร็จ!", "success");
      }

      refetch();
      setShowAppModal(false);
      setShowEditModal(false);
    } catch (error) {
      notify("เกิดข้อผิดพลาดในการบันทึกข้อมูล!", "error");
    }
  };

  const handleConfirmDeleteMultiple = async () => {
    try {
      if (showMultipleDelete && selectedIds.length > 0) {
        await deleteShirtStyles(selectedIds).unwrap();
      } else if (deleteData?.shirtStyleId) {
        await deleteShirtStyles([deleteData.shirtStyleId]).unwrap();
      } else {
        return;
      }

      notify("ลบข้อมูลที่เลือกสำเร็จ!", "success");
      setSelectedIds([]);
      refetch();
    } catch (error) {
      notify("เกิดข้อผิดพลาดในการลบข้อมูล!", "error");
    } finally {
      setShowDeleteModal(false);
      setShowMultipleDelete(false);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch();
  };

  const handleAdd = () => {
    setShowAppModal(true);
    setShowEditModal(false);
    setSelectedData({
      shirtStyleId: "",
      name: "",
      description: "",
      price: "",
      shirtStyleImages: [{ imageUrl: "" }],
      sizes: [{ name: "" }],
      createdBy: user_id || "f430d4fd-3b38-4895-be8b-aca9e23c2229",
      updatedBy: user_id || "f430d4fd-3b38-4895-be8b-aca9e23c2229",
      createdAt: null,
      updatedAt: null,
    });
  };

  const handleEdit = (data: ShirtStyleData) => {
    const shirtStyleImages =
      data.shirtStyleImages?.map((img) => ({ imageUrl: img.imageUrl })) ?? [];
    const sizes = data.sizes?.map((s) => ({ name: s.name })) ?? [];

    setSelectedData({
      ...data,
      shirtStyleImages,
      sizes: sizes,
    });

    setShowAppModal(false);
    setShowEditModal(true);
  };

  const handleDelete = (data: ShirtStyleData) => {
    setDeleteData(data);
    setShowDeleteModal(true);
    setShowMultipleDelete(false);
  };

  const handleDeleteMultiple = () => {
    setShowDeleteModal(true);
    setShowMultipleDelete(true);
  };

  // const handleView = (data: ShirtStyleData) => {
  //   console.log(`View ShirtStyle ID: ${data.shirtStyleId}`);
  // };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage(null);
  };

  return (
    <Container
      maxWidth="xl"
      className="min-h-screen py-10"
      sx={{ backgroundColor: ThemeConfig.colors.backgroundMain }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="flex flex-col lg:flex-row justify-between mb-6 space-y-4 lg:space-y-0">
        <Typography
          variant="h5"
          className="font-bold"
          sx={{ color: ThemeConfig.colors.textPrimary }}
        >
          ระบบจัดการสไตล์เสื้อ
        </Typography>

        <Box className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
          <Box className="w-full lg:w-80">
            <Search onSearch={handleSearch} />
          </Box>
          <Box className="flex flex-wrap gap-2">
            <Button
              onClick={handleAdd}
              icon={<Plus className="w-4 h-4" />}
              label="เพิ่มสไตล์เสื้อ"
            />

            <Button
              onClick={refetch}
              icon={<RefreshCcw className="w-4 h-4" />}
              label="รีเฟรช"
              style={{
                backgroundColor: ThemeConfig.colors.accentGreen,
                color: ThemeConfig.colors.white,
              }}
            />

            <Button
              onClick={handleDeleteMultiple}
              icon={<Trash2 className="w-4 h-4" />}
              label="ลบที่เลือก"
              style={{
                backgroundColor: ThemeConfig.colors.secondary,
                color: ThemeConfig.colors.white,
              }}
              disabled={selectedIds.length === 0}
            />
          </Box>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        elevation={1}
        className="overflow-x-auto"
      >
        <table className="min-w-full bg-white">
          <TableHeader columns={ShirtStyleColumns} />
          <TableBody
            data={ShirtStylesData?.data || []}
            loading={isLoading}
            columns={ShirtStyleColumns}
            columnMapping={ShirtStyleColumnMapping}
            selectedIds={selectedIds}
            rowKey="shirtStyleId"
            onEdit={handleEdit}
            onDelete={handleDelete}
            // onView={handleView}
            handleSelect={handleSelect}
          />
        </table>
      </TableContainer>

      <TablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <GenericModal
        show={showAppModal || showEditModal}
        title={showAppModal ? "เพิ่มสไตล์เสื้อใหม่" : "แก้ไขข้อมูลสไตล์เสื้อ"}
        fields={
          showAppModal ? ShirtStyleFieldsForAdd : ShirtStyleFieldsForUpdate
        }
        validationSchema={
          showAppModal ? AddShirtStyleSchema : UpdateShirtStyleSchema
        }
        onSubmit={handleSubmit}
        initialValues={selectedData || {}}
        onClose={() => {
          setShowAppModal(false);
          setShowEditModal(false);
        }}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDeleteMultiple}
        message={
          showMultipleDelete
            ? "คุณต้องการลบที่เลือกทั้งหมดหรือไม่?"
            : "คุณต้องการลบนี้หรือไม่?"
        }
      />

      <NotificationModal
        show={showModal}
        onClose={handleCloseModal}
        message={modalMessage ?? ""}
        type={modalType}
      />
    </Container>
  );
};

export default ShirtStylePage;
