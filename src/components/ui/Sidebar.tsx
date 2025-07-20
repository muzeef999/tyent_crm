"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IoColorPaletteOutline,
  IoNewspaperOutline,
  IoMegaphoneOutline,
  IoPersonAddOutline,
} from "react-icons/io5";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: "Customer", icon: <IoColorPaletteOutline />, href: "/customer" },
  { label: "Employee", icon: <IoNewspaperOutline />, href: "/employee" },
  { label: "Account", icon: <IoMegaphoneOutline />, href: "/account" },
  { label: "Payment", icon: <IoPersonAddOutline />, href: "/payment" },
  { label: "Service", icon: <IoPersonAddOutline />, href: "/service" },
  
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen pl-6 space-y-6 fixed overflow-y-auto ">
      <ul className="space-y-4 mt-4">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;

          return (
            <li key={idx} className="group relative">
              <Link
                href={item.href || "#"}
                className={`flex items-center justify-between px-3 py-2  text-secondary transition-colors cursor-pointer 
                  ${
                    isActive
                      ? "bg-card-background rounded-l-xl"
                      : "hover-bg"
                  }`}
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
  );
};

export default Sidebar;
