"use client";

import { motion } from "framer-motion";

interface ButtonProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: React.CSSProperties;
  hoverScale?: number;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
};

const Button = ({
  onClick,
  icon,
  label,
  type = "button",
  className = "",
  style = {},
  hoverScale = 1.05,
  disabled = false,
  loading = false,
  loadingText = "กำลังบันทึก...",
}: ButtonProps) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`font-bold py-2 px-4 rounded flex items-center justify-center space-x-1 ${className}`}
      style={style}
      whileHover={{ scale: hoverScale }}
    >
      {icon}
      {loading ? <span>{loadingText}</span> : label && <span>{label}</span>}
    </motion.button>
  );
};

export default Button;
