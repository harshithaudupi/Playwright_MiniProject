import { expect } from '@playwright/test';

export class CreateAccountPage {
  /**
   * Constructor for the CreateAccountPage class.
   * @param {Page} page - The Playwright Page object.
   */
  constructor(page) {
    this.page = page;
    this.allLinksLocator = page.locator('a'); // Locator for all anchor tags
    this.termsAndConditionsLinkLocator = page.locator('a:has-text("terms and conditions")'); // Locator for the terms and conditions link
    this.privacyPolicyLinkLocator = page.locator('a:has-text("privacy policy")'); // Locator for the privacy policy link
    this.fullNameTextBoxLocator = page.getByPlaceholder('Enter your full name');
    this.rediffmailIdInputLocator = page.getByPlaceholder('Enter Rediffmail ID');
    this.checkAvailabilityButtonLocator = page.getByRole('button', { name: /Check Availability/i });
    this.passwordInputLocator = page.getByPlaceholder('Enter password');
    this.retypePasswordInputLocator = page.getByPlaceholder('Retype password');
    this.dobDaySelectLocator = page.locator('select[name^="DOB_Day"]');
    this.dobMonthSelectLocator = page.locator('select[name^="DOB_Month"]');
    this.dobYearSelectLocator = page.locator('select[name^="DOB_Year"]');
    this.genderMaleRadioLocator = page.getByRole('radio', { name: 'Male', exact: true });
    this.genderFemaleRadioLocator = page.getByRole('radio', { name: 'Female', exact: true });
    this.countrySelectLocator = page.locator('#country');
    this.citySelectLocator = page.locator('select[name^="city"]');

    this.securityQuestionSelectLocator = page.locator('select[name^="hintq"]');
    this.securityAnswerInputLocator = page.locator('input[name^="hinta"]');
    this.mothersMaidenNameInputLocator = page.locator('input[name^="mothername"]');
    this.mobileNumberInputLocator = page.locator('#mobno');
    this.createAccountButtonLocator = page.locator('input[name^="Register"]');
    this.checkIfAlternateLocator = page.locator('.nomargin');
  }

  /**
   * Retrieves the title of the current page.
   * @returns {Promise<string>} - A promise that resolves to the page title.
   */
  async getPageTitle() {
    return this.page.title();
  }

  /**
   * Retrieves all links on the page.
   * @returns {Locator} - The locator for all anchor tags on the page.
   */
  getAllLinks() {
    return this.allLinksLocator;
  }

  /**
   * Handles the Terms and Conditions link click and verifies the new window.
   * @returns {Promise<void>}
   */
  async handleTermsAndConditions(testInfo) {
    try {
      // Wait for a new page to open when the terms and conditions link is clicked
      const [newWindow] = await Promise.all([
        this.page.context().waitForEvent('page'), // Wait for the 'page' event, which indicates a new page is opened.
        this.termsAndConditionsLinkLocator.click(), // Click the terms and conditions link.
      ]);

      // Wait for the new window to load completely.
      await newWindow.waitForLoadState('load');
      // Wait for the body selector to be present in the new window.
      await newWindow.waitForSelector('body', { timeout: 10000 }); // Increased timeout for stability
      await newWindow.waitForTimeout(5000); // Add a small delay.

      // Get the title of the new window.
      const termsTitle = await newWindow.title();
      console.log(`Title of Terms and Conditions window: ${termsTitle}`);

      //takes screenshot of terms and conditions
      const screenshotBuffer = await newWindow.screenshot({ fullPage: true });
      await testInfo.attach('Terms and Conditions Screenshot', { body: screenshotBuffer, contentType: 'image/png' });

      // Assert that the title contains the expected text.
      expect(termsTitle).toContain('Rediffmail: Terms and Conditions');

      // Close the new window.
      await newWindow.close();

      // Bring the original page back to the front.
      await this.page.bringToFront();
    } catch (error) {
      console.error(`Error handling terms and conditions tab: ${error}`);
      throw error;
    }
  }

  /**
   * Handles the Privacy Policy link click and verifies the new window.
   * @returns {Promise<void>}
   */
  async handlePrivacyPolicy(testInfo) {
    try {
      // Wait for a new page to open when the privacy policy link is clicked
      const [newWindow] = await Promise.all([
        this.page.context().waitForEvent('page'), // Wait for the 'page' event.
        this.privacyPolicyLinkLocator.click(), // Click the privacy policy link.
      ]);

      // Wait for the new window to load.
      await newWindow.waitForLoadState('load');
      // Wait for the body selector.
      await newWindow.waitForSelector('body', { timeout: 10000 }); // Increased timeout
      await newWindow.waitForTimeout(1000); // Reduced the small delay.

      //takes screenshot of privacy policy
      const screenshotBuffer = await newWindow.screenshot({ fullPage: true });
      await testInfo.attach('Privacy Policy Screenshot', { body: screenshotBuffer, contentType: 'image/png' });

      // Get the title of the new window.
      const privacyTitle = await newWindow.title();
      console.log(`Title of Privacy Policy window: ${privacyTitle}`);

      // Assert that the title contains the expected text.
      expect(privacyTitle).toContain('Welcome to rediff.com');

      // To go to the end of the page
      await newWindow.keyboard.press("End");

      // Close the new window.
      await newWindow.close();

      // Bring the original page back to the front.
      await this.page.bringToFront();
    } catch (error) {
      console.error(`Error handling privacy policy tab: ${error}`);
      throw error;
    }
  }

  async enterFullName(fullName, testInfo) {
    try {
      await this.fullNameTextBoxLocator.fill(fullName);
      console.log(`Entered Full Name: ${fullName}`);
      await expect(this.fullNameTextBoxLocator).toHaveValue(fullName);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Enter Full Name', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error entering Full Name: ${error}`);
      throw error;
    }
  }

