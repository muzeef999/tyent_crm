"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineLeaderboard } from "react-icons/md";
import logo from "@/asserts/logo.png";
import { AiOutlineStock } from "react-icons/ai";
import { TbAutomation } from "react-icons/tb";
import { IoLogOutOutline } from "react-icons/io5";


import {
  IoPeopleOutline,
  IoBuildOutline,
  IoWalletOutline,
  IoPersonOutline,
} from "react-icons/io5";
import Image from "next/image";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  // Core data
  { label: "Customer", icon: <IoPeopleOutline />, href: "/customer" },
  { label: "Leads", icon: <MdOutlineLeaderboard />, href: "/leads" },
  { label: "Employee", icon: <IoPersonOutline />, href: "/employee" },

  // Operations
  { label: "Service", icon: <IoBuildOutline />, href: "/service" },
  { label: "Stocks", icon: <AiOutlineStock />, href: "/stocks" },
  { label: "Payment", icon: <IoWalletOutline />, href: "/payment" },

  // Automation & Settings
  { label: "Automations", icon: <TbAutomation />, href: "/automations" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white mt-2 flex flex-col justify-between  h-screen transition-all duration-300  w-16  md:w-64 md:pl-6  overflow-hidden  space-y-6 ">
      <div>
        <div className="flex items-center  justify-center">
          <Image
            src={logo}
            alt="logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>

        <ul className="space-y-4 mt-4">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;

            return (
              <li key={idx} className="group relative">
                <Link
                  href={item.href || "#"}
                  className={`flex items-center justify-between px-3 py-2  text-secondary transition-colors cursor-pointer 
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

      <div
        onClick={() => {
          console.log("logout");
        }}
        className={`flex items-center justify-between px-3 py-2  bg-white   cursor-pointer hover:bg-card-background rounded-l-xl`}
      >
        <span className="flex items-center gap-3"><IoLogOutOutline />Log Out</span>
      </div>
    </div>
  );
};

export default Sidebar;
