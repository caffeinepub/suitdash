import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Shirt,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Revenue", path: "/revenue", icon: TrendingUp },
  { label: "Customers", path: "/customers", icon: Users },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-20 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClose();
          }}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-64 flex flex-col",
          "bg-[oklch(var(--sidebar))] text-[oklch(var(--sidebar-foreground))]",
          "transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        data-ocid="sidebar"
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-[oklch(var(--sidebar-border))]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[oklch(var(--sidebar-primary))] flex items-center justify-center flex-shrink-0">
              <Shirt className="w-4 h-4 text-[oklch(var(--sidebar-primary-foreground))]" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-[oklch(var(--sidebar-foreground))]">
              SuitDash
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 rounded text-[oklch(var(--sidebar-foreground))] opacity-60 hover:opacity-100 transition-smooth"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 px-3 py-4 space-y-1"
          aria-label="Main navigation"
        >
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive =
              path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={onClose}
                data-ocid={`nav-${label.toLowerCase()}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-[oklch(var(--sidebar-primary))] text-[oklch(var(--sidebar-primary-foreground))]"
                    : "text-[oklch(var(--sidebar-foreground))] opacity-70 hover:opacity-100 hover:bg-[oklch(var(--sidebar-accent))]",
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-6 border-t border-[oklch(var(--sidebar-border))] pt-4">
          <Button
            variant="ghost"
            onClick={logout}
            data-ocid="sidebar-logout"
            className="w-full justify-start gap-3 text-sm opacity-70 hover:opacity-100 text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent))] hover:text-[oklch(var(--sidebar-accent-foreground))]"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
