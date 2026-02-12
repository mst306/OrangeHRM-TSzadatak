import { Page, Locator, expect } from '@playwright/test';

export class LogoutPage 
{
  readonly page: Page;
  readonly dropdown: Locator;
  readonly logoutButton: Locator;
  readonly orangeHRMMainPage: Locator;

  constructor(page: Page) 
  {
    this.page = page;
    this.dropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.orangeHRMMainPage = page.locator('.orangehrm-login-slot');
  }

  async logout(): Promise<void> 
  {
    await this.dropdown.click();
    await this.logoutButton.click();
    await expect(this.orangeHRMMainPage).toBeVisible({ timeout: 5000 });
  }
}
