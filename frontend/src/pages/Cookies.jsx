import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cookies = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytical: false,
    marketing: false
  });

  const lastUpdated = "March 15, 2024";

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Necessary cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    // In a real application, this would save to localStorage or backend
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="cookies-container">
      <div className="cookies-header">
        <h1>Cookie Policy</h1>
        <p>Last updated: {lastUpdated}</p>
      </div>

      <div className="cookies-content">
        <div className="cookies-intro">
          <p>
            This Cookie Policy explains how JobVerse uses cookies and similar technologies to enhance
            your experience on our platform. Learn about the types of cookies we use, why we use them,
            and how you can manage your preferences.
          </p>
        </div>

        <div className="cookies-section">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device (computer, tablet, or mobile)
            when you visit a website. They allow the website to remember your actions and preferences
            over time, which helps improve your browsing experience.
          </p>
          <p>
            Cookies serve various purposes, including keeping you logged in, remembering your preferences,
            and providing personalized content. They are widely used and do not harm your device.
          </p>
        </div>

        <div className="cookies-section">
          <h2>Types of Cookies We Use</h2>

          <h3>1. Necessary Cookies</h3>
          <p>
            These cookies are essential for the operation of our website and cannot be disabled. They
            enable basic functions like page navigation, access to secure areas, and authentication.
          </p>
          <ul>
            <li>Session cookies for maintaining your login state</li>
            <li>Security cookies for fraud prevention</li>
            <li>Load balancing cookies for site performance</li>
          </ul>

          <h3>2. Functional Cookies</h3>
          <p>
            These cookies enhance the functionality of our website by remembering your preferences and choices.
          </p>
          <ul>
            <li>Language and region preferences</li>
            <li>Display settings and theme preferences</li>
            <li>Remembering your job search filters</li>
            <li>Saved jobs and application status</li>
          </ul>

          <h3>3. Analytical Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our website by collecting and
            reporting information anonymously.
          </p>
          <ul>
            <li>Google Analytics for website traffic analysis</li>
            <li>Hotjar for user behavior analysis</li>
            <li>Custom analytics for feature usage</li>
            <li>Performance monitoring cookies</li>
          </ul>

          <h3>4. Marketing Cookies</h3>
          <p>
            These cookies are used to deliver advertisements that are relevant to you and your interests.
          </p>
          <ul>
            <li>Google Ads remarketing cookies</li>
            <li>Facebook Pixel for social media advertising</li>
            <li>LinkedIn Insight Tag for professional targeting</li>
            <li>Third-party advertising network cookies</li>
          </ul>
        </div>

        <div className="cookies-section">
          <h2>Why We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential Functionality:</strong> To keep you logged in and maintain your session</li>
            <li><strong>Personalization:</strong> To remember your preferences and provide relevant job recommendations</li>
            <li><strong>Analytics:</strong> To understand how our platform is used and improve our services</li>
            <li><strong>Security:</strong> To detect and prevent fraudulent activities</li>
            <li><strong>Advertising:</strong> To show relevant job opportunities and advertisements</li>
            <li><strong>Performance:</strong> To optimize website speed and reliability</li>
          </ul>
        </div>

        <div className="cookies-section">
          <h2>Third-Party Cookies</h2>
          <p>
            We use third-party services that may set their own cookies on your device. These include:
          </p>

          <h3>Analytics Services</h3>
          <ul>
            <li><strong>Google Analytics:</strong> Website traffic and user behavior analysis</li>
            <li><strong>Hotjar:</strong> Heatmaps and session recordings</li>
            <li><strong>Mixpanel:</strong> User engagement tracking</li>
          </ul>

          <h3>Advertising Services</h3>
          <ul>
            <li><strong>Google Ads:</strong> Search and display advertising</li>
            <li><strong>Facebook:</strong> Social media advertising</li>
            <li><strong>LinkedIn:</strong> Professional network advertising</li>
          </ul>

          <h3>Integration Services</h3>
          <ul>
            <li><strong>LinkedIn API:</strong> Profile import and authentication</li>
            <li><strong>Google OAuth:</strong> Account authentication</li>
            <li><strong>Stripe:</strong> Payment processing</li>
          </ul>
        </div>

        <div className="cookies-section">
          <h2>Cookie Duration</h2>
          <p>Cookies on our platform have different lifespans:</p>
          <ul>
            <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 1 year)</li>
            <li><strong>Authentication Cookies:</strong> Usually expire after 30 days of inactivity</li>
            <li><strong>Analytics Cookies:</strong> Typically expire after 2 years</li>
            <li><strong>Marketing Cookies:</strong> Vary by service, usually 30 days to 1 year</li>
          </ul>
        </div>

        <div className="cookie-preferences">
          <h2>Manage Your Cookie Preferences</h2>
          <p>
            Use the controls below to customize your cookie preferences. Please note that disabling
            certain cookies may affect your experience on our platform.
          </p>

          <div className="preference-options">
            <div className="preference-item">
              <div className="preference-header">
                <div className="preference-info">
                  <h3>Necessary Cookies</h3>
                  <p>Essential for website operation</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.necessary}
                    disabled
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <p className="preference-description">
                These cookies are required for basic website functionality and cannot be disabled.
              </p>
            </div>

            <div className="preference-item">
              <div className="preference-header">
                <div className="preference-info">
                  <h3>Functional Cookies</h3>
                  <p>Remember your preferences</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.functional}
                    onChange={() => handlePreferenceChange('functional')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <p className="preference-description">
                Enable these cookies to save your preferences and provide personalized features.
              </p>
            </div>

            <div className="preference-item">
              <div className="preference-header">
                <div className="preference-info">
                  <h3>Analytical Cookies</h3>
                  <p>Help us improve our services</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytical}
                    onChange={() => handlePreferenceChange('analytical')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <p className="preference-description">
                Allow us to collect anonymous usage data to improve our platform.
              </p>
            </div>

            <div className="preference-item">
              <div className="preference-header">
                <div className="preference-info">
                  <h3>Marketing Cookies</h3>
                  <p>Show relevant advertisements</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <p className="preference-description">
                Enable personalized advertising based on your interests and browsing behavior.
              </p>
            </div>
          </div>

          <div className="preference-actions">
            <button onClick={savePreferences} className="save-btn">
              Save Preferences
            </button>
            <button
              onClick={() => setCookiePreferences({
                necessary: true,
                functional: true,
                analytical: true,
                marketing: true
              })}
              className="accept-all-btn"
            >
              Accept All
            </button>
            <button
              onClick={() => setCookiePreferences({
                necessary: true,
                functional: false,
                analytical: false,
                marketing: false
              })}
              className="reject-all-btn"
            >
              Reject All
            </button>
          </div>
        </div>

        <div className="cookies-section">
          <h2>Managing Cookies in Your Browser</h2>
          <p>
            You can control and manage cookies through your browser settings. Most browsers allow you to:
          </p>
          <ul>
            <li>View all cookies stored on your device</li>
            <li>Delete existing cookies</li>
            <li>Block all cookies or only third-party cookies</li>
            <li>Set notifications when cookies are created</li>
            <li>Create exceptions for specific websites</li>
          </ul>

          <h3>Browser-Specific Instructions</h3>
          <ul>
            <li><strong>Chrome:</strong> Settings {'>'} Privacy and security {'>'} Cookies and other site data</li>
            <li><strong>Firefox:</strong> Options {'>'} Privacy & Security {'>'} Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences {'>'} Privacy {'>'} Cookies and website data</li>
            <li><strong>Edge:</strong> Settings {'>'} Privacy, search, and services {'>'} Cookies</li>
          </ul>
        </div>

        <div className="cookies-section">
          <h2>Cookie Policy Updates</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices,
            technologies, or legal requirements. We will notify you of any material changes by:
          </p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending an email notification to registered users</li>
            <li>Displaying a prominent notice on our platform</li>
          </ul>
        </div>

        <div className="cookies-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Cookie Policy or how we use cookies, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> privacy@jobverse.com</p>
            <p><strong>Address:</strong> 123 Job Street, Career City, CC 12345</p>
            <p><strong>Phone:</strong> +1 (234) 567-890</p>
          </div>
        </div>

        <div className="cookies-footer">
          <p>
            By continuing to use JobVerse, you consent to our use of cookies as described in this policy.
          </p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
