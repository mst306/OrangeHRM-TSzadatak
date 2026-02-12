import { test, expect, Page } from '@playwright/test';
import testData from '../data/testData.json';
import { POManager } from '../pageobjects/POManager';
import { LoginPage } from '../pageobjects/LoginPage';
import { DashboardPage } from '../pageobjects/DashboardPage';

const { username, password, InvalidUsername, InvalidPassword, EmptyUsername, EmptyPassword } = testData.adminLogin;

let poManager: POManager;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.describe('Login tests', () => 
{
  test.beforeEach(async ({ page }: { page: Page }) =>
  {
    poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    dashboardPage = poManager.getDashboardPage();
    await loginPage.goTo();
  });

  test('Valid login', async () => 
  {
    await loginPage.login(username, password);
    await dashboardPage.displayDashboardPage();
  });

  test('Empty username', async () => 
  {
    await loginPage.login(EmptyUsername, password);
    await loginPage.expectRequiredError();
  });

  test('Empty password', async () => 
  {
    await loginPage.login(username, EmptyPassword);
    await loginPage.expectRequiredError();
  });

  test('Invalid credentials', async () => 
  {
    await loginPage.login(InvalidUsername, InvalidPassword);
    await loginPage.expectInvalidCredentials();
  });

});
