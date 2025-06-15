
export class HomePage {
    /**
     * Constructor for the HomePage class.
     * @param {Page} page - The Playwright Page object.
     */
    constructor(page) {
      this.page = page;
      this.createAccountLinkLocator = page.locator('a', { hasText: 'Create Account' }); // Locator for the 'Create Account' link
      this.allLinksLocator = page.locator('a'); // Locator for all links on the page
    }
  
    /**
     * Navigates to the Rediff homepage.
     * @returns {Promise<void>}
     */
    async goToRediffPage() {
      await this.page.goto('https://www.rediff.com/', { waitUntil: 'load' }); // Go to the Rediff homepage and wait for it to load
    }
  
    /**
     * Navigates to the Create Account page by clicking the 'Create Account' link.
     * @returns {Promise<void>}
     */
  async navigateToCreateAccount() {
    await this.createAccountLinkLocator.waitFor({ state: 'visible', timeout: 15000 });
    await this.createAccountLinkLocator.click();
    console.log('Clicked the Create Account link.');
  }
  
    /**
     * Retrieves all links on the page.
     * @returns {Locator} - The locator for all anchor tags on the page.
     */
    getAllLinks() {
      return this.allLinksLocator; // Returns the locator for all links
    }
  
    /**
     * Retrieves the title of the current page.
     * @returns {Promise<string>} - A promise that resolves to the page title.
     */
    async getPageTitle() {
      return this.page.title(); // Returns the title of the current page
    }
  
    /**
     * Retrieves the number of links on the page.
     * @returns {Promise<number>} - A promise that resolves to the number of links.
     */
    async getLinksCount() {
      return await this.allLinksLocator.count(); // Returns the number of links found by the locator
    }
  }
  