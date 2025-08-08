import { expect } from "@playwright/test";

class BugReportPage {
    constructor(page) {
        this.page = page;

        // Locators for the main form fields
        this.tittle = "h4[class='widget-title lighter']";
        this.category = 'select#category_id';
        this.reproducibility = 'select#reproducibility';
        this.severity = 'select#severity';
        this.priority = 'select#priority';
        this.platform = 'input#platform';
        this.os = 'input#os';
        this.osVersion = 'input#os_build';
        this.productVersion = 'select#product_version';
        this.summary = 'input#summary';
        this.description = 'textarea#description';
        this.stepsToReproduce = 'textarea#steps_to_reproduce';
        this.additionalInformation = 'textarea#additional_info';

        // Locators for the other interactive elements
        this.uploadFiles = 'div.dropzone';
        this.viewStatusPublic = 'input[name="view_state"][value="10"]';
        this.viewStatusPrivate = 'input[name="view_state"][value="50"]';
        this.reportStayCheckbox = 'input#report_stay';

        // Locators for buttons
        this.submitIssueButton = 'input[type="submit"][value="Submit Issue"]';

    }

    async reportABug(bugDetails) {
        //Verify User is on https://mantisbt.org/bugs/bug_report_page.php
        await expect(this.page).toHaveURL('https://mantisbt.org/bugs/bug_report_page.php');

        // Fill in the dropdowns
        await this.page.selectOption(this.category, bugDetails.Category);
        await this.page.selectOption(this.reproducibility, bugDetails.Reproducibility);
        await this.page.selectOption(this.severity, bugDetails.Severity);
        await this.page.selectOption(this.priority, bugDetails.Priority);
        await this.page.selectOption(this.productVersion, bugDetails["Product Version"]);

        // Fill in text and textarea fields
        await this.page.fill(this.summary, bugDetails.Summary);
        await this.page.fill(this.description, bugDetails.Description);
        await this.page.fill(this.stepsToReproduce, bugDetails["Steps To Reproduce"].join('\n'));
        await this.page.fill(this.additionalInformation, bugDetails["Additional Information"]);

        // Handle the "View Status" radio button
        if (bugDetails["View Status"] === "private") {
            await this.page.check(this.viewStatusPrivate);
        } else {
            await this.page.check(this.viewStatusPublic);
        }

        // Handle the "Report Stay" checkbox
        if (bugDetails["Report Stay"] === true) {
            await this.page.locator(this.reportStayCheckbox).locator('..').click();
        }
        
        //Click on Submit Button
        await this.page.click(this.submitIssueButton);
    }
}

module.exports = { BugReportPage }