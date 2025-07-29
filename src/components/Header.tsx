"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { User, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { RootState } from "@/stores/store";
import { ThemeConfig } from "@/configs";
import { Button, Search } from "@/components";
import Logo from "@/../public/logos/Logo.svg";
import { Box } from "@mui/material";

const navLinks = [
  { href: "/home", label: "หน้าหลัก" },
  { href: "/order", label: "สั่งตัดชุด" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อเรา" },
];

const Header = () => {
  const router = useRouter();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full shadow-sm border-b sticky top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: ThemeConfig.colors.backgroundAlt }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-y-4">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/home")}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Box
            className="p-4 rounded-full shadow-lg"
            style={{ backgroundColor: ThemeConfig.colors.accentGold }}
          >
            <Image src={Logo} alt="โลโก้ราชพัสตร์" width={44} height={44} />
          </Box>
          <span
            className="text-2xl font-semibold"
            style={{ color: ThemeConfig.colors.primary }}
          >
            ทะเวนตี้นานาภัณฑ์
          </span>
        </motion.div>
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-8 text-base font-medium tracking-wide">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                href={link.href}
                style={{ color: ThemeConfig.colors.textPrimary }}
                className="hover:underline transition-colors duration-200"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = ThemeConfig.colors.accentGold)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = ThemeConfig.colors.textPrimary)
                }
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <div className="hidden md:flex">
            <Search onSearch={(query) => console.log("Search query:", query)} />
          </div>

          {!accessToken && (
            <>
              <Button
                icon={<User size={20} />}
                label="เข้าสู่ระบบ"
                style={{
                  borderColor: ThemeConfig.colors.accentGold,
                  color: ThemeConfig.colors.white,
                  padding: "10px 16px",
                  fontSize: "0.95rem",
                }}
                className="text-sm font-medium hover:opacity-90 transition-opacity duration-200"
                onClick={() => router.push("/")}
                hoverScale={1.05}
              />
              <Button
                icon={<Pencil size={20} />}
                label="สมัครสมาชิก"
                style={{
                  backgroundColor: ThemeConfig.colors.primary,
                  color: ThemeConfig.colors.white,
                  padding: "10px 16px",
                  fontSize: "0.95rem",
                }}
                onClick={() => router.push("/")}
                hoverScale={1.05}
              />
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
