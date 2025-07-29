"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { ThemeConfig } from "@/configs";
import Logo from "@/../public/logos/Logo.svg";

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const logoAnimation = useAnimation();
  const textAnimation = useAnimation();
  const progressBarAnimation = useAnimation();

  useEffect(() => {
    let isMounted = true;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          textAnimation.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
          });
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const timeout = setTimeout(() => {
      if (!isMounted) return;

      logoAnimation.start({
        opacity: 1,
        scale: 1,
        rotate: 360,
        transition: { duration: 1, ease: "easeInOut" },
      });

      progressBarAnimation.start({
        opacity: 1,
        width: "100%",
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    }, 0);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [logoAnimation, textAnimation, progressBarAnimation]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: ThemeConfig.colors.backgroundMain,
        backgroundImage: "radial-gradient(#ffffff10 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        style={{
          background: `linear-gradient(180deg, ${ThemeConfig.colors.secondary}, ${ThemeConfig.colors.primary})`,
        }}
        initial={{ height: 0 }}
        animate={{ height: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute w-full h-full opacity-20"
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      <motion.div
        className="w-64 h-64 mb-6 flex items-center justify-center rounded-full shadow-md relative z-10"
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={logoAnimation}
        style={{ backgroundColor: ThemeConfig.colors.white }}
      >
        <Image src={Logo} alt="Logo" width={200} height={200} />
      </motion.div>

      <motion.div
        className="relative w-20 h-20 flex items-center justify-center z-20 mt-4"
        initial={{ opacity: 0 }}
        animate={progressBarAnimation}
      >
        <CircularProgress
          variant="determinate"
          value={progress}
          size={80}
          thickness={5}
          sx={{
            color: ThemeConfig.colors.white,
          }}
        />

        <motion.div
          className="mt-2 absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: ThemeConfig.colors.white,
              fontWeight: "bold",
            }}
          >
            {progress}%
          </Typography>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loader;
