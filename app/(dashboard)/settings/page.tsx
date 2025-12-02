"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Bell, Moon, Lock, Globe, Shield } from "lucide-react"

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
    })
    const [theme, setTheme] = useState("light")

    const handleSave = () => {
        toast.success("Settings saved successfully")
    }

    return (
        <div className="space-y-6">
            <DashboardHeader title="Settings" subtitle="Manage your preferences" />

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Configure how you receive notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive emails about new jobs and updates.</p>
                            </div>
                            <Switch
                                checked={notifications.email}
                                onCheckedChange={(c) => setNotifications({ ...notifications, email: c })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive push notifications on your device.</p>
                            </div>
                            <Switch
                                checked={notifications.push}
                                onCheckedChange={(c) => setNotifications({ ...notifications, push: c })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Moon className="h-5 w-5" />
                            Appearance
                        </CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">Enable dark mode for better viewing at night.</p>
                            </div>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Security
                        </CardTitle>
                        <CardDescription>Manage your security settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline">Change Password</Button>
                        <Button variant="outline" className="ml-2">Two-Factor Authentication</Button>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </div>
    )
}
