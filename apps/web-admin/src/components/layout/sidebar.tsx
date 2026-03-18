'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  Settings,
  Sprout,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Usuarios',
    href: '/users',
    icon: Users,
    children: [
      { label: 'Farmers', href: '/users/farmers', icon: Sprout },
      { label: 'Retailers', href: '/users/retailers', icon: Store },
    ],
  },
  {
    label: 'Fila KYC',
    href: '/kyc/queue',
    icon: ShieldCheck,
  },
  {
    label: 'Pedidos',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Disputas',
    href: '/disputes',
    icon: AlertTriangle,
  },
  {
    label: 'Financeiro',
    href: '/financial',
    icon: DollarSign,
  },
  {
    label: 'Configuracoes',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([]);

  React.useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) => pathname.startsWith(child.href));
        if (isChildActive && !expandedGroups.includes(item.href)) {
          setExpandedGroups((prev) => [...prev, item.href]);
        }
      }
    });
  }, [pathname]);

  const toggleGroup = (href: string) => {
    setExpandedGroups((prev) =>
      prev.includes(href) ? prev.filter((g) => g !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-400" />
            <div>
              <span className="text-lg font-bold text-white">iFarm</span>
              <span className="ml-1 text-xs text-green-400">Admin</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <Sprout className="h-8 w-8 text-green-400" />
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin p-3">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const isGroupExpanded = expandedGroups.includes(item.href);
            const isGroupActive = item.children.some((child) => isActive(child.href));

            return (
              <div key={item.href}>
                <button
                  onClick={() => {
                    if (collapsed) return;
                    toggleGroup(item.href);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isGroupActive
                      ? 'bg-sidebar-accent text-white'
                      : 'text-gray-400 hover:bg-sidebar-accent/50 hover:text-white'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isGroupExpanded && 'rotate-90'
                        )}
                      />
                    </>
                  )}
                </button>
                {!collapsed && isGroupExpanded && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                            isActive(child.href)
                              ? 'bg-sidebar-accent text-white'
                              : 'text-gray-400 hover:bg-sidebar-accent/50 hover:text-white'
                          )}
                        >
                          <ChildIcon className="h-4 w-4 shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-sidebar-accent text-white'
                  : 'text-gray-400 hover:bg-sidebar-accent/50 hover:text-white'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full text-gray-400 hover:bg-sidebar-accent/50 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              <span>Recolher</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
