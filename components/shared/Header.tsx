"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Home,
  QrCode,
  Package,
  BarChart3,
  Settings,
} from "lucide-react";

type NormalizedRole = "student" | "dining-staff" | "facilities" | "admin";

interface HeaderProps {
  showRoleSwitcher?: boolean;
  currentRole?: string;
}

export function Header({ showRoleSwitcher = true, currentRole: propRole }: HeaderProps) {
  const normalizeRole = (role: string | undefined): "student" | "dining-staff" | "facilities" | "admin" => {
    if (!role) return "student";
    const normalized = role.toLowerCase().replace("_", "-");
    if (normalized === "dining-staff" || normalized === "dining_staff") return "dining-staff";
    if (normalized === "facilities") return "facilities";
    if (normalized === "admin") return "admin";
    return "student";
  };

  const [currentRole, setCurrentRole] = useState<"student" | "dining-staff" | "facilities" | "admin">(normalizeRole(propRole));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [shiftKeyHeld, setShiftKeyHeld] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (propRole) {
      setCurrentRole(normalizeRole(propRole));
    } else {
      const savedRole = localStorage.getItem("dukeReuse360Role");
      if (savedRole) {
        setCurrentRole(normalizeRole(savedRole));
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftKeyHeld(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setShiftKeyHeld(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleRoleChange = (role: string) => {
    const normalized = normalizeRole(role);
    setCurrentRole(normalized);
    localStorage.setItem("dukeReuse360Role", normalized);

    // Navigate to the appropriate dashboard
    switch (role) {
      case "student":
        router.push("/student/dashboard");
        break;
      case "dining-staff":
        router.push("/dining-staff/dashboard");
        break;
      case "facilities":
        router.push("/facilities/dashboard");
        break;
      case "admin":
        router.push("/admin");
        break;
    }
  };

  const handleLogoClick = () => {
    setLogoClickCount((prev) => prev + 1);

    setTimeout(() => {
      setLogoClickCount(0);
    }, 2000);

    // Triple-click opens demo panel
    if (logoClickCount >= 2) {
      router.push("/demo/qr-codes");
      setLogoClickCount(0);
    }

    // Shift + 5 clicks opens dev panel
    if (shiftKeyHeld && logoClickCount >= 4) {
      router.push("/demo/qr-codes?dev=true");
      setLogoClickCount(0);
    }
  };

  const roleLabels: Record<NormalizedRole, string> = {
    student: "Student",
    "dining-staff": "Dining Staff",
    facilities: "Facilities",
    admin: "Admin",
  };

  const getNavLinks = () => {
    switch (currentRole) {
      case "student":
        return [
          { href: "/student/dashboard", label: "Dashboard", icon: Home },
          { href: "/student/scan", label: "Scan", icon: QrCode },
        ];
      case "dining-staff":
        return [
          { href: "/dining-staff/dashboard", label: "Dashboard", icon: Home },
          { href: "/dining-staff/inventory", label: "Inventory", icon: Package },
          { href: "/dining-staff/analytics", label: "Analytics", icon: BarChart3 },
        ];
      case "facilities":
        return [
          { href: "/facilities/dashboard", label: "Dashboard", icon: Home },
          { href: "/facilities/containers", label: "Containers", icon: Package },
          { href: "/facilities/rfid-tags", label: "RFID Tags", icon: QrCode },
        ];
      case "admin":
        return [
          { href: "/admin", label: "Dashboard", icon: Home },
          { href: "/admin/users", label: "Users", icon: User },
          { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ];
      default:
        return [];
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#012169] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer select-none"
            onClick={handleLogoClick}
          >
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-[#012169] font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">DukeReuse360</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[#003366] text-white"
                      : "text-white/80 hover:bg-[#003366] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {showRoleSwitcher && (
              <Select value={currentRole} onValueChange={(v) => handleRoleChange(v)}>
                <SelectTrigger className="w-40 bg-[#003366] border-[#003366] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="dining-staff">Dining Staff</SelectItem>
                  <SelectItem value="facilities">Facilities</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Button variant="ghost" size="icon" className="text-white hover:bg-[#003366]">
              <Bell className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-white hover:bg-[#003366]">
              <User className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#003366]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href
                      ? "bg-[#012169] text-white"
                      : "text-white/80 hover:bg-[#012169] hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}

            {showRoleSwitcher && (
              <div className="px-3 py-2">
                <p className="text-white/60 text-sm mb-2">Switch Role</p>
                <Select value={currentRole} onValueChange={(v) => handleRoleChange(v)}>
                  <SelectTrigger className="w-full bg-[#012169] border-[#012169] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="dining-staff">Dining Staff</SelectItem>
                    <SelectItem value="facilities">Facilities</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
