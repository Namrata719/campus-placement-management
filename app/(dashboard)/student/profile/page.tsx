"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Plus,
  Pencil,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
  Upload,
  FileText,
  Download,
  FileJson,
  Eye
} from "lucide-react"



export default function StudentProfilePage() {
  const [studentData, setStudentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<any>(null)
  const [newSkill, setNewSkill] = useState("")
  const [showProjectDialog, setShowProjectDialog] = useState(false)
  const [showInternshipDialog, setShowInternshipDialog] = useState(false)
  const [showCertificationDialog, setShowCertificationDialog] = useState(false)
  const [showAchievementDialog, setShowAchievementDialog] = useState(false)
  const [newAchievement, setNewAchievement] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setIsUploading(true)
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        setEditedData({ ...editedData, profileImage: json.url })
        toast.success("Photo uploaded successfully")
      } else {
        toast.error("Failed to upload photo")
      }
    } catch (error) {
      toast.error("Failed to upload photo")
    } finally {
      setIsUploading(false)
    }
  }

  const handleResumeUpload = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    setIsUploading(true)
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()
      if (json.success) {
        const newResume = {
          name: file.name,
          fileUrl: json.url,
          uploadedAt: new Date().toISOString(),
        }
        const updatedResumes = [...(editedData.resumes || []), newResume]
        setEditedData({ ...editedData, resumes: updatedResumes })
        toast.success("Resume uploaded. Click Save Changes to persist.")
      } else {
        toast.error("Failed to upload resume")
      }
    } catch (error) {
      toast.error("Failed to upload resume")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteResume = (index: number) => {
    const updatedResumes = [...editedData.resumes]
    updatedResumes.splice(index, 1)
    setEditedData({ ...editedData, resumes: updatedResumes })
    toast.success("Resume removed. Click Save Changes to persist.")
  }

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(studentData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "profile_export.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
    toast.success("Profile exported successfully")
  }

  const handleImport = (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string)
        setEditedData({ ...importedData })
        setIsEditing(true)
        toast.success("Profile imported. Review and click Save Changes.")
      } catch (error) {
        toast.error("Failed to import profile. Invalid JSON.")
      }
    }
    reader.readAsText(file)
  }

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    url: "",
  })

  const [newInternship, setNewInternship] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  })

  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    url: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/student/profile")
      const json = await res.json()
      if (json.success) {
        const profileData = json.data
        // Ensure address object exists to prevent crashes
        if (!profileData.address) {
          profileData.address = { street: "", city: "", state: "", pincode: "", country: "" }
        }
        setStudentData(profileData)
        setEditedData(profileData)
      }
    } catch (error) {
      console.error("Failed to fetch profile", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const calculateProfileCompletion = (data: any) => {
    const fields = [
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.gender,
      data.dateOfBirth,
      data.address,
      data.city,
      data.state,
      data.degree,
      data.branch,
      data.cgpa,
      data.passingYear,
      data.skills && data.skills.length > 0,
      data.projects && data.projects.length > 0,
      data.experience && data.experience.length > 0,
      data.certifications && data.certifications.length > 0,
      data.github,
      data.linkedin,
      data.portfolio,
    ]

    const filledFields = fields.filter((field) => {
      if (typeof field === "boolean") return field
      if (typeof field === "number") return field > 0
      return field && field.toString().trim() !== ""
    }).length

    return Math.round((filledFields / fields.length) * 100)
  }

  const profileCompletion = studentData ? calculateProfileCompletion(studentData) : 0

  const handleSave = async () => {
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      })
      const json = await res.json()
      if (json.success) {
        setStudentData(json.data)
        setIsEditing(false)
        toast.success("Profile updated successfully!")
      } else {
        toast.error(json.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to update profile", error)
      toast.error("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setEditedData(studentData)
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill && !editedData.skills.includes(newSkill)) {
      setEditedData({ ...editedData, skills: [...editedData.skills, newSkill] })
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setEditedData({ ...editedData, skills: editedData.skills.filter((s: string) => s !== skill) })
  }

  const addProject = () => {
    const project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      technologies: newProject.technologies.split(",").map((t: string) => t.trim()),
      url: newProject.url,
    }
    setEditedData({ ...editedData, projects: [...editedData.projects, project] })
    setNewProject({ title: "", description: "", technologies: "", url: "" })
    setShowProjectDialog(false)
    toast.success("Project added!")
  }

  const removeProject = (id: string) => {
    setEditedData({ ...editedData, projects: editedData.projects.filter((p: any) => p.id !== id) })
    toast.success("Project removed")
  }

  const addInternship = () => {
    const internship = {
      id: Date.now().toString(),
      ...newInternship,
    }
    setEditedData({ ...editedData, internships: [...editedData.internships, internship] })
    setNewInternship({ company: "", role: "", description: "", startDate: "", endDate: "", isCurrent: false })
    setShowInternshipDialog(false)
    toast.success("Internship added!")
  }

  const addCertification = () => {
    const certification = {
      id: Date.now().toString(),
      ...newCertification,
    }
    setEditedData({ ...editedData, certifications: [...editedData.certifications, certification] })
    setNewCertification({ name: "", issuer: "", issueDate: "", credentialId: "", url: "" })
    setShowCertificationDialog(false)
    toast.success("Certification added!")
  }

  const addAchievement = () => {
    if (newAchievement) {
      setEditedData({ ...editedData, achievements: [...editedData.achievements, newAchievement] })
      setNewAchievement("")
      setShowAchievementDialog(false)
      toast.success("Achievement added!")
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!studentData) {
    return <div className="flex items-center justify-center h-screen">Failed to load profile</div>
  }

  const data = isEditing ? editedData : studentData

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="My Profile" subtitle="Manage your profile information" />

      <div className="flex-1 p-4 lg:p-6 space-y-6">
        {/* Profile Header */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative group">
                <div className="relative group">
                  <Avatar className="h-24 w-24 cursor-pointer">
                    <AvatarImage src={data.profileImage} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {data.firstName[0]}
                      {data.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                      <Upload className="h-6 w-6 text-white" />
                      <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
                    <Upload className="h-6 w-6 text-white" />
                    <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {data.firstName} {data.lastName}
                    </h2>
                    <p className="text-muted-foreground">
                      {data.department} • Batch {data.batch}
                    </p>
                    <p className="text-sm text-muted-foreground">{data.rollNumber}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleExport} title="Export Profile">
                      <Download className="h-4 w-4" />
                    </Button>
                    {isEditing && (
                      <>
                        <Button variant="outline" size="icon" onClick={() => document.getElementById('import-upload')?.click()} title="Import Profile">
                          <FileJson className="h-4 w-4" />
                          <input id="import-upload" type="file" className="hidden" accept=".json" onChange={handleImport} />
                        </Button>
                      </>
                    )}
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button onClick={handleSave} className="gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {data.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {data.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {data.address?.city}, {data.address?.state}
                  </span>
                </div>

                <div className="flex gap-3 mt-4">
                  {data.githubUrl && (
                    <a href={data.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {data.linkedinUrl && (
                    <a href={data.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {data.portfolioUrl && (
                    <a href={data.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              <div className="w-full md:w-48">
                <div className="text-sm font-medium mb-2">Profile Completion</div>
                <Progress value={profileCompletion} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">{profileCompletion}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4 hidden sm:block" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="academic" className="gap-2">
              <GraduationCap className="h-4 w-4 hidden sm:block" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="experience" className="gap-2">
              <Briefcase className="h-4 w-4 hidden sm:block" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Code className="h-4 w-4 hidden sm:block" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Award className="h-4 w-4 hidden sm:block" />
              More
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4 hidden sm:block" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={data.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={data.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={data.gender}
                      onValueChange={(v) => setEditedData({ ...editedData, gender: v })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={data.dateOfBirth}
                      onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Address</Label>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Street"
                      value={data.address.street}
                      onChange={(e) =>
                        setEditedData({ ...editedData, address: { ...editedData.address, street: e.target.value } })
                      }
                      disabled={!isEditing}
                    />
                    <Input
                      placeholder="City"
                      value={data.address.city}
                      onChange={(e) =>
                        setEditedData({ ...editedData, address: { ...editedData.address, city: e.target.value } })
                      }
                      disabled={!isEditing}
                    />
                    <Input
                      placeholder="State"
                      value={data.address.state}
                      onChange={(e) =>
                        setEditedData({ ...editedData, address: { ...editedData.address, state: e.target.value } })
                      }
                      disabled={!isEditing}
                    />
                    <Input
                      placeholder="Pincode"
                      value={data.address.pincode}
                      onChange={(e) =>
                        setEditedData({ ...editedData, address: { ...editedData.address, pincode: e.target.value } })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                        <Github className="h-4 w-4" />
                      </div>
                      <Input
                        placeholder="GitHub URL"
                        value={data.githubUrl}
                        onChange={(e) => setEditedData({ ...editedData, githubUrl: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                        <Linkedin className="h-4 w-4" />
                      </div>
                      <Input
                        placeholder="LinkedIn URL"
                        value={data.linkedinUrl}
                        onChange={(e) => setEditedData({ ...editedData, linkedinUrl: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                        <Globe className="h-4 w-4" />
                      </div>
                      <Input
                        placeholder="Portfolio URL"
                        value={data.portfolioUrl}
                        onChange={(e) => setEditedData({ ...editedData, portfolioUrl: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Academic Details</CardTitle>
                <CardDescription>Your educational information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input value={data.department} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch</Label>
                    <Input value={data.batch} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Roll Number</Label>
                    <Input value={data.rollNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>CGPA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={data.cgpa}
                      onChange={(e) => setEditedData({ ...editedData, cgpa: Number.parseFloat(e.target.value) })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Active Backlogs</Label>
                    <Input
                      type="number"
                      value={data.backlogs}
                      onChange={(e) => setEditedData({ ...editedData, backlogs: Number.parseInt(e.target.value) })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>10th Percentage</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.tenthPercentage}
                      onChange={(e) =>
                        setEditedData({ ...editedData, tenthPercentage: Number.parseFloat(e.target.value) })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>12th Percentage</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={data.twelfthPercentage}
                      onChange={(e) =>
                        setEditedData({ ...editedData, twelfthPercentage: Number.parseFloat(e.target.value) })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Skills</Label>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="w-32"
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button size="sm" onClick={addSkill}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="gap-1">
                        {skill}
                        {isEditing && (
                          <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Internships and work history</CardDescription>
                  </div>
                  {isEditing && (
                    <Dialog open={showInternshipDialog} onOpenChange={setShowInternshipDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Internship
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Internship</DialogTitle>
                          <DialogDescription>Add your internship experience</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={newInternship.company}
                              onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Input
                              value={newInternship.role}
                              onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={newInternship.description}
                              onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Start Date</Label>
                              <Input
                                type="date"
                                value={newInternship.startDate}
                                onChange={(e) => setNewInternship({ ...newInternship, startDate: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>End Date</Label>
                              <Input
                                type="date"
                                value={newInternship.endDate}
                                onChange={(e) => setNewInternship({ ...newInternship, endDate: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowInternshipDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addInternship}>Add Internship</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {data.internships.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No internships added yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.internships.map((internship: any) => (
                      <div key={internship.id} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{internship.role}</h4>
                            <p className="text-muted-foreground">{internship.company}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(internship.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              -{" "}
                              {internship.isCurrent
                                ? "Present"
                                : new Date(internship.endDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })}
                            </p>
                            <p className="text-sm mt-2">{internship.description}</p>
                          </div>
                          {isEditing && (
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="bg-card mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Certifications</CardTitle>
                    <CardDescription>Professional certifications</CardDescription>
                  </div>
                  {isEditing && (
                    <Dialog open={showCertificationDialog} onOpenChange={setShowCertificationDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Certification
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Certification</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input
                              value={newCertification.name}
                              onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Issuer</Label>
                            <Input
                              value={newCertification.issuer}
                              onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={newCertification.issueDate}
                              onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Credential ID</Label>
                            <Input
                              value={newCertification.credentialId}
                              onChange={(e) => setNewCertification({ ...newCertification, credentialId: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                              value={newCertification.url}
                              onChange={(e) => setNewCertification({ ...newCertification, url: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowCertificationDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addCertification}>Add Certification</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {data.certifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No certifications added yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.certifications.map((cert: any) => (
                      <div key={cert.id} className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{cert.name}</h4>
                            <p className="text-muted-foreground">{cert.issuer}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                            {cert.credentialId && <p className="text-sm mt-1">ID: {cert.credentialId}</p>}
                          </div>
                          {cert.url && (
                            <a href={cert.url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon">
                                <Globe className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resumes & Documents</CardTitle>
                    <CardDescription>Manage your resumes and other documents</CardDescription>
                  </div>
                  {isEditing && (
                    <div>
                      <Button size="sm" className="gap-2" onClick={() => document.getElementById('resume-upload')?.click()} disabled={isUploading}>
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Resume"}
                      </Button>
                      <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {(!data.resumes || data.resumes.length === 0) ? (
                  <p className="text-muted-foreground text-center py-8">No resumes uploaded yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.resumes.map((resume: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{resume.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </a>
                          <a href={resume.fileUrl} download>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          {isEditing && (
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteResume(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          < TabsContent value="projects" >
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Showcase your work</CardDescription>
                  </div>
                  {isEditing && (
                    <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Project</DialogTitle>
                          <DialogDescription>Add a new project to your profile</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input
                              value={newProject.title}
                              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={newProject.description}
                              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Technologies (comma separated)</Label>
                            <Input
                              placeholder="React, Node.js, MongoDB"
                              value={newProject.technologies}
                              onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Project URL</Label>
                            <Input
                              value={newProject.url}
                              onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addProject}>Add Project</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {data.projects.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No projects added yet</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.projects.map((project: any) => (
                      <Card key={project.id} className="bg-muted/30">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{project.title}</CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">{project.description}</CardDescription>
                            </div>
                            {isEditing && (
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech: string) => (
                              <Badge key={tech} variant="outline" className="bg-background">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline inline-block"
                            >
                              View Project
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent >

          {/* Achievements Tab */}
          < TabsContent value="achievements" >
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Awards, honors, and accomplishments</CardDescription>
                  </div>
                  {isEditing && (
                    <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Add Achievement
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Achievement</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Achievement</Label>
                            <Textarea
                              value={newAchievement}
                              onChange={(e) => setNewAchievement(e.target.value)}
                              placeholder="Describe your achievement..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowAchievementDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addAchievement}>Add Achievement</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {data.achievements.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No achievements added yet</p>
                ) : (
                  <ul className="space-y-2 list-disc list-inside">
                    {data.achievements.map((achievement: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent >

          {/* Documents Tab */}
          < TabsContent value="documents" >
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resumes & Documents</CardTitle>
                    <CardDescription>Manage your resumes and other documents</CardDescription>
                  </div>
                  {isEditing && (
                    <div>
                      <Button size="sm" className="gap-2" onClick={() => document.getElementById('resume-upload')?.click()} disabled={isUploading}>
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Resume"}
                      </Button>
                      <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {(!data.resumes || data.resumes.length === 0) ? (
                  <p className="text-muted-foreground text-center py-8">No resumes uploaded yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.resumes.map((resume: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{resume.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </a>
                          <a href={resume.fileUrl} download>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          {isEditing && (
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteResume(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent >

          {/* Documents Tab */}
          < TabsContent value="documents" >
            <Card className="bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resumes & Documents</CardTitle>
                    <CardDescription>Manage your resumes and other documents</CardDescription>
                  </div>
                  {isEditing && (
                    <div>
                      <Button size="sm" className="gap-2" onClick={() => document.getElementById('resume-upload')?.click()} disabled={isUploading}>
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Resume"}
                      </Button>
                      <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {(!data.resumes || data.resumes.length === 0) ? (
                  <p className="text-muted-foreground text-center py-8">No resumes uploaded yet</p>
                ) : (
                  <div className="space-y-4">
                    {data.resumes.map((resume: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{resume.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </a>
                          <a href={resume.fileUrl} download>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                          {isEditing && (
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteResume(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent >
        </Tabs >
      </div >
    </div >
  )
}
