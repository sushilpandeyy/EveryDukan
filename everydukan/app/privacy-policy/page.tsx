// app/privacy-policy/page.tsx
import { Metadata } from 'next';
import ContentPage from '../components/ContentPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy and data handling practices for EveryDukan app',
  openGraph: {
    title: 'Privacy Policy - EveryDukan',
    description: 'Learn about how we handle and protect your data at EveryDukan',
  },
};

export default function PrivacyPolicy() {
  return (
    <ContentPage
      title="Privacy Policy"
      lastUpdated="January 16, 2025"
    >
      <section>
        <h2>Introduction</h2>
        <p>
          At EveryDukan, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our mobile application and services.
          Please read this Privacy Policy carefully. By using EveryDukan, you agree to the collection
          and use of information in accordance with this policy.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <h3>1. Information You Provide to Us</h3>
        <p>When you use EveryDukan, you may provide us with:</p>
        <ul>
          <li>Account Information: Name, email address, and password when you create an account</li>
          <li>Profile Information: Shopping preferences, favorite brands, and categories</li>
          <li>Communication Data: Messages when you contact our support team</li>
          <li>User Preferences: Deal alerts and notification settings</li>
        </ul>

        <h3>2. Information Automatically Collected</h3>
        <p>When you use our app, we automatically collect:</p>
        <ul>
          <li>Device Information: Device type, operating system, and unique device identifiers</li>
          <li>Usage Data: How you interact with our app, including features used and time spent</li>
          <li>Location Data: Approximate location (if permitted) to show relevant deals</li>
          <li>Log Data: IP address, browser type, pages visited, and access times</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <p>We use the collected information for:</p>
        <ul>
          <li>Providing and personalizing our services</li>
          <li>Sending deal alerts and notifications you've requested</li>
          <li>Improving and optimizing our app performance</li>
          <li>Communicating with you about updates and support</li>
          <li>Preventing fraud and ensuring security</li>
          <li>Analyzing usage patterns to enhance user experience</li>
        </ul>
      </section>

      <section>
        <h2>Information Sharing and Disclosure</h2>
        <p>We may share your information with:</p>
        <ul>
          <li>Service Providers: Companies that help us operate our services</li>
          <li>Partner Brands: Only when you explicitly choose to interact with their offers</li>
          <li>Legal Requirements: When required by law or to protect our rights</li>
        </ul>
        <p>
          We do not sell your personal information to third parties.
        </p>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your 
          information. However, no electronic transmission or storage system is 100% secure, and we 
          cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>Your Rights and Choices</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Update or correct your information</li>
          <li>Delete your account and associated data</li>
          <li>Opt-out of marketing communications</li>
          <li>Control app permissions (location, notifications, etc.)</li>
        </ul>
      </section>

      <section>
        <h2>Children's Privacy</h2>
        <p>
          EveryDukan does not knowingly collect or solicit information from anyone under the age of 13. 
          If we learn that we have collected personal information from a child under 13, we will delete 
          that information as quickly as possible.
        </p>
      </section>

      <section>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by 
          posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
          advised to review this Privacy Policy periodically for any changes.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our practices, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@everydukan.com</li>
          <li>Address: [Your Company Address]</li>
        </ul>
      </section>

      <section>
        <h2>App Store Specific Information</h2>
        <h3>Data Collection and Use</h3>
        <p>
          Our app collects the following data types as defined by the App Store Privacy Details:
        </p>
        <ul>
          <li>Contact Info: Email address</li>
          <li>Identifiers: Device ID</li>
          <li>Usage Data: Product interaction</li>
          <li>Diagnostics: Crash data</li>
        </ul>
        <p>
          This data is used to provide and improve our services, and is handled in accordance with 
          this privacy policy.
        </p>
      </section>

      <section>
        <h2>Third-Party Services</h2>
        <p>
          Our app uses third-party services that may collect information. Links to the privacy policies 
          of third-party service providers used in the app:
        </p>
        <ul>
          <li>Google Analytics for Firebase</li>
          <li>Firebase Crashlytics</li>
          <li>AppsFlyer</li>
        </ul>
      </section>
    </ContentPage>
  );
}