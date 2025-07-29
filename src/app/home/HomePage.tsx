"use client";

import Image from "next/image";
import { Box, Typography, Container } from "@mui/material";
import Logo from "@/../public/backgrounds/home_page_bg.png";
import { motion } from "framer-motion";
import { FromItem, Header } from "@/components";
import { useGetShirtStylesQuery } from "@/stores/api/shirtstyle.api";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const HomePage = () => {
  const { data, isLoading, isError } = useGetShirtStylesQuery({
    pageSize: 10,
    currentPage: 1,
  });

  return (
    <Box>
      <Box className="relative min-h-screen flex flex-col items-center justify-center text-center bg-white overflow-hidden">
        <Image
          src={Logo}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />

        <Box className="absolute top-0 left-0 w-full z-10 pt-6 px-4">
          <Container maxWidth="md">
            <motion.div
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
              variants={textVariants}
              custom={1}
            >
              <Typography
                variant="h4"
                className="text-textSecondary"
                sx={{ fontWeight: 500 }}
              >
                บริษัททะเวนตี้นานาภัณฑ์ เขตดุสิต
              </Typography>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
              variants={textVariants}
              custom={2}
            >
              <Typography
                variant="h2"
                className="text-textPrimary"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                สั่งตัดชุดข้าราชการ
              </Typography>
            </motion.div>
          </Container>
        </Box>
      </Box>

      <Header />
      <FromItem data={data} isLoading={isLoading} isError={isError} />
    </Box>
  );
};

export default HomePage;
