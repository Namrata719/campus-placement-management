"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Building2, Mail, Bell, Shield, Database, Users, Plus, X, Save, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function TPOSettingsPage() {
  const [departments, setDepartments] = useState<any[]>([])
  const [institute, setInstitute] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [newDept, setNewDept] = useState({ name: "", code: "" })
  const [eligibilityRules, setEligibilityRules] = useState({
    minCGPA: 6.0,
    maxBacklogs: 0,
    minTenth: 60,
    minTwelfth: 60,
    allowMultipleOffers: false,
    dreamCompanyPolicy: true
  })
  const [exportType, setExportType] = useState("students")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/tpo/settings")
      const json = await res.json()
      if (json.success) {
        setDepartments(json.data.departments)
        setInstitute(json.data.institute)
      }
    } catch (error) {
      toast.error("Failed to fetch settings")
    } finally {
      setLoading(false)
    }
  }

  const addDepartment = async () => {
    if (newDept.name && newDept.code) {
      try {
        const res = await fetch("/api/tpo/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "department_add", data: newDept })
        })
        const json = await res.json()
        if (json.success) {
          setDepartments(json.data)
          setNewDept({ name: "", code: "" })
          toast.success("Department added")
        }
      } catch (error) {
        toast.error("Failed to add department")
      }
    }
  }

  const removeDepartment = async (id: string) => {
    try {
      const res = await fetch("/api/tpo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "department_remove", data: { id } })
      })
      const json = await res.json()
      if (json.success) {
        setDepartments(json.data)
        toast.success("Department removed")
      }
    } catch (error) {
      toast.error("Failed to remove department")
    }
  }

  const saveInstituteSettings = async () => {
    try {
      const res = await fetch("/api/tpo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "institute", data: institute })
      })
      const json = await res.json()
      if (json.success) {
        setInstitute(json.data)
        toast.success("Institute settings saved")
      }
    } catch (error) {
      toast.error("Failed to save settings")
    }
  }

  const handleSaveRules = async () => {
    // In a real app, this would save to the backend
    toast.success("Eligibility rules saved successfully")
  }

  const handleExportData = () => {
    toast.info(`Exporting ${exportType} data...`)
    // Simulate export delay
    setTimeout(() => {
      toast.success(`${exportType} data exported successfully`)
    }, 1000)
  }

  const handleUploadCSV = () => {
    toast.info("Please go to the respective management page to upload data.")
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage institute settings and configurations</p>
      </div>

      <Tabs defaultValue="institute" className="space-y-6">
        <TabsList>
          <TabsTrigger value="institute">Institute</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility Rules</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="institute" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Institute Information
              </CardTitle>
              <CardDescription>Basic information about your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Institute Name</Label>
                  <Input value={institute.name || ''} onChange={(e) => setInstitute({ ...institute, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Institute Code</Label>
                  <Input value={institute.code || ''} onChange={(e) => setInstitute({ ...institute, code: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={institute.location || ''} onChange={(e) => setInstitute({ ...institute, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={institute.website || ''} onChange={(e) => setInstitute({ ...institute, website: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={institute.address || ''} onChange={(e) => setInstitute({ ...institute, address: e.target.value })} rows={2} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>TPO Email</Label>
                  <Input value={institute.tpoEmail || ''} onChange={(e) => setInstitute({ ...institute, tpoEmail: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>TPO Phone</Label>
                  <Input value={institute.tpoPhone || ''} onChange={(e) => setInstitute({ ...institute, tpoPhone: e.target.value })} />
                </div>
              </div>
              <Button onClick={saveInstituteSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Year Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Current Academic Year</Label>
                  <Select value={institute.academicYear || '2024-25'} onValueChange={(val) => setInstitute({ ...institute, academicYear: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2022-23">2022-23</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Batch</Label>
                  <Select value={institute.currentBatch || '2025'} onValueChange={(val) => setInstitute({ ...institute, currentBatch: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Departments / Branches
              </CardTitle>
              <CardDescription>Manage academic departments for eligibility filtering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Department Name"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Code"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                  className="w-24"
                />
                <Button onClick={addDepartment}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{dept.code}</Badge>
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-sm text-muted-foreground">({dept.students} students)</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeDepartment(dept.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Job Posting Alert</p>
                  <p className="text-sm text-muted-foreground">Notify students when new jobs are posted</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Application Status Updates</p>
                  <p className="text-sm text-muted-foreground">Notify students when their application status changes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Event Reminders</p>
                  <p className="text-sm text-muted-foreground">Send reminders before scheduled events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Company Registration Alerts</p>
                  <p className="text-sm text-muted-foreground">Notify TPO when new companies register</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Summary Reports</p>
                  <p className="text-sm text-muted-foreground">Send weekly placement summary to TPO</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label>Email Username</Label>
                  <Input placeholder="noreply@nit.edu.in" />
                </div>
                <div className="space-y-2">
                  <Label>Email Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <Button variant="outline">Test Email Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Default Eligibility Rules
              </CardTitle>
              <CardDescription>Set default criteria that companies can use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Minimum CGPA (Default)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={eligibilityRules.minCGPA}
                    onChange={(e) => setEligibilityRules({ ...eligibilityRules, minCGPA: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Backlogs Allowed</Label>
                  <Input
                    type="number"
                    value={eligibilityRules.maxBacklogs}
                    onChange={(e) => setEligibilityRules({ ...eligibilityRules, maxBacklogs: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum 10th Percentage</Label>
                  <Input
                    type="number"
                    value={eligibilityRules.minTenth}
                    onChange={(e) => setEligibilityRules({ ...eligibilityRules, minTenth: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum 12th Percentage</Label>
                  <Input
                    type="number"
                    value={eligibilityRules.minTwelfth}
                    onChange={(e) => setEligibilityRules({ ...eligibilityRules, minTwelfth: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium">Allow Multiple Offers</p>
                  <p className="text-sm text-muted-foreground">Students can receive offers from multiple companies</p>
                </div>
                <Switch
                  checked={eligibilityRules.allowMultipleOffers}
                  onCheckedChange={(checked) => setEligibilityRules({ ...eligibilityRules, allowMultipleOffers: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dream Company Policy</p>
                  <p className="text-sm text-muted-foreground">
                    Allow students with offers to apply for dream companies
                  </p>
                </div>
                <Switch
                  checked={eligibilityRules.dreamCompanyPolicy}
                  onCheckedChange={(checked) => setEligibilityRules({ ...eligibilityRules, dreamCompanyPolicy: checked })}
                />
              </div>
              <Button onClick={handleSaveRules}>
                <Save className="mr-2 h-4 w-4" />
                Save Rules
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Import / Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border space-y-3">
                  <h4 className="font-medium">Import Students</h4>
                  <p className="text-sm text-muted-foreground">Upload CSV file with student data</p>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleUploadCSV}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </Button>
                </div>
                <div className="p-4 rounded-lg border space-y-3">
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">Download placement data as CSV</p>
                  <Select value={exportType} onValueChange={setExportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students">Student Data</SelectItem>
                      <SelectItem value="companies">Company Data</SelectItem>
                      <SelectItem value="placements">Placement Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full bg-transparent" onClick={handleExportData}>
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                <div>
                  <p className="font-medium">Reset Academic Year Data</p>
                  <p className="text-sm text-muted-foreground">Archive current year and start fresh</p>
                </div>
                <Button variant="destructive">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
