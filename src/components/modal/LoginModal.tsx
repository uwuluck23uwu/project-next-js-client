"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Search, Facebook, Twitter } from "lucide-react";
import Image from "next/image";
import { ThemeConfig } from "@/configs";
import { setCredentials } from "@/stores/slice/auth.slice";
import { useLoginMutation } from "@/stores/api/authen.api";
import { decodeAccessToken } from "@/configs";
import { Button, Input, NotificationModal } from "@/components";
import Logo from "@/../public/logos/Logo_message.svg";
import LoginSchema from "@/validations/login.validation";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

const LoginModal = ({ show, onClose, onSwitch }: LoginModalProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [notif, setNotif] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });
  const [login] = useLoginMutation();

  if (!show) return null;

  const initialValues = {
    identifier: "",
    password: "",
    keepLoggedIn: false,
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogin = async (values: typeof initialValues) => {
    try {
      const result = await login({
        identifier: values.identifier,
        password: values.password,
      }).unwrap();

      const decoded = decodeAccessToken(result.data.accessToken);
      if (!decoded) throw new Error("โทเค็นไม่ถูกต้อง");

      dispatch(
        setCredentials({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
          role: decoded.role,
          user_id: decoded.sub,
          branch_id: decoded.branch_id,
          username: decoded.unique_name,
          image_url: decoded.image_url,
          email: decoded.email,
          phone: decoded.phone,
        })
      );

      setNotif({
        show: true,
        type: "success",
        message: "เข้าสู่ระบบสำเร็จ",
      });

      setTimeout(() => {
        setNotif((prev) => ({ ...prev, show: false }));
        router.push("/home");
      }, 500);
    } catch (err: any) {
      console.error("Login failed:", err);

      const msg =
        err?.data?.message ||
        "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมล/รหัสผ่านอีกครั้ง";
      setNotif({
        show: true,
        type: "error",
        message: msg,
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
        className="w-[80%] h-[60%] max-w-6xl rounded-lg overflow-hidden shadow-lg flex"
        style={{
          backgroundColor: ThemeConfig.colors.backgroundAlt,
        }}
        variants={modalVariant}
      >
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
            ยังไม่ได้เป็นสมาชิกใช่ไหม?{" "}
            <span
              className="text-accentGold hover:underline cursor-pointer"
              style={{
                color: ThemeConfig.colors.accentGold,
              }}
              onClick={onSwitch}
            >
              สมัครสมาชิกที่นี่
            </span>
          </p>
        </div>

        <div className="w-1/2 p-8 overflow-y-auto max-h-[80vh]">
          <h2
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: ThemeConfig.colors.textPrimary }}
          >
            เข้าสู่ระบบ
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Input
                  type="text"
                  name="identifier"
                  placeholder="อีเมล หรือ ชื่อผู้ใช้งาน"
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

                <div className="mb-4 flex items-center">
                  <Field
                    type="checkbox"
                    name="keepLoggedIn"
                    id="keepLoggedIn"
                    className="mr-2"
                    style={{ accentColor: ThemeConfig.colors.primary }}
                  />
                  <label
                    htmlFor="keepLoggedIn"
                    style={{ color: ThemeConfig.colors.textSecondary }}
                  >
                    จดจำการเข้าสู่ระบบ
                  </label>
                </div>

                <Button
                  type="submit"
                  label="เข้าสู่ระบบ"
                  className="w-full mb-4"
                  style={{
                    backgroundColor: ThemeConfig.colors.accentGold,
                    color: ThemeConfig.colors.white,
                  }}
                  hoverScale={1.05}
                />
              </Form>
            )}
          </Formik>

          <div className="text-right mb-4">
            <a
              href="/forgot-password"
              className="text-sm hover:underline"
              style={{
                color: ThemeConfig.colors.accentGold,
              }}
            >
              ลืมรหัสผ่าน?
            </a>
          </div>

          <div className="flex my-4">
            <span className="text-gray-500">หรือ เข้าสู่ระบบด้วย</span>
          </div>

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
        show={notif.show}
        type={notif.type}
        message={notif.message}
        onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
      />
    </motion.div>
  );
};

export default LoginModal;
