import { NextResponse } from "next/server"
import { start } from "./services/start"
import { Browser, Page } from "puppeteer"
import { denyPermissions, grantPermissions } from "./services/permissions"

export async function POST(req: Request) {
    try {
        const { grantedEmails, deniedEmails } = await req.json()
        console.log('[STARTED]')
        const result = await start();

        if (!result || typeof result.page !== "object" || typeof result.browser !== "object")
            return NextResponse.json({
                status: 500,
                body: "Cant start puppeteer",
            })

        const { page, browser }: { page: Page, browser: Browser } = result
        if (grantedEmails?.length > 0) {
            console.log('grant starts')
            await grantPermissions(page, grantedEmails);
        }

        if (deniedEmails?.length > 0) {
            console.log('deny starts')
            await denyPermissions(page, deniedEmails);
        }
        await page.screenshot({ path: 'screenshot_last.png' });

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