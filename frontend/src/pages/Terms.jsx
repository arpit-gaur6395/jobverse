import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  const lastUpdated = "March 15, 2024";

  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms of Service</h1>
        <p>Last updated: {lastUpdated}</p>
      </div>

      <div className="terms-content">
        <div className="terms-intro">
          <p>
            Welcome to JobVerse! These Terms of Service ("Terms") govern your use of our platform,
            services, and website. By accessing or using JobVerse, you agree to be bound by these Terms.
          </p>
        </div>

        <div className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account, accessing our platform, or using any JobVerse services, you acknowledge
            that you have read, understood, and agree to be bound by these Terms. If you do not agree to
            these Terms, you may not access or use our services.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. Description of Service</h2>
          <p>
            JobVerse is an online platform that connects job seekers with employers. Our services include:
          </p>
          <ul>
            <li>Job search and matching functionality</li>
            <li>Profile creation and management</li>
            <li>Job application submission</li>
            <li>Company profiles and job postings</li>
            <li>Career resources and tools</li>
            <li>Communication between job seekers and employers</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>3. User Accounts</h2>

          <h3>Registration</h3>
          <p>
            To use certain features of JobVerse, you must create an account. When registering, you agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information as needed</li>
            <li>Keep your password secure and confidential</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>

          <h3>Account Eligibility</h3>
          <p>
            You must be at least 18 years old and have the legal capacity to enter into contracts to create
            an account. By creating an account, you represent and warrant that you meet these requirements.
          </p>

          <h3>Account Termination</h3>
          <p>
            We reserve the right to suspend or terminate your account at any time for violations of these
            Terms or for any other reason at our sole discretion. You may also terminate your account at any
            time through your account settings.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. User Responsibilities</h2>

          <h3>For Job Seekers</h3>
          <p>As a job seeker using JobVerse, you agree to:</p>
          <ul>
            <li>Provide truthful and accurate information in your profile</li>
            <li>Only apply for positions you are genuinely interested in</li>
            <li>Respond to employer communications in a timely manner</li>
            <li>Respect the intellectual property rights of employers</li>
            <li>Not engage in fraudulent or deceptive practices</li>
          </ul>

          <h3>For Employers</h3>
          <p>As an employer using JobVerse, you agree to:</p>
          <ul>
            <li>Post accurate and truthful job descriptions</li>
            <li>Respond to qualified applicants in a reasonable timeframe</li>
            <li>Respect the privacy of job applicants</li>
            <li>Not discriminate based on protected characteristics</li>
            <li>Comply with all applicable employment laws</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>5. Prohibited Activities</h2>
          <p>You may not use JobVerse to:</p>
          <ul>
            <li>Post false, misleading, or fraudulent information</li>
            <li>Impersonate any person or entity</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Transmit viruses, malware, or other harmful code</li>
            <li>Spam or send unsolicited communications</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Use automated tools to access our platform</li>
            <li>Reverse engineer or attempt to discover our source code</li>
            <li>Interfere with or disrupt our services</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>6. Intellectual Property</h2>

          <h3>JobVerse Content</h3>
          <p>
            JobVerse and its content, features, and functionality are owned by JobVerse Inc. and are protected
            by copyright, trademark, and other intellectual property laws. You may not use our trademarks,
            logos, or other brand elements without our prior written consent.
          </p>

          <h3>User Content</h3>
          <p>
            You retain ownership of any content you submit to JobVerse. By submitting content, you grant us
            a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content for
            the purpose of providing our services.
          </p>

          <h3>Third-Party Content</h3>
          <p>
            Our platform may contain content from third parties. We are not responsible for third-party
            content and make no representations regarding its accuracy or reliability.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Privacy</h2>
          <p>
            Your privacy is important to us. Our collection and use of personal information is governed by
            our Privacy Policy, which is incorporated into these Terms by reference. By using JobVerse,
            you consent to the collection and use of your information as described in our Privacy Policy.
          </p>
        </div>

        <div className="terms-section">
          <h2>8. Fees and Payments</h2>

          <h3>Job Seeker Services</h3>
          <p>
            Basic job seeker services on JobVerse are provided free of charge. We may offer premium
            features for a fee, which will be clearly disclosed before purchase.
          </p>

          <h3>Employer Services</h3>
          <p>
            Employers may be required to pay fees for certain services, such as job postings, featured
            listings, or access to candidate databases. All fees are non-refundable unless otherwise stated.
          </p>

          <h3>Payment Terms</h3>
          <p>
            All payments must be made in accordance with our payment terms. We reserve the right to change
            our fees at any time, with notice to affected users.
          </p>
        </div>

        <div className="terms-section">
          <h2>9. Disclaimers</h2>
          <p>
            JobVerse is provided on an "as is" and "as available" basis. We make no representations or
            warranties of any kind, express or implied, including but not limited to:
          </p>
          <ul>
            <li>The accuracy, reliability, or completeness of job listings</li>
            <li>The suitability of candidates for specific positions</li>
            <li>The availability of jobs or the success of applications</li>
            <li>The uninterrupted or error-free operation of our platform</li>
            <li>The security of data transmitted through our services</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, JobVerse shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including but not limited to loss of profits, data,
            or use, arising out of or relating to these Terms or our services.
          </p>
          <p>
            Our total liability for any claims arising from these Terms shall not exceed the amount you paid
            to us in the twelve months preceding the claim, or $100, whichever is greater.
          </p>
        </div>

        <div className="terms-section">
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless JobVerse and its officers, directors, employees,
            and agents from and against any claims, liabilities, damages, losses, and expenses, including
            reasonable attorneys' fees, arising from your use of our services or violation of these Terms.
          </p>
        </div>

        <div className="terms-section">
          <h2>12. Dispute Resolution</h2>

          <h3>Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of
            California, without regard to its conflict of law principles.
          </p>

          <h3>Arbitration</h3>
          <p>
            Any disputes arising from these Terms or our services shall be resolved through binding
            arbitration in accordance with the rules of the American Arbitration Association. You waive
            your right to a jury trial and to participate in class actions.
          </p>
        </div>

        <div className="terms-section">
          <h2>13. Term and Termination</h2>
          <p>
            These Terms remain in effect as long as you use JobVerse. We may terminate or suspend your
            access to our services at any time, with or without cause, without prior notice.
          </p>
          <p>
            Upon termination, your right to use our services ceases immediately, but these Terms shall
            survive termination with respect to any obligations that accrued prior to termination.
          </p>
        </div>

        <div className="terms-section">
          <h2>14. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will notify you of material changes by posting the
            updated Terms on our platform and sending you an email notification. Your continued use of
            JobVerse after such changes constitutes acceptance of the modified Terms.
          </p>
        </div>

        <div className="terms-section">
          <h2>15. General Provisions</h2>
          <ul>
            <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and JobVerse.</li>
            <li><strong>Severability:</strong> If any provision is deemed unenforceable, the remaining provisions remain in full effect.</li>
            <li><strong>No Waiver:</strong> Our failure to enforce any provision does not constitute a waiver of that provision.</li>
            <li><strong>Assignment:</strong> You may not assign these Terms without our prior written consent.</li>
            <li><strong>Notices:</strong> All notices shall be sent to the email address associated with your account.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>16. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> legal@jobverse.com</p>
            <p><strong>Address:</strong> 123 Job Street, Career City, CC 12345</p>
            <p><strong>Phone:</strong> +1 (234) 567-890</p>
          </div>
        </div>

        <div className="terms-footer">
          <p>
            By using JobVerse, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
