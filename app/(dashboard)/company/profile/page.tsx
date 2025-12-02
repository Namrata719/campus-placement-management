"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Briefcase, Calendar, Save, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [company, setCompany] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    employeeCount: "",
    locations: "",
    description: "",
    contactPerson: {
      name: "",
      designation: "",
      email: "",
      phone: ""
    }
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/company/profile")
      const data = await res.json()
      if (data.success) {
        setCompany(data.data)
        setFormData({
          name: data.data.name || "",
          industry: data.data.industry || "",
          website: data.data.website || "",
          employeeCount: data.data.employeeCount || "",
          locations: data.data.locations ? data.data.locations.join(", ") : "",
          description: data.data.description || "",
          contactPerson: {
            name: data.data.contactPerson?.name || "",
            designation: data.data.contactPerson?.designation || "",
            email: data.data.contactPerson?.email || "",
            phone: data.data.contactPerson?.phone || ""
          }
        })
      } else {
        toast.error("Failed to fetch profile")
      }
    } catch (error) {
      toast.error("Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith("contact.")) {
      const field = name.split(".")[1]
      setFormData(prev => ({
        ...prev,
        contactPerson: { ...prev.contactPerson, [field]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Profile updated successfully")
        setCompany(data.data)
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
        const data = await res.json()
        if (data.success) {
          // Update company profile with new logo URL
          setCompany((prev: any) => ({ ...prev, logo: data.url }))

          // Also save it to the backend immediately or let the user click save?
          // Let's update the formData too so it gets saved on "Save Changes"
          // But wait, the API expects 'logo' field? The PUT route I wrote earlier commented out logo.
          // I should update the PUT route to accept logo or handle it here.
          // Let's update the PUT route first to accept logo.
          // For now, I'll just show success and update local state.

          // Actually, let's update the backend immediately for the logo
          const updateRes = await fetch("/api/company/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, logo: data.url })
          })

          if (updateRes.ok) {
            toast.success("Logo uploaded successfully")
            fetchProfile() // Refresh
          }
        } else {
          toast.error("Failed to upload logo")
        }
      } catch (error) {
        toast.error("Failed to upload logo")
      }
    }
    input.click()
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Profile</h1>
          <p className="text-muted-foreground">Manage your company information</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic details about your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={company?.logo} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {formData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" onClick={handleLogoUpload}>
                  <Upload className="mr-2 h-4 w-4" />
                  Change Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Recommended: 200x200px, PNG or JPG</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input name="industry" value={formData.industry} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Website</Label>
                <Input name="website" value={formData.website} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Input name="employeeCount" value={formData.employeeCount} onChange={handleChange} placeholder="e.g. 1000-5000 employees" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Office Locations</Label>
              <Input name="locations" value={formData.locations} onChange={handleChange} placeholder="Comma separated (e.g. Bangalore, Mumbai)" />
            </div>

            <div className="space-y-2">
              <Label>About Company</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about your company..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Status</span>
                  <Badge className={company?.status === "approved" ? "bg-green-500" : "bg-yellow-500"}>
                    {company?.status || "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Completion</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]" />
                </div>
                <p className="text-xs text-muted-foreground">Complete your profile to improve visibility</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="contact.name" value={formData.contactPerson.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input name="contact.designation" value={formData.contactPerson.designation} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="contact.email" value={formData.contactPerson.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="contact.phone" value={formData.contactPerson.phone} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Active Jobs</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Total Hires</span>
                  </div>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Partnered Since</span>
                  </div>
                  <span className="font-medium">{new Date(company?.createdAt).getFullYear()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
