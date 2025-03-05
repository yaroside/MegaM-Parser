export default async function setInputsValue(page, selector, value) {
    await page.focus(selector);
    await page.evaluate((sel, val) => {
        const input = document.querySelector(sel);
        if (input) input.value = val;
    }, selector, value);
    await page.keyboard.press('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
}