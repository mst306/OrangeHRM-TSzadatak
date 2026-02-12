import { Page, Locator, expect } from '@playwright/test';
import testData from '../data/testData.json';

export class PIMPage 
{
  readonly page: Page;
  readonly pimLink: Locator;
  readonly pimHeading: Locator;
  readonly employeeInformationHeader: Locator;

  readonly addButton: Locator;
  readonly addEmployeeHeading: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly radioButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly addImageButton: Locator;

  readonly personalDetailsHeader: Locator;

  readonly searchEmployeeInput: Locator;
  readonly searchButton: Locator;

  readonly dateOfBirthInput: Locator;
  readonly monthDropdown: Locator;
  readonly yearDropdown: Locator;
  readonly day: (day: number) => Locator;

  constructor(page: Page) 
  {
    this.page = page;
    this.pimLink = page.getByRole('link', { name: 'PIM' });
    this.pimHeading = page.getByRole('heading', { name: 'PIM' });
    this.employeeInformationHeader = page.getByRole('heading', { name: 'Employee Information' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.addEmployeeHeading = page.getByRole('heading', { name: 'Add Employee' });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page.locator('//label[text()="Employee Id"]/ancestor::div[1]/following-sibling::div[1]//input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.radioButton = page.locator('.oxd-switch-input'); // enable login creation
    this.usernameInput = page.getByRole('textbox').nth(5);
    this.passwordInput = page.getByRole('textbox').nth(6);
    this.confirmPasswordInput = page.getByRole('textbox').nth(7);
    this.addImageButton = page.locator('.employee-image-action');
    this.personalDetailsHeader = page.getByRole('heading', { name: 'Personal Details' });
    this.searchEmployeeInput = page.getByPlaceholder('Type for hints...').first();
    this.searchButton = page.getByRole('button', { name: 'Search' });

    this.dateOfBirthInput = page.getByPlaceholder('yyyy-dd-mm').nth(1);
    this.monthDropdown = page.locator('.oxd-calendar-selector-month');
    this.yearDropdown = page.locator('.oxd-calendar-selector-year');
    this.day = (day: number) => page.locator('.oxd-calendar-date', { hasText: day.toString() });
  }

  async openPIMPage(): Promise<void> 
  {
    await this.pimLink.click();
    await expect(this.pimHeading).toBeVisible({ timeout: 30000 });
    await expect(this.employeeInformationHeader).toBeVisible({ timeout: 30000 });
  }

  async openAddEmployeePage(): Promise<void> 
  {
    await this.addButton.click();
    await expect(this.addEmployeeHeading).toBeVisible({ timeout: 30000 });
  }

  async addEmployee(firstName: string, lastName: string, employeeId: string): Promise<void> 
  {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdInput.clear();
    await this.employeeIdInput.fill(employeeId);
  }

  async createLoginDetails(username: string, password: string): Promise<void> 
  {
    await this.radioButton.waitFor({ state: 'visible' });
    await this.radioButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.saveButton.click();
  }

  async uploadEmployeeImage(imagePath: string): Promise<void> 
  {
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(imagePath);
  }

  async searchEmployee(firstName: string): Promise<void> 
  {
    await this.searchEmployeeInput.fill(firstName);
    await this.searchButton.click();
  }

  async refreshPage(): Promise<void> 
  {
    await this.page.reload();
  }

  async expectFormToBeEmpty(): Promise<void> 
  {
    await expect(this.firstNameInput).toHaveValue('');
    await expect(this.lastNameInput).toHaveValue('');
  }

  async selectDateOfBirth(day: number, month: string, year: string): Promise<void> 
  {
    await this.dateOfBirthInput.waitFor({ state: 'visible', timeout: 30000 });
    await this.dateOfBirthInput.click();

    await this.monthDropdown.click();
    await this.monthDropdown.waitFor({ state: 'visible', timeout: 30000 });
    await this.page.locator(`.oxd-calendar-selector-month li:has-text("${month}")`).click();

    await this.yearDropdown.click();
    await this.yearDropdown.waitFor({ state: 'visible', timeout: 30000 });
    await this.page.locator(`.oxd-calendar-selector-year li:has-text("${year}")`).click();

    await this.day(day).click();
    await this.saveButton.nth(1).click();
  }

  async verifyEmployeeInTable(firstName: string): Promise<void> 
  {
    const employeeRow = this.page.locator('.oxd-table-body', { hasText: firstName });
    await expect(employeeRow).toBeVisible({ timeout: 11000 });
  }
}
