import { Page, Locator, expect} from '@playwright/test';

export class LoginPage
{
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly invalidCredentials: Locator;
    readonly requiredErrorMessages: Locator;

    constructor(page: Page)
    {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.invalidCredentials = page.getByText('Invalid credentials');
        this.requiredErrorMessages = page.getByText('Required');
    }

    async goTo(): Promise<void> 
    {
        await this.page.goto('/web/index.php/auth/login');
        await expect(this.page.locator('.orangehrm-login-slot')).toBeVisible({ timeout: 10000 });
    }

    async login(username: string, password: string): Promise<void> 
    {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    }

    async expectRequiredError(): Promise<void> 
    {
    await expect(this.requiredErrorMessages).toBeVisible();
    }

    async expectInvalidCredentials(): Promise<void> 
    {
    await expect(this.invalidCredentials).toBeVisible();
    }
}