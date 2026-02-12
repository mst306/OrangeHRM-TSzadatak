import { test, expect, Page } from '@playwright/test';
import testData from '../data/testData.json';
import { POManager } from '../pageobjects/POManager';
import { generateUniqueId, formatDate } from '../utils/helpers';

let poManager: POManager;

test.describe('PIM Module', () => 
{
  let employeeId: string;
  let timestamp: string;
  let pimPage: any; 
  
  test.beforeEach(async ({ page }: { page: Page }) =>   
  {
    poManager = new POManager(page);

    timestamp = Date.now().toString();
    employeeId = generateUniqueId('EMP');

    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.login(
      testData.adminLogin.username,
      testData.adminLogin.password
    );

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.displayDashboardPage();
    await dashboardPage.sidePanelIsVisible();

    pimPage = poManager.getPIMPage();
    await pimPage.openPIMPage();
  });

  test('Add new employee with image and DOB', async ({ page }: { page: Page }) => 
  {
    const { firstName, lastName, username, password } = testData.createLoginDetails;
    const { day, month, year } = testData.DOB;

    const uniqueUsername: string = generateUniqueId(username);

    console.log(uniqueUsername);
    console.log(employeeId);

    await test.step('Test step - open add Employee Page', async () => {
      await pimPage.openAddEmployeePage();
    });

    await test.step('Test step - upload Employee Image', async () => {
      await pimPage.uploadEmployeeImage(testData.employeeImage);
    });

    await test.step('Test step - add Employee flow', async () => {
      await pimPage.addEmployee(firstName, lastName, employeeId);
    });

    await test.step('Test step - create login details', async () => {
      await pimPage.createLoginDetails(uniqueUsername, password);
    });

    await test.step('Test step - display Personal Details Header', async () => {
      await pimPage.personalDetailsHeader.waitFor({ state: 'visible' });
    });

    await test.step('Test step - select date of birth', async () => {
      await pimPage.selectDateOfBirth(day, month, year);

      const expectedDOB: string = formatDate(day, month, year);
      await expect(pimPage.dateOfBirthInput).toHaveValue(expectedDOB);
    });
  });

  test('Search employee by first name', async ({ page }: { page: Page }) => 
  {
    const { firstName } = testData.createLoginDetails;

    await test.step('Test step - Search employee', async () => {
      await pimPage.searchEmployee(firstName);
    });

    await test.step('Test step - Verify employee appears in table', async () => {
      await pimPage.verifyEmployeeInTable(firstName);
    });
  });

  test('Page refresh on Add Employee page', async ({ page }: { page: Page }) => 
  {
    const { firstName, lastName } = testData.createLoginDetails;

    await test.step('Test step - Open Add Employee page', async () => {
      await pimPage.openAddEmployeePage();
    });

    await test.step('Test step - Fill employee form', async () => {
      await pimPage.addEmployee(firstName, lastName, employeeId);
    });

    await test.step('Test step - Refresh page', async () => {
      await pimPage.refreshPage();
    });

    await test.step('Test step - Verify form cleared', async () => {
      await pimPage.expectFormToBeEmpty();
    });
  });
});
