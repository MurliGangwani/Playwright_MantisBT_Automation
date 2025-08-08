import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage.js';
const rawData = require('../../test-data/userData.json');
const testData = JSON.parse(JSON.stringify(rawData));

test('Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(testData[0].username, testData[0].password);

    await expect(page).toHaveURL(/my_view_page/);
});
