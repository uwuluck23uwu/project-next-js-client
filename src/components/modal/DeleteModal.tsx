"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components";
import { ThemeConfig } from "@/configs";
import deleteAnimation from "@/animations/delete.json";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

interface DeleteModalProps {
  show: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteModal = ({
  show,
  message,
  onClose,
  onConfirm,
}: DeleteModalProps) => {
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
          background: "linear-gradient(135deg, #6dd5ed, #2193b0)",
          border: ThemeConfig.colors.primary,
        }}
        variants={modalVariant}
      >
        <motion.div className="flex flex-col items-center gap-2 mb-4">
          <Lottie
            loop={false}
            animationData={deleteAnimation}
            play
            style={{ width: 120, height: 120 }}
          />
          <h2 className="text-xl font-bold text-white">ยืนยันการลบข้อมูล</h2>
        </motion.div>

        <p className="mb-6 text-center text-white">{message}</p>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            label="ยกเลิก"
            className="w-full text-white rounded-lg mt-4 ripple"
            style={{
              backgroundColor: ThemeConfig.colors.backgroundMain,
              color: ThemeConfig.colors.textPrimary,
            }}
            hoverScale={1.05}
          />

          <Button
            onClick={onConfirm}
            label="ยืนยัน"
            className="w-full text-white rounded-lg mt-4 ripple"
            style={{
              backgroundColor: ThemeConfig.colors.primary,
              color: ThemeConfig.colors.white,
            }}
            hoverScale={1.05}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteModal;
