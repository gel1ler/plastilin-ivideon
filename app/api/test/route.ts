import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { code } = await req.json()
        console.log(code)
        return NextResponse.json({
            status: 200,
            body: code,
        })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({
            status: 500,
            body: "error",
        })
    }
}