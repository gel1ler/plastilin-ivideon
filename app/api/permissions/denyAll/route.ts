import { NextResponse } from "next/server"
import { start } from "../services/start"
import { Browser, Page } from "puppeteer"
import { denyAllPermissions } from "../services/permissions";

export async function POST(req: Request) {
    try {
        console.log('[STARTED]')
        const result = await start();

        if (!result || typeof result.page !== "object" || typeof result.browser !== "object")
            return NextResponse.json({
                status: 500,
                body: "Cant start puppeteer",
            })

        const { page, browser }: { page: Page, browser: Browser } = result
        console.log('deny all starts')
        await denyAllPermissions(page)
        await browser.close();

        return NextResponse.json({
            status: 200,
            body: "Permissions were setted",
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