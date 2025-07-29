"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  BarChart2,
  LogOut,
  ShoppingBag,
  Shirt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { SD } from "@/configs";
import { logout } from "@/stores/slice/auth.slice";
import type { RootState } from "@/stores/store";

type Role = (typeof SD)[keyof typeof SD];

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
  roles?: Role[];
  public?: boolean;
  group?: string;
}

const MENU: MenuItem[] = [
  {
    label: "หน้าหลัก",
    icon: Home,
    path: "/home",
    public: true,
    group: "ทั่วไป",
  },
  {
    label: "แบบเสื้อผ้า",
    icon: Shirt,
    path: "/shirtstyle",
    public: true,
    group: "ทั่วไป",
  },
  {
    label: "รายงาน",
    icon: BarChart2,
    path: "/reports",
    roles: [SD.Admin, SD.Employee],
    group: "ทั่วไป",
  },
  {
    label: "ตั้งค่า",
    icon: Settings,
    path: "/settings",
    public: true,
    group: "ทั่วไป",
  },

  {
    label: "จัดการสาขา",
    icon: Users,
    path: "/admin/branch",
    roles: [SD.Admin],
    group: "การจัดการ",
  },
  {
    label: "จัดการไซต์",
    icon: Shirt,
    path: "/admin/shirtstyle",
    roles: [SD.Admin],
    group: "การจัดการ",
  },
  {
    label: "จัดการสินค้า",
    icon: ShoppingBag,
    path: "/admin/products",
    roles: [SD.Admin, SD.Employee],
    group: "การจัดการ",
  },
  {
    label: "ออกจากระบบ",
    icon: LogOut,
    path: "/logout",
    roles: [SD.Admin, SD.Employee, SD.User],
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(logout());
    router.push("/");
  };

  const items = MENU.filter((item) => {
    if (item.public) return true;
    if (!mounted) return false;
    if (!role) return false;
    return item.roles!.includes(role as Role);
  });

  const groups = items.reduce<Record<string, MenuItem[]>>((acc, cur) => {
    const g = cur.group ?? "_";
    (acc[g] ||= []).push(cur);
    return acc;
  }, {});

  return (
    <motion.aside
      className="bg-white shadow-lg h-full flex flex-col"
      animate={open ? { width: 200 } : { width: 80 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-5 mb-5 self-start"
      >
        {open ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <nav className="flex-1 overflow-y-auto">
        {Object.entries(groups).map(([group, list]) => (
          <div key={group} className="mb-4">
            {group !== "_" && open && (
              <div className="px-4 text-xs font-semibold text-gray-500 uppercase">
                {group}
              </div>
            )}
            {list.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.label === "ออกจากระบบ" ? "#" : item.path}
                  onClick={
                    item.label === "ออกจากระบบ" ? handleLogout : undefined
                  }
                  className={`
                    flex items-center px-4 py-2 mt-1 rounded-lg
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  title={!open ? item.label : undefined}
                >
                  <Icon size={20} />
                  {open && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
