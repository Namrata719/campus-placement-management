"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, MoreHorizontal, UserPlus, Upload, Download, Eye, Edit, CheckCircle, XCircle, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Student {
  id: string
  name: string
  email: string
  rollNo: string
  branch: string
  batch: string
  cgpa: number
  backlogs: number
  status: "approved" | "pending" | "rejected"
  placementStatus: "placed" | "unplaced"
  company: string | null
  ctc: string | null
}

export default function TPOStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [branchFilter, setBranchFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, branchFilter, statusFilter])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (branchFilter !== "all") params.append("branch", branchFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchTerm) params.append("search", searchTerm)

      const res = await fetch(`/api/tpo/students?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setStudents(data.data)
      } else {
        toast.error(data.error || "Failed to fetch students")
      }
    } catch (error) {
      toast.error("Failed to fetch students")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (ids: string[], status: string) => {
    try {
      const res = await fetch("/api/tpo/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: ids, status }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(`Students ${status} successfully`)
        fetchStudents()
        setSelectedStudents([])
      } else {
        toast.error(data.error || "Failed to update status")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(students.map((s) => s.id))
    }
  }

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  const handleExport = () => {
    const headers = ["Name", "Email", "Roll No", "Branch", "CGPA", "Status", "Placement Status", "Company", "CTC"]
    const csvContent = [
      headers.join(","),
      ...students.map(s => [
        `"${s.name}"`,
        s.email,
        s.rollNo,
        s.branch,
        s.cgpa,
        s.status,
        s.placementStatus,
        s.company || "",
        s.ctc || ""
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students_export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Export started")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      const lines = text.split("\n")
      const headers = lines[0].split(",").map(h => h.trim())

      const students = []
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        const values = lines[i].split(",").map(v => v.trim())
        const student: any = {}

        // Simple mapping based on expected headers or index
        // Expected: firstName, lastName, email, rollNumber, department, batch, cgpa, backlogs, phone, tenthPercentage, twelfthPercentage
        if (headers.includes("email")) {
          headers.forEach((header, index) => {
            student[header] = values[index]
          })
        } else {
          // Fallback to index based mapping if headers don't match exactly
          student.firstName = values[0]
          student.lastName = values[1]
          student.email = values[2]
          student.rollNumber = values[3]
          student.department = values[4]
          student.batch = values[5]
          student.cgpa = values[6]
          student.backlogs = values[7]
          student.phone = values[8]
          student.tenthPercentage = values[9]
          student.twelfthPercentage = values[10]
        }
        students.push(student)
      }

      if (students.length === 0) {
        toast.error("No valid students found in CSV")
        return
      }

      toast.info(`Importing ${students.length} students...`)

      try {
        const res = await fetch("/api/tpo/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ students })
        })
        const json = await res.json()

        if (json.success) {
          toast.success(`Imported ${json.results.success} students. Failed: ${json.results.failed}`)
          if (json.results.errors.length > 0) {
            console.error("Import errors:", json.results.errors)
            toast.warning("Check console for import errors")
          }
          fetchStudents()
        } else {
          toast.error(json.error || "Import failed")
        }
      } catch (error) {
        toast.error("Import failed")
      }
    }
    reader.readAsText(file)
  }

  const handleSendEmail = async (ids: string[]) => {
    if (ids.length === 0) return

    const targetEmails = students.filter(s => ids.includes(s.id)).map(s => s.email)

    if (targetEmails.length === 0) {
      toast.error("No valid email addresses found")
      return
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include authentication cookies
        body: JSON.stringify({
          to: targetEmails.join(","),
          subject: "Important Update from TPO",
          message: "Please check your dashboard for new updates regarding placements."
        })
      })

      const json = await res.json()

      if (res.status === 401) {
        toast.error("Authentication failed. Please refresh and try again.")
        return
      }

      if (json.success) {
        toast.success(`Email sent to ${targetEmails.length} student(s)`)
      } else {
        toast.error(json.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Email send error:", error)
      toast.error("Failed to send email")
    }
  }

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Student>>({})

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student)
    setViewDialogOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setEditFormData(student)
    setEditDialogOpen(true)
  }

  const handleSaveStudent = async () => {
    try {
      const res = await fetch("/api/tpo/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent?.id,
          ...editFormData
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("Student updated successfully")
        setEditDialogOpen(false)
        fetchStudents()
      } else {
        toast.error(data.error || "Failed to update student")
      }
    } catch (error) {
      toast.error("Failed to update student")
    }
  }


  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Add Student State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    rollNo: "",
    branch: "Computer Science",
    batch: "2025",
    cgpa: "",
    backlogs: "0"
  })

  // Pagination Logic
  const totalPages = Math.ceil(students.length / itemsPerPage)
  const paginatedStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.email || !newStudent.rollNo) {
      toast.error("Please fill in required fields")
      return
    }

    const nameParts = newStudent.name.trim().split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || "."

    const studentPayload = {
      firstName,
      lastName,
      email: newStudent.email,
      rollNumber: newStudent.rollNo,
      department: newStudent.branch,
      batch: newStudent.batch,
      cgpa: newStudent.cgpa,
      backlogs: newStudent.backlogs,
      phone: "0000000000",
      tenthPercentage: 0,
      twelfthPercentage: 0
    }

    try {
      const res = await fetch("/api/tpo/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: [studentPayload] }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success("Student added successfully")
        setIsAddStudentOpen(false)
        setNewStudent({
          name: "", email: "", rollNo: "", branch: "Computer Science",
          batch: "2025", cgpa: "", backlogs: "0"
        })
        fetchStudents()
      } else {
        toast.error(data.error || "Failed to add student")
      }
    } catch (error) {
      toast.error("Failed to add student")
    }
  }

  const handleNewStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewStudent(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage student profiles and approvals</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Students from CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to browse CSV file
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">CSV Format:</p>
                  <p>name, email, rollNo, branch, batch, cgpa, backlogs</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setIsAddStudentOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[250px]"
                />
              </div>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {selectedStudents.length > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">{selectedStudents.length} selected</span>
                  <Button variant="outline" size="sm" onClick={() => handleSendEmail(selectedStudents)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(selectedStudents, "approved")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Approve
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={students.length > 0 && selectedStudents.length === students.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span>Loading students...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.rollNo}</TableCell>
                      <TableCell>{student.branch}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span
                            className={
                              student.cgpa >= 8
                                ? "text-green-600"
                                : student.cgpa >= 7
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          >
                            {student.cgpa}
                          </span>
                          {student.backlogs > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {student.backlogs} backlog{student.backlogs > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "approved"
                              ? "default"
                              : student.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.placementStatus === "placed" ? (
                          <div>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                              Placed
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {student.company} • {student.ctc}
                            </p>
                          </div>
                        ) : (
                          <Badge variant="outline">Unplaced</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(student)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {student.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleStatusUpdate([student.id], "approved")}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleStatusUpdate([student.id], "rejected")}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleSendEmail([student.id])}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedStudents.length} of {students.length} students
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Profile Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="grid grid-cols-2 gap-6 py-4">
              <div className="flex items-center gap-4 col-span-2">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl">
                    {selectedStudent?.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedStudent?.name}</h3>
                  <p className="text-muted-foreground">{selectedStudent?.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                <p className="text-lg">{selectedStudent?.rollNo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Branch</p>
                <p className="text-lg">{selectedStudent?.branch}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Batch</p>
                <p className="text-lg">{selectedStudent?.batch}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CGPA</p>
                <p className="text-lg">{selectedStudent?.cgpa}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Backlogs</p>
                <p className="text-lg">{selectedStudent?.backlogs}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge>{selectedStudent?.status}</Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={editFormData.name || ""}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CGPA</label>
              <Input
                type="number"
                value={editFormData.cgpa || ""}
                onChange={(e) => setEditFormData({ ...editFormData, cgpa: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Backlogs</label>
              <Input
                type="number"
                value={editFormData.backlogs || 0}
                onChange={(e) => setEditFormData({ ...editFormData, backlogs: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editFormData.status}
                onValueChange={(val: any) => setEditFormData({ ...editFormData, status: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStudent}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input name="name" value={newStudent.name} onChange={handleNewStudentChange} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll No</label>
                <Input name="rollNo" value={newStudent.rollNo} onChange={handleNewStudentChange} placeholder="123456" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" value={newStudent.email} onChange={handleNewStudentChange} placeholder="john@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select value={newStudent.branch} onValueChange={(val) => setNewStudent(prev => ({ ...prev, branch: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch</label>
                <Input name="batch" value={newStudent.batch} onChange={handleNewStudentChange} placeholder="2025" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CGPA</label>
                <Input name="cgpa" value={newStudent.cgpa} onChange={handleNewStudentChange} type="number" step="0.01" placeholder="8.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Backlogs</label>
                <Input name="backlogs" value={newStudent.backlogs} onChange={handleNewStudentChange} type="number" placeholder="0" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
