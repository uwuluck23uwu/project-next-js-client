"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { Search, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import { ThemeConfig } from "@/configs";
import { setCredentials } from "@/stores/slice/auth.slice";
import { decodeAccessToken } from "@/configs";
import { useRegisterMutation } from "@/stores/api/authen.api";
import { Button, Input, NotificationModal } from "@/components";
import RegisterSchema from "@/validations/register.validation";
import Logo from "@/../public/logos/Logo_message.svg";

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

const RegisterModal = ({ show, onClose, onSwitch }: RegisterModalProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  if (!show) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegister = async (values: any) => {
    try {
      const response = await register(values).unwrap();
      
      const decoded = decodeAccessToken(response.data.accessToken);
      if (!decoded) throw new Error("Invalid token");

      console.log("Login successful:", JSON.stringify(decoded, null, 2));

      dispatch(
        setCredentials({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          role: decoded.role,
          user_id: decoded.sub,
          branch_id: decoded.branch_id,
          username: decoded.unique_name,
          image_url: decoded.image_url,
          email: decoded.email,
          phone: decoded.phone,
        })
      );

      setNotification({
        show: true,
        message: "สมัครสมาชิกสำเร็จ!",
        type: "success",
      });

      setTimeout(() => {
        router.push("/home");
      }, 500);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      setNotification({
        show: true,
        message: "สมัครสมาชิกไม่สำเร็จ, กรุณาลองใหม่!",
        type: "error",
      });
    }
  };

  const modalVariant = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(3px)",
      }}
    >
      <motion.div
        className="w-[80%] h-[80%] max-w-6xl rounded-lg overflow-hidden shadow-lg flex"
        style={{
          backgroundColor: ThemeConfig.colors.backgroundAlt,
        }}
        variants={modalVariant}
      >
        {/* Left Side */}
        <div
          className="w-1/2 flex flex-col items-center justify-center p-8"
          style={{
            backgroundColor: ThemeConfig.colors.primary,
            color: ThemeConfig.colors.white,
          }}
        >
          <h1 className="text-2xl font-bold mb-6">ยินดีต้อนรับ</h1>
          <div
            className="w-48 h-48 mb-6 flex items-center justify-center rounded-full shadow-lg"
            style={{
              backgroundColor: ThemeConfig.colors.accentGold,
            }}
          >
            <Image
              src={Logo}
              alt="Logo"
              width={192}
              height={192}
              className="object-contain"
            />
          </div>
          <p className="text-sm">
            เป็นสมาชิกอยู่แล้วใช่ไหม?{" "}
            <span
              className="text-accentGold hover:underline cursor-pointer"
              style={{
                color: ThemeConfig.colors.accentGold,
              }}
              onClick={onSwitch}
            >
              เข้าสู่ระบบที่นี่
            </span>
          </p>
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-8 overflow-y-auto max-h-[80vh]">
          <h2
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: ThemeConfig.colors.textPrimary }}
          >
            ลงทะเบียน
          </h2>
          <Formik
            initialValues={{
              branchId: "",
              name: "",
              email: "",
              phone: "",
              password: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <Input
                  type="text"
                  name="branchId"
                  placeholder="รหัสสาขา"
                  errors={errors}
                  touched={touched}
                />

                <Input
                  type="text"
                  name="name"
                  placeholder="ชื่อ - นามสกุล"
                  errors={errors}
                  touched={touched}
                />

                <Input
                  type="email"
                  name="email"
                  placeholder="อีเมล"
                  errors={errors}
                  touched={touched}
                />

                <Input
                  type="text"
                  name="phone"
                  placeholder="เบอร์โทรศัพท์"
                  errors={errors}
                  touched={touched}
                />

                <Input
                  type="password"
                  name="password"
                  placeholder="รหัสผ่าน"
                  errors={errors}
                  touched={touched}
                />

                <Button
                  type="submit"
                  label={isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
                  className="w-full mb-4"
                  disabled={isLoading}
                  style={{
                    backgroundColor: ThemeConfig.colors.accentGold,
                    color: ThemeConfig.colors.white,
                  }}
                  hoverScale={1.05}
                />
              </Form>
            )}
          </Formik>

          {/* Divider */}
          <div className="flex my-4">
            <span className="text-gray-500">หรือ ลงทะเบียน</span>
          </div>

          {/* Social Buttons */}
          <div className="flex space-x-4 justify-center mt-4">
            <Button
              icon={<Search size={20} />}
              label="Google"
              className="w-1/3"
              style={{
                backgroundColor: ThemeConfig.colors.primary,
                color: ThemeConfig.colors.white,
              }}
            />
            <Button
              icon={<Facebook size={20} />}
              label="Facebook"
              className="w-1/3"
              style={{
                backgroundColor: ThemeConfig.colors.primary,
                color: ThemeConfig.colors.white,
              }}
            />
            <Button
              icon={<Twitter size={20} />}
              label="Twitter"
              className="w-1/3"
              style={{
                backgroundColor: ThemeConfig.colors.primary,
                color: ThemeConfig.colors.white,
              }}
            />
          </div>
        </div>
      </motion.div>

      <NotificationModal
        show={notification.show}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        message={notification.message}
        type={notification.type as "success" | "error"}
      />
    </motion.div>
  );
};

export default RegisterModal;
