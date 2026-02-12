import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { PIMPage } from './PIMPage';
import { TimePage } from './TimePage';
import { LogoutPage } from './LogoutPage';

export class POManager 
{
  readonly page: Page;

  constructor(page: Page) 
  {
    this.page = page;
  }

  getLoginPage(): LoginPage 
  {
    return new LoginPage(this.page);
  }

  getDashboardPage(): DashboardPage 
  {
    return new DashboardPage(this.page);
  }

  getPIMPage(): PIMPage 
  {
    return new PIMPage(this.page);
  }

  getTimePage(): TimePage 
  {
    return new TimePage(this.page);
  }

  getLogoutPage(): LogoutPage 
  {
    return new LogoutPage(this.page);
  }
}
