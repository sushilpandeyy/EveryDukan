"use client";

// components/layout/sidebar.tsx

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Store,
  LayoutDashboard,
  House,
  GalleryVertical,
  ChevronLeft,
  Menu,
  ShoppingCart,
  ChartColumnStacked,
  TicketPercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isCollapsed: boolean;
}

const SidebarLink = ({ href, icon, title, isCollapsed }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-4",
          isActive && "bg-primary/10 text-primary",
          isCollapsed && "justify-center px-2"
        )}
      >
        {icon}
        {!isCollapsed && <span>{title}</span>}
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: "Dashboard",
    },
    {
      href: "/dashboard/banners",
      icon: <GalleryVertical className="h-5 w-5" />,
      title: "Banners",
    },
    {
      href: "/dashboard/components",
      icon: <House className="h-5 w-5" />,
      title: "Home",
    },
    {
      href: "/dashboard/shop",
      icon: <Store className="h-5 w-5" />,
      title: "Shops",
    },
    {
      href: "/dashboard/category",
      icon: <ChartColumnStacked className="h-5 w-5" />,
      title: "Categories",
    },
    {
      href: "/dashboard/deal",
      icon: <ShoppingCart className="h-5 w-5" />,
      title: "Deals",
    },
    {
      href: "/dashboard/coupon",
      icon: <TicketPercent className="h-5 w-5" />,
      title: "Coupons",
    },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Shop Admin</h2>
            </div>
            <nav className="flex-1 space-y-2 p-4">
              {navigationItems.map((item) => (
                <SidebarLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  title={item.title}
                  isCollapsed={false}
                />
              ))}
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col border-r transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className={cn(
          "flex h-16 items-center border-b px-6",
          isCollapsed && "justify-center px-4"
        )}>
          {!isCollapsed && <h2 className="text-lg font-semibold">Shop Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto", !isCollapsed && "absolute right-4")}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={cn(
              "h-6 w-6 transition-transform",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navigationItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="border-t p-4">
          <div className={cn(
            "flex items-center gap-4",
            isCollapsed && "justify-center"
          )}>
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
