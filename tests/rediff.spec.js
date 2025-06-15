import { test, expect } from '@playwright/test';
// Import the HomePage class
import { HomePage } from '../POM/HomePage'; 
// Import the CreateAccountPage class
import { CreateAccountPage } from '../POM/CreateAccountPage'; 
// Import the fs (file system) module for file operations
import * as fs from 'fs/promises'; 
// Import the path module for working with file paths
import * as path from 'path'; 

test.describe('Rediff Account Multiple Window Test', () => {
  // Declare a variable to hold the HomePage instance
  let homePage; 
  // Declare a variable to hold the CreateAccountPage instance
  let createAccountPage; 
  // Declare a variable to hold the Playwright Page object
  let page; 

  // This hook runs before each test in this describe block
  test.beforeEach(async ({ page: contextPage }) => {
    // Assign the page object to the 'page' variable
    page = contextPage; 
     // Create a new HomePage instance, passing the page object
    homePage = new HomePage(page);
    // Create a new CreateAccountPage instance, passing the page object
    createAccountPage = new CreateAccountPage(page); 
    await homePage.goToRediffPage(); // Navigate to the Rediff homepage
    await homePage.navigateToCreateAccount(); // Navigate to the Create Account page
    await page.waitForLoadState('domcontentloaded'); // Wait for the DOM content to be loaded
  });

  // Test case 1: Validate Create Account Page Title and Store Links
  test('Validate Create Account Page Title and Store Links', async () => {
    const title = await createAccountPage.getPageTitle();
    expect(title).toContain('Rediffmail Free Unlimited Storage');

    const linksLocator = homePage.getAllLinks();
    const links = await linksLocator.all();
    const totalLinks=links.length;
    const linksData = [];
   

    for (const link of links) {
        try {
            const text = await link.textContent();
            const href = await link.getAttribute('href');
            // Check if the text is empty or contains only whitespace
            const linkText = (text.trim() === "") ? "Home" : text.trim();
            linksData.push({ text: linkText, href });
        } catch (error) {
            console.error('Error getting link details:', error);
        }
    }
    console.log(`Total number of links on Create Account page: ${totalLinks}`); // Log total links

    const filePath = path.join(__dirname, '../', 'outputs', 'create_acc_links.json'); // Path for storing links
    try {
            await fs.writeFile(filePath, JSON.stringify(linksData, null, 2));
            console.log(`Links data stored in ${filePath}`);
    } 
    catch (error) {
            console.error('Error writing to links.json:', error);
        }
    });
  
  // Test case 2: Handle Terms and Conditions Window
  test('Handle Terms and Conditions Window', async ({}, testInfo) => {
    // Call the handleTermsAndConditions method from CreateAccountPage
    await createAccountPage.handleTermsAndConditions(testInfo); 
  });
  
  // Test case 3: Interact With Multiple Windows
  test('Interact with Multiple Windows', async ({}, testInfo) => {
    await createAccountPage.handleTermsAndConditions(testInfo); // Handle Terms and Conditions window
    await createAccountPage.handlePrivacyPolicy(testInfo); // Handle Privacy Policy window
  });

  // Test case 4: Handling input fields and checkbox
  test('Handling input fields and checkbox using JSON data', async ({}, testInfo) => {
    try {
      const jsonFilePath = path.join(__dirname, '../', 'inputs', 'createAccountInputs.json');
      const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
      const inputData = JSON.parse(jsonData);

      await createAccountPage.enterFullName(inputData.fullName, testInfo);
     
      await createAccountPage.enterRediffmailId(inputData.rediffmailId, testInfo);
      await createAccountPage.clickCheckAvailability(); // No testInfo needed here as it just clicks
      await createAccountPage.enterPassword(inputData.password, testInfo);
      await createAccountPage.enterRetypePassword(inputData.password, testInfo);
      await createAccountPage.selectDobDay(inputData.dobDay, testInfo);
      await createAccountPage.selectDobMonth(inputData.dobMonth, testInfo);
      await createAccountPage.selectDobYear(inputData.dobYear, testInfo);
      await createAccountPage.selectGender(inputData.gender, testInfo);
      await createAccountPage.selectCountry(inputData.country, testInfo);

      const cityVisible = await createAccountPage.citySelectLocator.isVisible();
      if (cityVisible) {
        await createAccountPage.selectCity(inputData.city, testInfo);
      }
      await createAccountPage.checkIfAlternateId(testInfo);
  
      await createAccountPage.selectSecurityQuestion(inputData.securityQuestion, testInfo);
      await createAccountPage.enterSecurityAnswer(inputData.securityAnswer, testInfo);
      await createAccountPage.enterMothersMaidenName(inputData.mothersMaidenName, testInfo);
      await createAccountPage.enterMobileNumber(inputData.mobileNumber, testInfo);
    

    } catch (error) {
      console.error(`Error handling input fields with JSON data: ${error}`);
      throw error;
    }
  });

  

});
