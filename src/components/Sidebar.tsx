'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Users,
  Building,
  Shield,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(true) // Start collapsed

  const navigation = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      title: 'POS Companies',
      href: '/poscompanies',
      icon: Building,
      description: 'Point of sale integrations'
    },
    {
      title: 'Access Management',
      href: '/merchantaccess',
      icon: Shield,
      description: 'Customer merchant access'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'System configuration'
    }
  ]

  return (
    <div className={cn(
      "flex h-screen bg-background border-r",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      <div className="flex flex-col w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg">MerchantHub</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Building className="h-8 w-10 text-primary" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className={cn(
                  isCollapsed ? "h-8 w-8" : "h-6 w-6"
                )} />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div>{item.title}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* User Section */}
        <div className="p-4">
          {!isCollapsed && user && (
            <div className="mb-4">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start"
          >
            <LogOut className={cn(
              isCollapsed ? "h-8 w-8" : "h-6 w-6 mr-2"
            )} />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </div>
    </div>
  )
}
