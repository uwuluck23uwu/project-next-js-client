"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { Dialog, Typography } from "@mui/material";
import { FileText, Paperclip, Trash2 } from "lucide-react";
import Lottie from "react-lottie-player";
import { RootState } from "@/stores/store";
import { useContext } from "@/contexts";
import { ThemeConfig } from "@/configs";
import { OrderSchema } from "@/validations/order.validation";
import { Button, Input, NotificationModal, Loader } from "@/components";
import { useCreateOrderMutation } from "@/stores/api/order.api";
import { useGetShirtStyleByIdQuery } from "@/stores/api/shirtstyle.api";
import document from "@/animations/document.json";

const BASE_URL = process.env.BASE_URL;

const OrderPage = () => {
  const router = useRouter();
  const { id } = useContext();
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [orderFile, setOrderFile] = useState<File | null>(null);
  const [useFileUpload, setUseFileUpload] = useState<boolean>(false);
  const [createOrder] = useCreateOrderMutation();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">(
    "success"
  );

  const { user_id } = useSelector((state: RootState) => state.auth);

  const { data: response, isLoading } = useGetShirtStyleByIdQuery(id ?? "", {
    skip: !id,
  });

  useEffect(() => {
    if (!id) {
      router.replace("/home");
    }
  }, [id, router]);

  const shirtData = response?.data;
  const { primary, backgroundMain, white, textPrimary, platinum } =
    ThemeConfig.colors;

  const imageUrl = shirtData?.shirtStyleImages?.[0]?.imageUrl;

  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    size: "",
    chest: "",
    waist: "",
    length: "",
    detail: "",
  };

  const handleFormSubmit = async (values: any, { resetForm }: any) => {
    try {
      const formData = handleSubmit({
        values,
        orderFile,
        shirtStyleId: Array.isArray(shirtData?.shirtStyleId)
          ? shirtData.shirtStyleId
          : [shirtData?.shirtStyleId], // แปลงให้เป็น array ถ้ายังไม่ใช่
      });

      await createOrder(formData).unwrap();

      setNotificationMessage("ส่งคำสั่งตัดชุดสำเร็จ");
      setNotificationType("success");
      setShowNotification(true);

      resetForm();
      setOrderFile(null);
    } catch (err) {
      console.error("Error:", err);
      setNotificationMessage("เกิดข้อผิดพลาดในการส่งคำสั่ง");
      setNotificationType("error");
      setShowNotification(true);
    }
  };

  const handleSubmit = ({
    values,
    orderFile,
    shirtStyleId,
  }: {
    values: any;
    orderFile: File | null;
    shirtStyleId: string[];
  }) => {
    const formData = new FormData();
    const price = [200];

    formData.append("UserId", user_id || "");
    formData.append("OrderType", useFileUpload ? "file" : "manual");
    formData.append("PaymentStatus", "pending");
    formData.append("CreatedBy", user_id || "");

    shirtStyleId.forEach((item) => formData.append("ShirtStyleId", item));
    price.forEach((p) => formData.append("Price", p.toString()));

    if (orderFile) {
      formData.append("OrderDocument", orderFile);
    }

    if (!useFileUpload) {
      const customer = {
        Title: values.title,
        FirstName: values.firstName,
        LastName: values.lastName,
        Position: "ตำแหน่ง",
      };

      const measurement = {
        UserId: user_id,
        Sizes: values.size,
        Chest: parseFloat(values.chest || "0"),
        Waist: parseFloat(values.waist || "0"),
        Length: parseFloat(values.length || "0"),
        Detail: values.detail,
      };

      formData.append("Customer", JSON.stringify(customer));
      formData.append("Measurement", JSON.stringify(measurement));
    }

    return formData;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      style={{ backgroundColor: backgroundMain }}
      className="p-6 md:p-10 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={!useFileUpload ? OrderSchema : null}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div
              className="shadow-lg rounded-xl px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12"
              style={{ backgroundColor: white }}
            >
              {/* ซ้าย */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-4"
                >
                  <Typography
                    variant="h4"
                    className="font-extrabold text-3xl tracking-tight"
                    style={{ color: textPrimary }}
                  >
                    สั่งตัดเสื้อข้าราชการ
                  </Typography>

                  {/* ข้อความแนะนำการกรอก */}
                  <div
                    className="p-4 rounded-md"
                    style={{
                      backgroundColor: ThemeConfig.colors.backgroundAlt,
                      borderLeft: `5px solid ${ThemeConfig.colors.accentGold}`,
                    }}
                  >
                    <Typography
                      className="text-base md:text-lg"
                      style={{ color: ThemeConfig.colors.textSecondary }}
                    >
                      กรุณาเลือกวิธีการกรอกข้อมูลสำหรับการสั่งตัดชุด:
                      <br />
                      <strong style={{ color: ThemeConfig.colors.accentGold }}>
                        1. กรอกข้อมูลด้วยตนเอง
                      </strong>{" "}
                      — ทางด้านซ้ายของหน้านี้
                      <br />
                      <strong style={{ color: ThemeConfig.colors.accentGold }}>
                        2. แนบไฟล์ Excel
                      </strong>{" "}
                      — ทางด้านขวา (ระบบจะใช้ข้อมูลจากไฟล์แทนแบบฟอร์ม)
                    </Typography>
                  </div>
                </motion.div>

                {/* เหมือนเดิม: เงื่อนไข useFileUpload */}
                {useFileUpload && orderFile ? (
                  <motion.div
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col items-center gap-6 w-full"
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
                    >
                      <Lottie
                        play
                        loop
                        animationData={document}
                        style={{ width: 300, height: 300 }}
                      />
                    </motion.div>

                    <Typography className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                      <span className="inline-flex items-center gap-1">
                        <Paperclip size={20} />
                        ไฟล์คำสั่งที่แนบ
                      </span>
                    </Typography>

                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="text-gray-700 truncate text-base flex items-center gap-2">
                        <FileText size={20} />
                        {orderFile.name}
                      </span>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          setOrderFile(null);
                          setUseFileUpload(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 text-sm rounded-md shadow inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        ลบไฟล์
                      </motion.button>
                    </div>

                    <p className="text-sm text-gray-500 border-t pt-2 border-dashed border-gray-300 w-full text-center">
                      ระบบจะใช้ข้อมูลจากไฟล์นี้ แทนการกรอกแบบฟอร์มด้านล่าง
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <Typography
                        className="text-lg font-semibold mb-2"
                        style={{ color: textPrimary }}
                      >
                        กรอกข้อมูลผู้สั่งตัด
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          type="text"
                          name="title"
                          placeholder="คำนำหน้า"
                          errors={errors}
                          touched={touched}
                        />
                        <Input
                          type="text"
                          name="firstName"
                          placeholder="ชื่อ"
                          errors={errors}
                          touched={touched}
                        />
                        <Input
                          type="text"
                          name="lastName"
                          placeholder="นามสกุล"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>

                    <div>
                      <Typography
                        className="text-lg font-semibold mb-2"
                        style={{ color: textPrimary }}
                      >
                        กรอกขนาดตัว (เซนติเมตร)
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="text"
                          name="size"
                          placeholder="ขนาด"
                          errors={errors}
                          touched={touched}
                        />
                        <Input
                          type="text"
                          name="chest"
                          placeholder="รอบอก"
                          errors={errors}
                          touched={touched}
                        />
                        <Input
                          type="text"
                          name="waist"
                          placeholder="รอบเอว"
                          errors={errors}
                          touched={touched}
                        />
                        <Input
                          type="text"
                          name="length"
                          placeholder="ความยาวลำตัว"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="mt-4">
                        <Input
                          type="textarea"
                          name="detail"
                          placeholder="รายละเอียดเพิ่มเติม"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* ขวา */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="w-full flex justify-center">
                  {imageUrl ? (
                    <motion.img
                      src={`${BASE_URL}${imageUrl}`}
                      alt="uniform"
                      onClick={() => setOpenImage(`${BASE_URL}${imageUrl}`)}
                      className="rounded-xl shadow-lg cursor-zoom-in object-cover"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "520px",
                        height: "auto",
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="text-red-500">ไม่พบรูปภาพ</div>
                  )}
                </div>

                <Typography
                  variant="h5"
                  className="font-semibold text-xl"
                  style={{ color: textPrimary }}
                >
                  {shirtData.name || "ชื่อชุดไม่ระบุ"}
                </Typography>

                <div className="mt-4">
                  <Typography
                    className="text-base font-medium mb-2"
                    style={{ color: ThemeConfig.colors.textSecondary }}
                  >
                    หรือแนบไฟล์คำสั่งตัดชุด
                  </Typography>
                  <input
                    type="file"
                    accept=".xlsx"
                    className="w-full border rounded px-3 py-2 mb-2"
                    style={{ borderColor: platinum }}
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0] || null;
                      setOrderFile(file);
                      setUseFileUpload(!!file);
                    }}
                  />
                  <Typography
                    className="text-sm"
                    style={{ color: ThemeConfig.colors.textSecondary }}
                  >
                    * รองรับเฉพาะไฟล์ Excel (.xlsx)
                  </Typography>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                type="submit"
                label="ส่งคำสั่งตัดชุด"
                className="px-12 py-3 text-lg font-bold rounded-lg text-white"
                style={{ backgroundColor: primary }}
                hoverScale={1.07}
              />
            </div>
          </Form>
        )}
      </Formik>

      <Dialog
        open={!!openImage}
        onClose={() => setOpenImage(null)}
        maxWidth="xl"
      >
        {openImage?.trim() && (
          <img
            src={openImage}
            alt="preview"
            className="w-full h-full object-contain"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
          />
        )}
      </Dialog>

      <NotificationModal
        show={showNotification}
        onClose={() => setShowNotification(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </motion.div>
  );
};

export default OrderPage;