  async enterRediffmailId(id, testInfo) {
    try {
      await this.rediffmailIdInputLocator.fill(id);
      console.log(`Entered Rediffmail ID`);
      await expect(this.rediffmailIdInputLocator).toHaveValue(id);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Enter Rediffmail ID', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error entering Rediffmail ID: ${error}`);
      throw error;
    }
  }

  async clickCheckAvailability() {
    await this.checkAvailabilityButtonLocator.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.checkAvailabilityButtonLocator).toBeEnabled({ timeout: 10000 });
    await this.checkAvailabilityButtonLocator.click();
  
  }

  async enterPassword(password, testInfo) {
    try {
      await this.passwordInputLocator.fill(password);
      console.log(`Entered Password`);
      await expect(this.passwordInputLocator).toHaveValue(password);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Enter Password', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error entering Password: ${error}`);
      throw error;
    }
  }

  async enterRetypePassword(password, testInfo) {
    try {
      await this.retypePasswordInputLocator.fill(password);
      console.log(`Retyped Password`);
      await expect(this.retypePasswordInputLocator).toHaveValue(password);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Retype Password', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error retyping Password: ${error}`);
      throw error;
    }
  }

  async selectDobDay(day, testInfo) {
    try {
      await this.dobDaySelectLocator.selectOption(day);
      console.log(`Selected DOB Day`);
      await expect(this.dobDaySelectLocator).toHaveValue(day);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Select DOB Day', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error selecting DOB Day: ${error}`);
      throw error;
    }
  }

  async selectDobMonth(month, testInfo) {
    try {
      await this.dobMonthSelectLocator.selectOption(month);
      console.log(`Selected DOB Month`);
      await expect(this.dobMonthSelectLocator).toHaveValue(month);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Select DOB Month', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error selecting DOB Month: ${error}`);
      throw error;
    }
  }

  async selectDobYear(year, testInfo) {
    try {
      await this.dobYearSelectLocator.selectOption(year);
      console.log(`Selected DOB Year`);
      await expect(this.dobYearSelectLocator).toHaveValue(year);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Select DOB Year', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error selecting DOB Year: ${error}`);
      throw error;
    }
  }

  async selectGender(gender, testInfo) {
    try {
      if (gender.toLowerCase() === 'male') {
        await this.genderMaleRadioLocator.check();
        await expect(this.genderMaleRadioLocator).toBeChecked();
      } else if (gender.toLowerCase() === 'female') {
        await this.genderFemaleRadioLocator.check();
        await expect(this.genderFemaleRadioLocator).toBeChecked();
      }
      console.log(`Selected Gender`);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach(`Select Gender`, { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error selecting Gender: ${error}`);
      throw error;
    }
  }

  async selectCountry(countryValue, testInfo) {
    try {
      await this.countrySelectLocator.selectOption(countryValue);
      console.log(`Selected Country successfully`);
      await expect(this.countrySelectLocator).toHaveValue(countryValue);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach(`Select Country`, { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error selecting Country: ${error}`);
      throw error;
    }
  }

  async selectCity(cityValue, testInfo) {
    try {
      await this.citySelectLocator.selectOption(cityValue);
      console.log(`Selected City`);
      await expect(this.citySelectLocator).toHaveValue(cityValue);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach(`Select City`, { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error selecting City: ${error}`);
      throw error;
    }
  }


  async selectSecurityQuestion(question, testInfo) {
    try {
      await this.securityQuestionSelectLocator.selectOption({ label: question });
      console.log(`Selected Security Question`);
      await expect(this.securityQuestionSelectLocator).toHaveValue(question);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach(`Select Security Question`, { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error selecting Security Question: ${error}`);
      throw error;
    }
  }

  async enterSecurityAnswer(answer, testInfo) {
    try {
      await this.securityAnswerInputLocator.fill(answer);
      console.log(`Entered Security Answer`);
      await expect(this.securityAnswerInputLocator).toHaveValue(answer);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach(`Enter Security Answer`, { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error entering Security Answer: ${error}`);
      throw error;
    }
  }

  async enterMothersMaidenName(name, testInfo) {
    try {
      await this.mothersMaidenNameInputLocator.fill(name);
      console.log(`Entered Mother's Maiden Name`);
      await expect(this.mothersMaidenNameInputLocator).toHaveValue(name);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach(`Enter Mother's Maiden Name`, { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error entering Mother's Maiden Name: ${error}`);
      throw error;
    }
  }

  async enterMobileNumber(mobileNumber, testInfo) {
    try {
      await this.mobileNumberInputLocator.fill(mobileNumber);
      console.log(`Entered Mobile Number`);
      await expect(this.mobileNumberInputLocator).toHaveValue(mobileNumber);
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach(`Enter Mobile Number`, { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error entering Mobile Number: ${error}`);
      throw error;
    }
  }

  async clickCreateAccount() {
    await this.createAccountButtonLocator.click();
  }

  // Handling Checkboxes with Wait and Assertions
  async checkIfAlternateId(testInfo) {
    try {
      await this.checkIfAlternateLocator.check();
      console.log('Checked the Alternate ID checkbox.');
      await expect(this.checkIfAlternateLocator).toBeChecked();
      const screenshotBuffer = await this.page.screenshot();
      await testInfo.attach('Check Alternate ID Checkbox', { body: screenshotBuffer, contentType: 'image/png' });
    } catch (error) {
      console.error(`Error interacting with the Alternate ID checkbox: ${error}`);
      throw error;
    }
  }
}