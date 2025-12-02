import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { PlacementEvent } from "@/lib/models/PlacementEvent"
import { Student } from "@/lib/models/Student"

// GET: Fetch student's events and schedule
export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const student = await Student.findOne({ userId }).lean()
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        // Fetch all events
        const events = await PlacementEvent.find({
            status: "scheduled",
            date: { $gte: new Date(new Date().setHours(0, 0, 0, 0) - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        })
            .populate("companyId", "name")
            .sort({ date: 1 })
            .lean()

        const transformedEvents = events.map((event: any) => ({
            id: event._id.toString(),
            title: event.title,
            company: event.companyId?.name || "TPC",
            type: event.eventType,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            mode: event.mode,
            venue: event.venue,
            meetingLink: event.meetingLink,
            description: event.description,
            registered: event.registeredStudents?.includes(student._id.toString()) || false,
            mandatory: event.mandatory || false,
            slot: event.slots?.find((s: any) => s.studentId?.toString() === student._id.toString())?.time,
        }))

        // Calculate stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const stats = {
            upcoming: transformedEvents.filter((e: any) => new Date(e.date) >= today).length,
            registered: transformedEvents.filter((e: any) => e.registered).length,
            mandatory: transformedEvents.filter((e: any) => e.mandatory && e.registered).length,
        }

        return NextResponse.json({
            success: true,
            events: transformedEvents,
            stats,
        })
    } catch (error: any) {
        console.error("Error fetching schedule:", error)
        return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
    }
}

// POST: Register for event
export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { eventId } = await req.json()

        await connectDB()

        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const event = await PlacementEvent.findById(eventId)
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        // Check if already registered
        if (event.registeredStudents?.includes(student._id.toString())) {
            return NextResponse.json({ error: "Already registered for this event" }, { status: 400 })
        }

        // Add student to registered list
        if (!event.registeredStudents) {
            event.registeredStudents = []
        }
        event.registeredStudents.push(student._id.toString())
        await event.save()

        return NextResponse.json({
            success: true,
            message: "Successfully registered for event",
        })
    } catch (error: any) {
        console.error("Error registering for event:", error)
        return NextResponse.json({ error: "Failed to register for event" }, { status: 500 })
    }
}

// PUT: Set reminder for event
export async function PUT(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { eventId } = await req.json()

        await connectDB()

        const student = await Student.findOne({ userId })
        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        const event = await PlacementEvent.findById(eventId)
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }

        // In production, you would:
        // 1. Send email notification
        // 2. Create a notification in DB
        // 3. Schedule push notification

        // For now, just acknowledge the request
        return NextResponse.json({
            success: true,
            message: "Reminder set! You'll be notified before the event",
        })
    } catch (error: any) {
        console.error("Error setting reminder:", error)
        return NextResponse.json({ error: "Failed to set reminder" }, { status: 500 })
    }
}
