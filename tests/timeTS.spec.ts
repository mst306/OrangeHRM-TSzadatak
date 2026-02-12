import { test, expect, Page } from '@playwright/test';
import testData from '../data/testData.json';
import { POManager } from '../pageobjects/POManager';

let poManager: POManager;

test.describe('Time Module', () => 
{
  let timestamp: string;
  let timePage: any;

  test.beforeEach(async ({ page }: { page: Page }) => 
  {
    poManager = new POManager(page);
    timestamp = Date.now().toString();

    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.login(testData.adminLogin.username, testData.adminLogin.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.displayDashboardPage();
    await dashboardPage.sidePanelIsVisible();

    timePage = poManager.getTimePage();
    await timePage.openTimePage();
  });

  test('Add new project with customer and activity', async ({ page }: { page: Page }) => 
  {
    const { projectName, customerName, activityName } = testData.project;
    const customerUnique = `${customerName}${timestamp}`;
    const activityUnique = `${activityName}${timestamp}`;

    await test.step('Test step - Add new project with unique customer', async () => 
    {
      await timePage.addProject(projectName, customerUnique);
    });
    
    await test.step('Test step - Add new activity to project', async () => 
    {
      await timePage.addActivity(activityUnique);
    });

    await test.step('Test step - Verify activity appears in table', async () => 
    {
      const activityRow = page.locator('.oxd-table-body', { hasText: activityUnique });
      await activityRow.waitFor({ state: 'visible' });
    });
  });

  test('Select employee for time entry', async ({ page }: { page: Page }) => 
  {
    const { firstName, lastName } = testData.createLoginDetails;
    const fullName = `${firstName} ${lastName}`;
    
    await test.step('Test step - Select employee for timesheet', async () => 
    {
      await timePage.timeSelectEmployee(fullName);
      await expect(page).toHaveURL(/\/employeeId\//, { timeout: 5000 });
    });
  });

  test('Create timesheet with project, activity and 8h on Monday', async ({ page }: { page: Page }) => 
  {
    const { projectName, customerName, activityName } = testData.project;
    const { firstName, lastName } = testData.createLoginDetails;

    const uniqueTime = Date.now();
    const customerUnique = `${customerName}${uniqueTime}`;
    const activityUnique = `${activityName}${uniqueTime}`;
    const fullName = `${firstName} ${lastName}`;

    await test.step('Create new project and activity', async () => 
    {
      await timePage.addProject(projectName, customerUnique);
      await timePage.addActivity(activityUnique);
    });

    await test.step('Open employee timesheet', async () => 
    {
      await timePage.openTimePage();
      await timePage.timeSelectEmployee(fullName);
      await timePage.clickCreateTimesheet();
    });

    await test.step('Select project and activity', async () => 
    {
      await timePage.selectProject(projectName, customerUnique);
      await timePage.selectActivity(activityUnique);
    });

    await test.step('Enter 8 hours for Monday', async () => 
    {
      await timePage.enterHoursForMonday('8');
    });

    await test.step('Save timesheet', async () => 
    {
      await timePage.saveTimesheet();
    });
  });

  test('Logout', async () => 
  {
    const logoutPage = poManager.getLogoutPage();

    await test.step('Logout from application', async () => 
    {
      await logoutPage.logout();
    });
  });
});
