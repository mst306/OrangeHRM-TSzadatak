import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage 
{
    readonly page: Page;
    readonly dashboardHeading: Locator;
    readonly profileIcon: Locator;
    readonly sidePanel: Locator;
    readonly sidebarLinks: string[];

    constructor(page: Page) 
    {
        this.page = page;
        this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
        this.profileIcon = page.getByAltText('profile picture');
        this.sidePanel = page.getByRole('navigation', { name: 'Sidepanel' });
        this.sidebarLinks = [
        'Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 
        'Dashboard', 'Directory', 'Maintenance', 'Claim', 'Buzz'
        ];
    }

    async displayDashboardPage(): Promise<void> 
    {
        await this.page.waitForSelector('.oxd-layout-context');
        await expect(this.dashboardHeading).toBeVisible();
    }

    async clickOnDashboardLink(): Promise<void> 
    {
        await this.dashboardHeading.click();
        await expect(this.dashboardHeading).toBeVisible();
    }

    async sidePanelIsVisible(): Promise<void> 
    {
        await expect(this.sidePanel).toBeVisible();
        for (const linkName of this.sidebarLinks) 
        {
            const linkLocator = this.page.getByRole('link', { name: linkName });
            await expect(linkLocator).toBeVisible();
        }
    }
}
