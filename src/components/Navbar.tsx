'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore'
import { signOut } from '@/lib/auth'
import {
  LayoutDashboard,
  KanbanSquare,
  CheckSquare,
  Calendar,
  FileTemplate,
  BarChart3,
  User,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/board', label: 'Kanban Board', icon: KanbanSquare },
  { href: '/my-tasks', label: 'My Tasks', icon: CheckSquare },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/templates', label: 'Templates', icon: FileTemplate },
  { href: '/reports', label: 'Reports', icon: BarChart3, requiresManager: true },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearUser } = useAuthStore()

  const handleLogout = async () => {
    await signOut()
    clearUser()
    router.push('/auth/login')
  }

  const filteredNavItems = navItems.filter(item => 
    !item.requiresManager || user?.role === 'manager'
  )

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            TaskFlow
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
              {user?.role}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
