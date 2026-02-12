import { Page, Locator, expect } from '@playwright/test';

export class TimePage 
{
  readonly page: Page;
  readonly timeLink: Locator;
  readonly searchEmployeeInput: Locator;
  readonly viewButton: Locator;
  readonly projectsInfoDropdown: Locator;
  readonly projectsMenu: Locator;
  readonly addProjectButton: Locator;
  readonly projectNameInput: Locator;
  readonly customerNameInput: Locator;
  readonly addCustomerButton: Locator;
  readonly saveCustomerButton: Locator;
  readonly saveProjectButton: Locator;
  readonly addActivityButton: Locator;
  readonly createButton: Locator;
  readonly editButton: Locator;
  readonly noTimesheetFound: Locator;
  readonly activityInput: Locator;
  readonly projectInput: Locator;
  readonly listbox: Locator;
  readonly activityArrow: Locator;
  readonly mondayInput: Locator;

  constructor(page: Page) 
  {
    this.page = page;
    this.timeLink = page.getByRole('link', { name: 'Time' });
    this.searchEmployeeInput = page.getByPlaceholder('Type for hints...');
    this.viewButton = page.locator('form').getByRole('button', { name: 'View' });
    this.projectsInfoDropdown = page.locator('li', { hasText: 'Project Info' });
    this.projectsMenu = page.getByRole('menuitem', { name: 'Projects' });
    this.addProjectButton = page.getByRole('button', { name: 'Add' });
    this.projectNameInput = page.getByRole('textbox').nth(1);
    this.customerNameInput = page.getByRole('textbox').nth(5);
    this.addCustomerButton = page.getByRole('button', { name: 'Add Customer' });
    this.saveCustomerButton = page.locator('.oxd-sheet--rounded').getByRole('button', { name: 'Save' });
    this.saveProjectButton = page.locator('.oxd-button--medium').nth(3);
    this.addActivityButton = page.locator('h6', { hasText: 'Activities' }).locator('xpath=..').getByRole('button', { name: 'Add' });
    this.createButton = page.getByRole('button', { name: 'Create Timesheet' });
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.noTimesheetFound = page.getByText('No Timesheets Found');
    this.activityInput = page.getByRole('dialog').getByRole('textbox');
    this.projectInput = page.getByPlaceholder('Type for hints...').first();
    this.listbox = page.getByRole('listbox');
    this.activityArrow = page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow');
    this.mondayInput = page.getByRole('textbox').nth(2);
  }

  async openTimePage(): Promise<void> 
  {
    await this.timeLink.click();
    await this.searchEmployeeInput.waitFor({ state: 'visible' });
  }

  async timeSelectEmployee(fullName: string): Promise<void> 
  {
    await this.searchEmployeeInput.waitFor({ state: 'visible' });
    await this.searchEmployeeInput.type(fullName, { delay: 100 });
    const option = this.page.getByRole('option', { name: fullName }).first();
    await expect(option).toBeVisible({ timeout: 8000 });
    await option.click();
    await this.viewButton.click();
    await this.page.waitForTimeout(2000);
  }

  async addProject(projectName: string, customerUnique: string): Promise<void> 
  {
    await this.projectsInfoDropdown.click();
    await this.projectsMenu.click();
    await this.addProjectButton.waitFor({ state: 'visible' });
    await this.addProjectButton.click();
    await this.projectNameInput.fill(projectName);
    await this.addCustomerButton.click();
    await this.customerNameInput.fill(customerUnique);
    await this.saveCustomerButton.click();
    await this.saveProjectButton.click();
  }

  async addActivity(activityUnique: string): Promise<void> 
  {
    await this.addActivityButton.waitFor({ state: 'visible' });
    await this.addActivityButton.click();
    await this.activityInput.fill(activityUnique);
    await this.page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
  }

  async clickCreateTimesheet(): Promise<void> 
  {
    const noTimesheetVisible = await this.noTimesheetFound.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);


    if (noTimesheetVisible)
    {
      console.log('CreateTimesheet button visible, creating new timesheet');
      await this.createButton.waitFor({ state: 'visible' });
      await this.createButton.click();
      await this.editButton.waitFor({ state: 'visible', timeout: 10000 });
    }

    await this.editButton.click();
    await expect(this.page.getByPlaceholder('Type for hints...').first()).toBeVisible();
  }

  async selectProject(projectName: string, customerUnique: string): Promise<void> 
  {
    await this.projectInput.type(customerUnique, { delay: 100 });
    const optionText = `${customerUnique} - ${projectName}`;
    const projectOption = this.page.getByRole('option', { name: optionText });
    await expect(this.listbox).toBeVisible({ timeout: 5000 });
    await projectOption.waitFor({ state: 'visible', timeout: 8000 });
    await projectOption.click();
    await this.page.waitForTimeout(2000);
  }

  async selectActivity(activityUnique: string): Promise<void> 
  {
    await this.activityArrow.waitFor({ state: 'visible', timeout: 1000 });
    await this.activityArrow.click();
    await expect(this.listbox).toBeVisible({ timeout: 5000 });
    const activityOption = this.listbox.getByRole('option').filter({ hasText: activityUnique });
    await expect(activityOption).toBeVisible({ timeout: 5000 });
    await activityOption.click();
  }

  async enterHoursForMonday(hours: number): Promise<void> 
  {
    await this.mondayInput.click();
    await this.mondayInput.fill(hours.toString());
  }

  async saveTimesheet(): Promise<void> 
  {
    await this.page.getByRole('button', { name: ' Save ' }).click();
    await this.page.waitForTimeout(2000);
  }
}
