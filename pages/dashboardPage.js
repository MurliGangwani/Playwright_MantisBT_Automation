import { expect } from "@playwright/test";
const { LoginPage } = require("./loginPage.js");
const { BugReportPage } = require("./bugReportPage.js")

class DashboardPage extends LoginPage {
    constructor(page) {
        super(page);
        this.viewIssuesLink = "";
        this.reportIssueLink = "";
        this.profileDropdown = "";
        this.unassignedSection = "div#unassigned table";
        this.sideBarLinks = "div[id='sidebar'] a";
        this.navBarReportIssue = "a[class='btn btn-primary btn-sm']";
        this.navBarProjectDropdown = "li[id='dropdown_projects_menu']";
    }

    async isAtDashboard() {
        await this.page.waitForLoadState();
        await this.page.locator(this.unassignedSection).waitFor('attached');
    }

    async getAllUnassignedOnDash() {
        const table = await this.page.locator(this.unassignedSection);
        const rows = await table.locator("tbody tr.my-buglist-bug");
        const count = await rows.count();

        const unassignedData = [];

        for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const issueId = await row.locator("td a").first().innerText();
        const fullTitleRaw = await row.locator("td").nth(1).innerText();

        // Clean and split title from fullTitle
        const [titlePart, ...rest] = fullTitleRaw.split('\n');
        const summary = titlePart.replace(/\[Mylyn Connector\]\s*/g, '').trim(); // remove label
        const metaInfo = rest.join(' ').trim(); // if any additional lines

        unassignedData.push({
            issueId: issueId.trim(),
            title: summary,
            details: metaInfo
        });
    }

        // for (const row of rows) {
        //     const issueLink = await row.locator("td a").first().innerText();    // ID
        //     const projectName = await row.locator("td span").first().innerText();     // Title tag like [Mylyn Connector]
        //     const fullTitle = await row.locator("td").nth(1).innerText();       // Title text

        //     unassignedData.push({ issueLink, projectName, fullTitle });
        // }

        // for (const row of rows) {
        //     const rawText = await row.textContent();
        //     const cleanedText = rawText?.trim().replace(/\s+/g, ' ') || "";

        //     // Regex pattern to extract structured parts
        //     const match = cleanedText.match(/^\[([^\]]+)\]\s+(.*?)\s+([^-]+)\s+–\s+([\d-]+\s+[\d:]+)$/);

        //     if (match) {
        //         const [, project, title, category, dateTime] = match;

        //         unassignedData.push({
        //             projectName: `[${project}]`,
        //             title,
        //             category: category.trim(),
        //             dateTime: dateTime.trim()
        //         });
        //     }
        // }

        return unassignedData;
    }

    async selectProject(projName) {
        // Open the dropdown (you likely have a button or trigger)
        await this.page.locator(this.navBarProjectDropdown).click();

        // Wait for the dropdown menu to become visible
        const dropdown = this.page.locator("ul.list.dropdown-yellow.no-margin");
        await expect(dropdown).toBeVisible();

        // Click on the desired project
        await dropdown.locator("li a", { hasText: projName }).click();
        
        //Verify Project Selected
        const projField = await this.page.locator('a[data-toggle="dropdown"]').first();
        await expect(projField).toContainText(projName);
    }

    async reportIssue(issue) {
        //Verify navBarReportIssue Link is present
        await expect((this.page).locator(this.navBarReportIssue)).toBeVisible();

        //Click on Report Issue Link
        await this.page.locator(this.navBarReportIssue).click();
        await this.page.waitForLoadState();

        //Raise a Bug
        let bugReportPage = new BugReportPage(this.page); 
        await bugReportPage.reportABug(issue);

    }
}

module.exports = { DashboardPage };
