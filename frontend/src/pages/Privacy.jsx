import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const lastUpdated = "March 15, 2024";

  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: {lastUpdated}</p>
      </div>

      <div className="privacy-content">
        <div className="privacy-intro">
          <p>
            At JobVerse, we are committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, share, and protect your information when you use our platform.
          </p>
        </div>

        <div className="privacy-section">
          <h2>1. Information We Collect</h2>

          <h3>Personal Information</h3>
          <p>
            When you create an account or use our services, we may collect the following types of personal information:
          </p>
          <ul>
            <li>Name, email address, phone number, and contact details</li>
            <li>Professional information including resume, work history, and skills</li>
            <li>Education background and certifications</li>
            <li>Job preferences and career interests</li>
            <li>Profile information and photos</li>
            <li>Communication preferences</li>
          </ul>

          <h3>Usage Information</h3>
          <p>
            We automatically collect information about how you interact with our platform:
          </p>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and operating system</li>
            <li>Pages visited and time spent on our platform</li>
            <li>Search queries and job applications</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h3>Third-Party Information</h3>
          <p>
            We may collect information about you from third-party sources such as:
          </p>
          <ul>
            <li>Social media platforms when you connect your accounts</li>
            <li>Professional networks and job boards</li>
            <li>Background check services (with your consent)</li>
            <li>Reference checks (with your consent)</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain our job matching services</li>
            <li>Connect you with relevant job opportunities</li>
            <li>Personalize your experience on our platform</li>
            <li>Communicate with you about job applications and updates</li>
            <li>Improve our services and develop new features</li>
            <li>Ensure platform security and prevent fraud</li>
            <li>Comply with legal obligations</li>
            <li>Analyze usage patterns to optimize our platform</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>3. Information Sharing</h2>

          <h3>With Employers</h3>
          <p>
            We share your profile information with employers when you apply for jobs or when your profile matches
            their requirements. You can control what information is shared through your privacy settings.
          </p>

          <h3>With Service Providers</h3>
          <p>
            We work with third-party service providers to help us operate our platform, including:
          </p>
          <ul>
            <li>Cloud hosting and data storage services</li>
            <li>Payment processing providers</li>
            <li>Email and communication services</li>
            <li>Analytics and measurement tools</li>
            <li>Customer support platforms</li>
          </ul>

          <h3>Legal Requirements</h3>
          <p>
            We may disclose your information if required by law or in good faith belief that such action is necessary to:
          </p>
          <ul>
            <li>Comply with legal obligations</li>
            <li>Protect and defend our rights and property</li>
            <li>Prevent fraud or protect the safety of our users</li>
            <li>Respond to legal requests and court orders</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information, including:
          </p>
          <ul>
            <li>SSL encryption for data transmission</li>
            <li>Secure data storage with encryption at rest</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication systems</li>
            <li>Employee training on data protection</li>
          </ul>
          <p>
            However, no method of transmission over the internet is 100% secure. While we strive to protect
            your personal information, we cannot guarantee absolute security.
          </p>
        </div>

        <div className="privacy-section">
          <h2>5. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Restriction:</strong> Limit how we use your information</li>
            <li><strong>Objection:</strong> Object to certain uses of your information</li>
          </ul>
          <p>
            To exercise these rights, please contact us at privacy@jobverse.com. We will respond to your request
            within the timeframe required by applicable law.
          </p>
        </div>

        <div className="privacy-section">
          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience on our platform. Cookies help us:
          </p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Keep you logged in to your account</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Personalize content and recommendations</li>
            <li>Provide relevant job suggestions</li>
          </ul>
          <p>
            You can control cookies through your browser settings. However, disabling cookies may affect
            the functionality of our platform.
          </p>
        </div>

        <div className="privacy-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to provide our services and comply
            with legal obligations. The specific retention periods vary based on the type of information and
            the purpose for which it was collected.
          </p>
          <p>
            When you delete your account, we will remove your personal information from our active databases
            within 30 days, except where we are required to retain certain information for legal or business purposes.
          </p>
        </div>

        <div className="privacy-section">
          <h2>8. International Data Transfers</h2>
          <p>
            JobVerse operates globally and may transfer your personal information to countries other than
            your own. We ensure that such transfers comply with applicable data protection laws by using
            appropriate safeguards such as standard contractual clauses.
          </p>
        </div>

        <div className="privacy-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect
            personal information from children under 18. If we become aware that we have collected information
            from a child under 18, we will take steps to delete such information immediately.
          </p>
        </div>

        <div className="privacy-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            legal requirements, or business operations. We will notify you of any material changes by:
          </p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending an email notification to registered users</li>
            <li>Displaying a prominent notice on our platform</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your personal information,
            please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> privacy@jobverse.com</p>
            <p><strong>Address:</strong> 123 Job Street, Career City, CC 12345</p>
            <p><strong>Phone:</strong> +1 (234) 567-890</p>
          </div>
        </div>

        <div className="privacy-footer">
          <p>
            By using JobVerse, you acknowledge that you have read, understood, and agree to this Privacy Policy.
          </p>
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
