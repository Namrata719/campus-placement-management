import { NextResponse } from "next/server"
import { clearAuthCookies, getAuthFromCookies } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { User } from "@/lib/models/User"

export async function POST() {
  try {
    const auth = await getAuthFromCookies()

    if (auth) {
      await connectDB()
      await User.findByIdAndUpdate(auth.userId, { $unset: { refreshToken: "" } })
    }

    await clearAuthCookies()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
