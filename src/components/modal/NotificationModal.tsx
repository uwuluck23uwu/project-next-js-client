"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components";
import { ThemeConfig } from "@/configs";
import successAnimation from "@/animations/success.json";
import errorAnimation from "@/animations/error.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

interface NotificationModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
};

const NotificationModal = ({
  show,
  onClose,
  message,
  type,
}: NotificationModalProps) => {
  if (!show) return null;

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

  const animationData = type === "success" ? successAnimation : errorAnimation;

  const colorMapping = {
    success: {
      background: "linear-gradient(135deg, #6dd5ed, #2193b0)",
      border: ThemeConfig.colors.primary,
      text: ThemeConfig.colors.white,
    },
    error: {
      background: "linear-gradient(135deg, #ff758c, #ff7eb3)",
      border: ThemeConfig.colors.primary,
      text: ThemeConfig.colors.white,
    },
  };

  const { background, border, text } = colorMapping[type];

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(5px)",
      }}
    >
      <motion.div
        className="w-[80%] max-w-md rounded-xl overflow-hidden shadow-2xl p-6"
        style={{
          background: background,
          borderColor: border,
        }}
        variants={modalVariant}
      >
        <motion.div className="flex flex-col items-center gap-2 mb-4">
          <Lottie
            loop={false}
            animationData={animationData}
            play
            style={{ width: 120, height: 120 }}
          />
          <h2 className="text-xl font-bold" style={{ color: text }}>
            {type === "success" ? "สำเร็จ!" : "เกิดข้อผิดพลาด!"}
          </h2>
        </motion.div>

        <p className="mb-6 text-center" style={{ color: text }}>
          {message}
        </p>

        <Button
          onClick={onClose}
          label="ปิด"
          className="w-full text-white rounded-lg mt-4 ripple"
          style={{
            backgroundColor: ThemeConfig.colors.backgroundMain,
            color: ThemeConfig.colors.textPrimary,
          }}
          hoverScale={1.05}
        />
      </motion.div>
    </motion.div>
  );
};

export default NotificationModal;
