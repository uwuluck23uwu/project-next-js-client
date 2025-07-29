"use client";

import { motion } from "framer-motion";
import { Typography, Box, Link, Stack } from "@mui/material";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  MapPin,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { ThemeConfig } from "@/configs";
import Logo from "@/../public/logos/Logo_message.svg";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

const Footer = () => {
  return (
    <footer
      className="py-12 font-sans"
      style={{
        borderTop: `1px solid ${ThemeConfig.colors.platinum}`,
        backgroundColor: ThemeConfig.colors.backgroundAlt,
      }}
    >
      <motion.div
        className="flex flex-wrap gap-12 justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="flex-1 min-w-[200px] flex flex-col items-center"
          variants={fadeInUp}
          custom={1}
        >
          <Box
            className="p-4 rounded-full shadow-lg mb-4"
            style={{ backgroundColor: ThemeConfig.colors.accentGold }}
          >
            <Image
              src={Logo}
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </Box>
          <Typography
            align="center"
            style={{ color: ThemeConfig.colors.textSecondary }}
          >
            บริษัท ทะเวนตี้นานาภัณฑ์ จำกัด
            <br />
            Twenty Nana Phan
          </Typography>
        </motion.div>

        <motion.div
          className="flex-1 min-w-[200px]"
          variants={fadeInUp}
          custom={2}
        >
          <Typography
            variant="h6"
            className="mb-4"
            style={{ color: ThemeConfig.colors.textPrimary }}
          >
            เมนู
          </Typography>
          <br />
          <Stack spacing={1}>
            <Link href="#" style={{ color: ThemeConfig.colors.textPrimary }}>
              หน้าแรก
            </Link>
            <Link href="#" style={{ color: ThemeConfig.colors.textPrimary }}>
              เกี่ยวกับเรา
            </Link>
            <Link href="#" style={{ color: ThemeConfig.colors.textPrimary }}>
              สถานะการสั่งซื้อ
            </Link>
          </Stack>
        </motion.div>

        <motion.div
          className="flex-1 min-w-[200px]"
          variants={fadeInUp}
          custom={3}
        >
          <Typography
            variant="h6"
            className="mb-4"
            style={{ color: ThemeConfig.colors.textPrimary }}
          >
            ติดต่อ
          </Typography>
          <br />
          <Stack spacing={1}>
            <Box className="flex items-center gap-2">
              <Phone size={18} stroke={ThemeConfig.colors.textPrimary} />
              <Typography style={{ color: ThemeConfig.colors.textPrimary }}>
                +66 2 123 4567
              </Typography>
            </Box>
            <Box className="flex items-center gap-2">
              <MapPin size={18} stroke={ThemeConfig.colors.textSecondary} />
              <Typography style={{ color: ThemeConfig.colors.textSecondary }}>
                ถนนวิภาวดีรังสิต, แขวงถนนนครไชยศรี
              </Typography>
            </Box>
            <Typography style={{ color: ThemeConfig.colors.textSecondary }}>
              เขตดุสิต, กรุงเทพมหานคร 10300
            </Typography>
            <Box className="flex items-center gap-2">
              <Mail size={18} stroke={ThemeConfig.colors.textPrimary} />
              <Typography style={{ color: ThemeConfig.colors.textPrimary }}>
                info@20nana.co.th
              </Typography>
            </Box>
          </Stack>
        </motion.div>

        <motion.div
          className="flex-1 min-w-[200px]"
          variants={fadeInUp}
          custom={4}
        >
          <Typography
            variant="h6"
            className="mb-4"
            style={{ color: ThemeConfig.colors.textPrimary }}
          >
            ติดตามเรา
          </Typography>
          <br />
          <Stack direction="row" spacing={2}>
            <Link
              href="https://www.facebook.com/AISeSports"
              aria-label="Facebook"
            >
              <Facebook size={30} color={ThemeConfig.colors.accentGold} />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram size={30} color={ThemeConfig.colors.accentGold} />
            </Link>
            <Link href="#" aria-label="YouTube">
              <Youtube size={30} color={ThemeConfig.colors.accentGold} />
            </Link>
          </Stack>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
