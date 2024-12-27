import { Page } from "puppeteer"

export async function grantPermissions(page: Page, emails: string) {
    try {
        await page.click('.iv-ui-icon-button.iv-ui-icon-button__m-size-medium.iv-ui-icon-button__m-theme-light-stroke')
        await page.screenshot({ path: './public/1.png' })
        await page.click('.iv-ui-dropdown-menu__content :nth-child(5)')
        await page.screenshot({ path: './public/2.png' })
        const element = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('.iv-ui-btn-text'));
            const targetElement = elements.find(element => element.textContent && element.textContent.includes('Передать'));
            if (targetElement && targetElement instanceof HTMLElement) {
                targetElement.click();
                return true;
            }
            return false;
        });

        if (!element) {
            throw new Error('Элемент с текстом "Передать" не найден');
        }

        const checkboxes = await page.$$('input[type="checkbox"]')
        await checkboxes[1].click()
        await page.click('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium')
        await page.click('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium')
        await page.type('.iv-ui-input-container__input.iv-ui-textarea-input.iv-ui-textarea-input__m-theme-light', emails);
        await page.click('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium')

        await page.waitForSelector('.iv-ui-heading.iv-ui-heading__m-small.iv-ui-heading__m-bold')
        await page.click('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium')
    } catch (error) {
        await page.screenshot({ path: './public/error_grant.png' })
        throw error
    }
}

export async function denyPermissions(page: Page, emails: string) {
    try {
        if (!page || page.isClosed()) {
            throw new Error("Page is not available");
        }
        await page.click('.iv-ui-icon-button.iv-ui-icon-button__m-size-medium.iv-ui-icon-button__m-theme-light-stroke');

        // Поиск и клик по элементу с текстом "Редактировать"
        const editButtonClicked = await page.evaluate(() => {
            const dropdownContent = document.querySelector('.iv-ui-dropdown-menu__content');
            if (!dropdownContent) {
                return false
            }
            const editButton = Array.from(dropdownContent.children).find(
                (element) => element.textContent?.includes('Редактировать')
            );
            if (editButton && editButton instanceof HTMLElement) {
                editButton.click()
                return true
            }
            return false
        });
        if (!editButtonClicked) {
            throw new Error('Элемент с текстом "Редактировать" не найден');
        }

        await page.waitForSelector('.iv-my-rights-list-item__control', { timeout: 3000 });
        const items = await page.$$('.iv-my-rights-list-grantee-access-item');

        for (const item of items) {
            const itemText = await item.evaluate(node => node.textContent);
            const emailsArray = emails.replace(/ /g, '').split(",");

            for (const email of emailsArray) {
                if (itemText && itemText.includes(email)) {
                    const child = await item.$('*:nth-child(3)>*:nth-child(3)');
                    if (child) {
                        await child.click();
                        await page.waitForSelector('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium', { timeout: 5000 });

                        const btns = await page.$$('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium');
                        if (btns.length > 1) {
                            await btns[1].click();
                            try {
                                await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 3000 });
                            } catch (navigationError) {
                                console.error("Navigation error:", navigationError);
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        await page.screenshot({ path: './public/error_deny.png' })
        throw error;
    }
}

export async function denyAllPermissions(page: Page) {
    try {
        if (!page || page.isClosed()) {
            throw new Error("Page is not available");
        }
        await page.click('.iv-ui-icon-button.iv-ui-icon-button__m-size-medium.iv-ui-icon-button__m-theme-light-stroke');
        // Поиск и клик по элементу с текстом "Редактировать"
        const editButtonClicked = await page.evaluate(() => {
            const dropdownContent = document.querySelector('.iv-ui-dropdown-menu__content');
            if (!dropdownContent) {
                return false
            }
            const editButton = Array.from(dropdownContent.children).find(
                (element) => element.textContent?.includes('Редактировать')
            );
            if (editButton && editButton instanceof HTMLElement) {
                editButton.click()
                return true
            }
            return false
        });
        if (!editButtonClicked) {
            throw new Error('Элемент с текстом "Редактировать" не найден');
        }
        await page.waitForSelector('.iv-my-rights-list-item__control', { timeout: 3000 });
        let items = await page.$$('.iv-my-rights-list-grantee-access-item');
        
        let index = 0;
        while (items.length >= 1) {
            const itemText = await items[index].evaluate(node => node.textContent);
            if (itemText?.includes('botneva02@gmail.com')) index++;
            else {
                const child = await items[index].$('*:nth-child(3)>*:nth-child(3)');
                if (child) {
                    await child.click();
                    await page.waitForSelector('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium', { timeout: 5000 });

                    const btns = await page.$$('.iv-ui-btn.iv-ui-btn__m-theme-light-primary-filled.iv-ui-btn__m-size-medium');
                    if (btns.length > 1) {
                        await btns[1].click();
                        try {
                            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 1000 });
                        } catch (navigationError) {
                            console.error("Navigation error:", navigationError);
                        }
                    }
                }
                items = await page.$$('.iv-my-rights-list-grantee-access-item');
            }
        }
    } catch (error) {
        await page.screenshot({ path: './public/error_deny.png' })
        throw error;
    }
}