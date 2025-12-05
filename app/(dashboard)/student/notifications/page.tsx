"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Briefcase, Calendar, CheckCircle, AlertCircle, Info, Trash2, Check } from "lucide-react"

const notifications = [
  {
    id: "1",
    title: "You have been shortlisted!",
    message: "Congratulations! You have been shortlisted for Software Development Engineer at TechCorp Solutions.",
    type: "success",
    category: "application",
    isRead: false,
    createdAt: "2024-12-10T10:30:00",
  },
  {
    id: "2",
    title: "New Job Posted",
    message: "InnovateTech has posted a new position: Machine Learning Engineer. Check if you're eligible!",
    type: "info",
    category: "job",
    isRead: false,
    createdAt: "2024-12-10T09:00:00",
  },
  {
    id: "3",
    title: "Interview Scheduled",
    message: "Your technical interview with TechCorp Solutions is scheduled for Dec 18, 2024 at 11:30 AM.",
    type: "info",
    category: "event",
    isRead: false,
    createdAt: "2024-12-09T16:45:00",
  },
  {
    id: "4",
    title: "PPT Tomorrow",
    message: "Reminder: TechCorp Solutions Pre-Placement Talk is scheduled for tomorrow at 10:00 AM in Seminar Hall A.",
    type: "warning",
    category: "event",
    isRead: true,
    createdAt: "2024-12-09T14:00:00",
  },
  {
    id: "5",
    title: "Profile Incomplete",
    message: "Complete your profile to improve your chances of getting shortlisted. Add your resume and projects.",
    type: "warning",
    category: "system",
    isRead: true,
    createdAt: "2024-12-08T11:00:00",
  },
  {
    id: "6",
    title: "Application Received",
    message: "Your application for Frontend Developer Intern at TechCorp Solutions has been received.",
    type: "info",
    category: "application",
    isRead: true,
    createdAt: "2024-12-08T10:00:00",
  },
]

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications)
  const [filter, setFilter] = useState("all")

  const unreadCount = items.filter((n) => !n.isRead).length

  const filteredItems = items.filter((n) => {
    if (filter === "all") return true
    if (filter === "unread") return !n.isRead
    return n.category === filter
  })

  const markAsRead = (id: string) => {
    setItems(items.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setItems(items.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setItems(items.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "application":
        return <Briefcase className="h-4 w-4" />
      case "job":
        return <Briefcase className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return "Yesterday"
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with placement activities</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="application">Applications</TabsTrigger>
              <TabsTrigger value="event">Events</TabsTrigger>
              <TabsTrigger value="job">Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                filteredItems.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      !notification.isRead ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {notification.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(notification.category)}
                          <span className="ml-1 capitalize">{notification.category}</span>
                        </Badge>
                        {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
