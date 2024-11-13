import FirecrawlApp from '@mendable/firecrawl-js';
import { OpenAIService } from './OpenAIService';

const LOGIN_URL = 'http://xyz.ag3nts.org';
const USERNAME = 'tester';
const PASSWORD = '574e112a';

async function login() {
  try {
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY || ''
    });
    const openAIService = new OpenAIService();

    // First, let's get the login page with specific scraping options
    const loginPage = await firecrawl.scrapeUrl(LOGIN_URL, {
      formats: ['html'],
      includeTags: ['#human-question'],
      excludeTags: ['script', 'style', 'noscript']
    });

    if (!loginPage || !loginPage.html) {
      throw new Error('Could not fetch login page');
    }

    // Extract the captcha question from the #human-question element
    const captchaQuestion = loginPage.html.trim();
    if (!captchaQuestion) {
      throw new Error('Could not find captcha question');
    }

    console.log('Captcha Question:', captchaQuestion);

    // Use OpenAI to analyze the captcha question and get the answer
    const captchaAnswer = await openAIService.analyzeCaptcha(captchaQuestion);
    if (!captchaAnswer) {
      throw new Error('Could not determine captcha answer');
    }
    console.log('Captcha Answer:', captchaAnswer);

    // Prepare the form data
    const formData = new URLSearchParams();
    formData.append('username', USERNAME);
    formData.append('password', PASSWORD);
    formData.append('answer', captchaAnswer);

    console.log('Form Data:', formData.toString());

    // Submit the form using fetch
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Read the response body
    const responseText = await response.text();

    console.log('Response URL:', response.url);
    console.log('Response Body:', responseText);

    // If the response contains a URL, try to extract it
    try {
      const urlMatch = responseText.match(/https?:\/\/[^\s<>"']+/);
      if (urlMatch) {
        console.log('Found URL in response:', urlMatch[0]);
      }
    } catch (error) {
      console.error('Error extracting URL from response:', error);
    }

  } catch (error) {
    console.error('Login process failed:', error);
    throw error;
  }
}

// Run the login process
login().catch(console.error);