"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IoPeopleOutline,
  IoBuildOutline,
  IoSettingsOutline,
  IoWalletOutline,
  IoPersonOutline,
} from "react-icons/io5";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: "Customer", icon: <IoPeopleOutline />, href: "/customer" },
  { label: "Service", icon: <IoBuildOutline />, href: "/service" },
  { label: "Account", icon: <IoSettingsOutline />, href: "/account" },
  { label: "Payment", icon: <IoWalletOutline />, href: "/payment" },
  { label: "Employee", icon: <IoPersonOutline />, href: "/employee" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen mt-12 pl-6 space-y-6 fixed overflow-y-auto ">
      

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
  );
};

export default Sidebar;
