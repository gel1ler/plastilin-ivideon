import puppeteer from 'puppeteer';

export async function start() {
    try {
        const launchConfig = {
            headless: true,
            args: [
                "--no-sandbox", // Add this flag to disable the sandbox
                "--disable-setuid-sandbox",
            ]
        };

        const browser = await puppeteer.launch(launchConfig);

        const page = await browser.newPage();

        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1,
            isMobile: false
        });

        await page.goto('https://my.ivideon.com/service/login', {
            waitUntil: 'networkidle0',
        });

        if (!process.env.LOGIN || !process.env.PASSWORD) return
        await page.type('input[type="email"]', process.env.LOGIN);
        await page.type('.iv-ui-password-with-reveal__input', process.env.PASSWORD);
        await page.locator('button').click()
        await page.waitForNavigation({
            waitUntil: 'networkidle0'
        });

        return { page, browser }
    } catch (error) {
        console.log(error);
    }
}