import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboardPage.js';
const rawUserData = require('../../test-data/userData.json');
const rawBugData = require('../../test-data/sampleBug.json');
const user = JSON.parse(JSON.stringify(rawUserData));

let dashPage;

test.describe('Dashboard Functionality', () => {

    test.beforeEach(async ({ page }) => {
        dashPage = new DashboardPage(page);

        await dashPage.navigate();
        await dashPage.login(user[0].username, user[0].password);

        await expect(page).toHaveURL(/my_view_page/);
        await dashPage.isAtDashboard();
    });

    test.skip('Get Unassigned Issues on Dashboard', async () => {
        const unassignedIssues = await dashPage.getAllUnassignedOnDash();
        console.log(unassignedIssues);

        // Example assertion (you can customize or remove it)
        expect(Array.isArray(unassignedIssues)).toBeTruthy();
    });

    test.skip('Select Project', async () => {
        await dashPage.selectProject('Plugin - FilterPageEdit');
    });

    test('Raise a Bug' , async () => {
        const bug = JSON.parse(JSON.stringify(rawBugData));
        await dashPage.reportIssue(bug[0]);
    })

});