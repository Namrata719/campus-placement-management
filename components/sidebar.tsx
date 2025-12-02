"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  GraduationCap,
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Users,
  Building2,
  BarChart3,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ClipboardList,
  UserCheck,
  FileSearch,
  HelpCircle,
  Target,
  Mail,
  Award,
  GitBranch,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}

const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/student", icon: LayoutDashboard },
  { title: "Browse Jobs", href: "/student/jobs", icon: Briefcase },
  { title: "My Applications", href: "/student/applications", icon: ClipboardList },
  { title: "My Profile", href: "/student/profile", icon: FileText },
  { title: "Resume Manager", href: "/student/resume", icon: FileSearch },
  { title: "Schedule", href: "/student/schedule", icon: Calendar },
  { title: "AI Career Coach", href: "/student/ai-coach", icon: Sparkles },
  { title: "Skill Analysis", href: "/student/skill-analysis", icon: Target },
  { title: "Email Helper", href: "/student/email-helper", icon: Mail },
  { title: "Feedback", href: "/student/feedback", icon: MessageSquare },
  { title: "Notifications", href: "/student/notifications", icon: Bell, badge: 3 },
]

const tpoNavItems: NavItem[] = [
  { title: "Dashboard", href: "/tpo", icon: LayoutDashboard },
  { title: "Students", href: "/tpo/students", icon: Users },
  { title: "Companies", href: "/tpo/companies", icon: Building2 },
  { title: "Jobs", href: "/tpo/jobs", icon: Briefcase },
  { title: "Schedule", href: "/tpo/schedule", icon: Calendar },
  { title: "Selection Pipeline", href: "/tpo/pipeline", icon: GitBranch },
  { title: "Reports & Analytics", href: "/tpo/reports", icon: BarChart3 },
  { title: "AI Insights", href: "/tpo/ai-insights", icon: Sparkles },
  { title: "Settings", href: "/tpo/settings", icon: Settings },
]

const companyNavItems: NavItem[] = [
  { title: "Dashboard", href: "/company", icon: LayoutDashboard },
  { title: "Job Postings", href: "/company/jobs", icon: Briefcase },
  { title: "Applicants", href: "/company/applicants", icon: UserCheck },
  { title: "Schedule", href: "/company/schedule", icon: Calendar },
  { title: "Offers", href: "/company/offers", icon: Award },
  { title: "AI Tools", href: "/company/ai-tools", icon: Sparkles },
  { title: "Company Profile", href: "/company/profile", icon: Building2 },
  { title: "Settings", href: "/company/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = user?.role === "student" ? studentNavItems : user?.role === "tpo" ? tpoNavItems : companyNavItems

  const isItemActive = (href: string) => {
    if (href === "/student" || href === "/tpo" || href === "/company") {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <Link href={`/${user?.role || "student"}`} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">PlaceMe</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = isItemActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary px-1.5 text-xs text-sidebar-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-6 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${user?.role}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">
                <HelpCircle className="mr-2 h-4 w-4" />
                About
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
