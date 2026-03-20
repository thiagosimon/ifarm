'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
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
  ChevronRight,
  LogOut,
  Leaf,
} from 'lucide-react';

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
    label: 'Usuários',
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
    label: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (href: string) => {
    setExpandedGroups((prev) =>
      prev.includes(href) ? prev.filter((g) => g !== href) : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isGroupActive = (item: NavItem) =>
    item.children ? item.children.some((child) => isActive(child.href)) : isActive(item.href);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col justify-between py-8 bg-[#181C1D] shadow-2xl shadow-black/40">
      {/* Logo */}
      <div>
        <div className="px-6 mb-10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Leaf
              className="h-7 w-7 text-[#89D89E]"
              fill="currentColor"
            />
            <span className="text-2xl font-extrabold tracking-tighter text-[#89D89E]">iFarm</span>
          </Link>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E0E3E4]/40 mt-1">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isGroupActive(item);

            if (item.children) {
              const isGroupExpanded = expandedGroups.includes(item.href);

              return (
                <div key={item.href}>
                  <button
                    onClick={() => toggleGroup(item.href)}
                    className={cn(
                      'flex w-full items-center gap-3 px-6 py-3 text-sm transition-all duration-200',
                      active
                        ? 'text-[#89D89E] bg-[#89D89E]/10 border-l-4 border-[#89D89E] font-semibold'
                        : 'text-[#E0E3E4]/60 hover:text-[#E0E3E4] hover:bg-[#272B2C] border-l-4 border-transparent'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left font-light tracking-tight">{item.label}</span>
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isGroupExpanded && 'rotate-90'
                      )}
                    />
                  </button>
                  {isGroupExpanded && (
                    <div className="ml-6 space-y-1 border-l border-[#E0E3E4]/10 pl-4 mt-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isActive(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 text-sm transition-all duration-200 rounded-md',
                              childActive
                                ? 'text-[#89D89E] bg-[#89D89E]/10 font-semibold'
                                : 'text-[#E0E3E4]/60 hover:text-[#E0E3E4] hover:bg-[#272B2C]'
                            )}
                          >
                            <ChildIcon className="h-4 w-4 shrink-0" />
                            <span className="font-light tracking-tight">{child.label}</span>
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
                  'flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200',
                  active
                    ? 'text-[#89D89E] bg-[#89D89E]/10 border-l-4 border-[#89D89E] font-semibold'
                    : 'text-[#E0E3E4]/60 hover:text-[#E0E3E4] hover:bg-[#272B2C] border-l-4 border-transparent'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="font-light tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[#E0E3E4]/60 transition-colors duration-200 hover:text-[#ffb4ab] hover:bg-[#ffb4ab]/10"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className="font-light tracking-tight">Sair</span>
        </button>
      </div>
    </aside>
  );
}
