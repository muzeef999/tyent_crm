"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  IoPeopleOutline,
  IoBuildOutline,
  IoWalletOutline,
  IoPersonOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { MdOutlineLeaderboard } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "@/asserts/logo.png";
import { useAuth } from "@/hooks/useAuth"; // ✅ adjust the import path to your project

// ✅ Define which routes each role can access
const ROLE_ACCESS: Record<string, string[]> = {
  "Admin": ["*"],
  "Super Admin": ["*"],
  "Marketing Manager": ["/leads", "/"],
  "Technical Manager": ["/service", "/employee", "/customer"],
  "Telecall Manager": ["/customer"],
  "HR Executive": ["/employee"],
  "Customer Support": ["/customer"],
  "Accountant": ["/payment"],
  "Stock Clerk": ["/employee", "/stocks"],
  "Stock Manager": ["/employee", "/stocks"],
  "Technician": ["/employee/workspace"],
};

// ✅ Define navigation items for sidebar
interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Customer", icon: <IoPeopleOutline />, href: "/customer" },
  { label: "Leads", icon: <MdOutlineLeaderboard />, href: "/leads" },
  { label: "Employee", icon: <IoPersonOutline />, href: "/employee" },
  { label: "Service", icon: <IoBuildOutline />, href: "/service" },
  { label: "Stocks", icon: <AiOutlineStock />, href: "/stocks" },
  { label: "Payment", icon: <IoWalletOutline />, href: "/payment" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth(); // 👈 Get logged-in user info

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/me");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Error logging out. Please try again.");
    }
  };

  // ✅ Role-based access filtering
  const userRole = user?.designation || "";
  const accessPaths = ROLE_ACCESS[userRole] || [];

  const filteredNavItems =
    accessPaths.includes("*")
      ? navItems
      : navItems.filter((item) => item.href && accessPaths.includes(item.href));

  // ✅ Optional: No access message
  if (!filteredNavItems.length) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No access available for your role.
      </div>
    );
  }

  return (
    <div className="bg-white mt-2 flex flex-col justify-between h-screen transition-all duration-300 w-16 md:w-64 overflow-hidden space-y-6">
      {/* Logo */}
      <div>
        <div className="flex items-center justify-center m-4">
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>

        {/* Sidebar Items */}
        <ul className="space-y-4 mt-4 md:pl-6">
          {filteredNavItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li key={idx} className="group relative">
                <Link
                  href={item.href || "#"}
                  className={`flex items-center justify-between px-3 py-2 text-secondary transition-colors cursor-pointer 
                    ${isActive ? "bg-card-background rounded-l-xl" : "hover-bg"}`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <div
        onClick={handleLogout}
        className="mb-10 md:pl-6 flex items-center justify-between px-3 py-2 bg-white cursor-pointer hover:bg-card-background rounded-l-xl"
      >
        <span className="flex items-center gap-3">
          <IoLogOutOutline /> Log Out
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
