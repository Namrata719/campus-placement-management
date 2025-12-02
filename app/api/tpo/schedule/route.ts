import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { PlacementEvent } from "@/lib/models/PlacementEvent"
import { Company } from "@/lib/models/Company"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const events = await PlacementEvent.find().sort({ startTime: 1 }).lean()

        const companyIds = events.map((e: any) => e.companyId).filter((id: any) => id)
        const companies = await Company.find({ _id: { $in: companyIds } }).lean()
        const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c]))

        const formattedEvents = events.map((event: any) => {
            const company: any = event.companyId ? companyMap.get(event.companyId.toString()) : null
            return {
                id: event._id,
                title: event.title,
                company: company ? company.name : "N/A",
                type: event.eventType,
                date: new Date(event.startTime).toISOString().split('T')[0],
                time: new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: "2 hours", // Placeholder, calculate if endTime exists
                venue: event.location || "Online",
                mode: event.location && event.location.toLowerCase().includes("online") ? "Online" : "Offline",
                attendees: 0, // Placeholder
                status: "upcoming"
            }
        })

        return NextResponse.json({ success: true, data: formattedEvents })
    } catch (error) {
        console.error("Error fetching events:", error)
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const body = await req.json()

        const newEvent = await PlacementEvent.create({
            title: body.title,
            companyId: body.companyId,
            eventType: body.type,
            startTime: new Date(`${body.date}T${body.time}`),
            endTime: new Date(new Date(`${body.date}T${body.time}`).getTime() + 2 * 60 * 60 * 1000), // Default 2 hours
            location: body.venue,
            description: body.instructions,
            status: "scheduled"
        })

        return NextResponse.json({ success: true, data: newEvent })
    } catch (error) {
        console.error("Error creating event:", error)
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }
}
