import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { verifyAuth } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
        const uploadDir = path.join(process.cwd(), "public/uploads")
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, buffer)

        const url = `/uploads/${filename}`

        return NextResponse.json({ success: true, url })

    } catch (error) {
        console.error("Error uploading file:", error)
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }
}
