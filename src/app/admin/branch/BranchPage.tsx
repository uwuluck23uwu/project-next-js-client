"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCcw, Trash2 } from "lucide-react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TableContainer,
} from "@mui/material";
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
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchesMutation,
} from "@/stores/api/branch.api";
import {
  AddBranchSchema,
  UpdateBranchSchema,
} from "@/validations/branch.validation";

interface BranchData {
  branchId: string;
  name: string;
  address: string;
  contactInfo: string;
  orderStatus: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

const BranchPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<BranchData | null>(null);
  const [deleteData, setDeleteData] = useState<BranchData | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [showAppModal, setShowAppModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMultipleDelete, setShowMultipleDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranches] = useDeleteBranchesMutation();

  const {
    data: branchesData,
    isLoading,
    refetch,
  } = useGetBranchesQuery({
    pageSize: 10,
    currentPage,
    search: searchQuery,
  });

  const pagination = branchesData?.pagin || {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalRows: 0,
  };

  const branchColumnMapping = {
    รหัสสาขา: "branchId",
    ชื่อสาขา: "name",
    ที่อยู่: "address",
    ข้อมูลการติดต่อ: "contactInfo",
    สถานะการรับงาน: "orderStatus",
    วันที่สร้าง: "createdAt",
    วันที่แก้ไข: "updatedAt",
  };

  const branchColumns = Object.keys(branchColumnMapping);

  const branchFieldsForAdd = useGenerateFields(branchColumnMapping, [
    "ชื่อสาขา",
    "ที่อยู่",
    "ข้อมูลการติดต่อ",
  ]);

  const branchFieldsForUpdate = useGenerateFields(branchColumnMapping, [
    "ชื่อสาขา",
    "ที่อยู่",
    "ข้อมูลการติดต่อ",
    "สถานะการรับงาน",
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
      const payload = showEditModal
        ? { Branches: [values] }
        : { Branches: values.map((item: any) => ({ ...item })) };

      if (showEditModal && selectedData) {
        await updateBranch({
          BranchId: selectedData.branchId,
          ...payload.Branches[0],
        }).unwrap();
        notify("แก้ไขข้อมูลสำเร็จ!", "success");
      } else {
        await createBranch(payload).unwrap();
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
    if (!deleteData) return;
    try {
      showMultipleDelete
        ? await deleteBranches(selectedIds).unwrap()
        : await deleteBranches([deleteData.branchId]).unwrap();
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
      branchId: "",
      name: "",
      address: "",
      contactInfo: "",
      orderStatus: "InProgress",
      createdAt: null,
      updatedAt: null,
    });
  };

  const handleEdit = (data: BranchData) => {
    setShowAppModal(false);
    setShowEditModal(true);
    setSelectedData(data);
  };

  const handleDelete = (data: BranchData) => {
    setDeleteData(data);
    setShowDeleteModal(true);
    setShowMultipleDelete(false);
  };

  const handleDeleteMultiple = () => {
    setShowDeleteModal(true);
    setShowMultipleDelete(true);
  };

  const handleView = (data: BranchData) => {
    console.log(`View Branch ID: ${data.branchId}`);
  };

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
          ระบบจัดการสาขา
        </Typography>

        <Box className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
          <Box className="w-full lg:w-80">
            <Search onSearch={handleSearch} />
          </Box>
          <Box className="flex flex-wrap gap-2">
            <Button
              onClick={handleAdd}
              icon={<Plus className="w-4 h-4" />}
              label="เพิ่มสาขา"
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
          <TableHeader columns={branchColumns} />
          <TableBody
            data={branchesData?.data || []}
            loading={isLoading}
            columns={branchColumns}
            columnMapping={branchColumnMapping}
            selectedIds={selectedIds}
            rowKey="branchId"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
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
        title={showAppModal ? "เพิ่มสาขาใหม่" : "แก้ไขข้อมูลสาขา"}
        fields={showAppModal ? branchFieldsForAdd : branchFieldsForUpdate}
        validationSchema={showAppModal ? AddBranchSchema : UpdateBranchSchema}
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
            ? "คุณต้องการลบสาขาที่เลือกทั้งหมดหรือไม่?"
            : "คุณต้องการลบสาขานี้หรือไม่?"
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

export default BranchPage;
