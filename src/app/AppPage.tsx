"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components";
import { LoginModal, RegisterModal } from "@/components";
import { Container, Typography, Box } from "@mui/material";
import Logo from "@/../public/backgrounds/page_bg.png";

const AppPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <Box className="relative min-h-screen">
      <Image
        src={Logo}
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
        priority
      />
      <Box className="absolute inset-0 bg-black opacity-30 z-10" />

      <Container
        maxWidth="xl"
        className="relative z-20 flex flex-col items-start justify-center min-h-screen px-6 lg:px-32"
      >
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h1"
            component="h1"
            className="text-white font-bold text-5xl lg:text-7xl leading-tight"
          >
            ทะเวนตี้นานาภัณฑ์
            <br />
            ตัดเย็บชุดข้าราชการ
            <br />
            ด้วยความพิถีพิถัน
          </Typography>
        </motion.div>

        <motion.div
          className="mb-5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Typography
            variant="h5"
            className="text-white mb-8 max-w-3xl leading-relaxed"
          >
            ร้านตัดเสื้อข้าราชการ ทะเวนตี้นานาภัณฑ์
            มอบความมั่นใจและคุณภาพที่เหนือกว่าในทุกการสั่งตัด
          </Typography>
        </motion.div>

        <motion.div
          className="flex space-x-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <Button
            label="เข้าสู่ระบบ"
            onClick={() => setShowLoginModal(true)}
            className="text-2xl py-4 px-10 rounded-full shadow-xl"
            hoverScale={1.05}
          />
          <Button
            label="สมัครสมาชิก"
            onClick={() => setShowRegisterModal(true)}
            className="text-2xl py-4 px-10 rounded-full shadow-xl"
            hoverScale={1.05}
          />
        </motion.div>
      </Container>

      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitch={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitch={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </Box>
  );
};

export default AppPage;
