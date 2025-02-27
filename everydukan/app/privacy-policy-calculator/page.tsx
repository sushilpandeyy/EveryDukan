import { Metadata } from 'next';
import ContentPage from '../components/ContentPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Calculator App - Securely save and share your photos and videos.',
  openGraph: {
    title: 'Privacy Policy - Calculator App',
    description: 'Learn how Calculator App protects your privacy and secures your data.',
  },
};

export default function PrivacyPolicy() {
  return (
    <ContentPage
      title="Privacy Policy"
      lastUpdated="February 27, 2025"
    >
      <section>
        <h2>Introduction</h2>
        <p>
          Welcome to Calculator App. Your privacy is important to us. This Privacy Policy explains how we
          handle your personal information when you use our app to securely store and share photos or videos.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <p>
          We do not collect or store any personally identifiable information (PII). The app operates
          without storing user data on external servers. However, we may use the following services:
        </p>
        <ul>
          <li><strong>Google Login:</strong> Used for authentication purposes only.</li>
          <li><strong>Secure PIN:</strong> Stored locally on your device to protect hidden files.</li>
          <li><strong>Hidden Files:</strong> Photos and videos are securely stored within your device and not uploaded to any server.</li>
          <li><strong>AdMob Ads:</strong> Google AdMob may collect anonymous usage data for ad personalization.</li>
        </ul>
      </section>

      <section>
        <h2>How Your Data is Secured</h2>
        <p>
          We use industry-standard encryption to ensure that your hidden files remain secure on your device.
          Your data is never transmitted to external servers or shared with third parties.
        </p>
      </section>

      <section>
        <h2>Permissions Required</h2>
        <p>
          To provide core functionality, the app may request the following permissions:
        </p>
        <ul>
          <li>Storage Access: To save and retrieve hidden files.</li>
          <li>Camera: If you choose to capture photos or videos directly within the app.</li>
        </ul>
      </section>

      <section>
        <h2>Third-Party Services</h2>
        <p>
          We may use third-party services for authentication and advertisements, including:
        </p>
        <ul>
          <li><strong>Google AdMob:</strong> Displays ads and may collect anonymous usage statistics.</li>
          <li><strong>Google Sign-In:</strong> Used solely for authentication purposes.</li>
        </ul>
      </section>

      <section>
        <h2>Account and Data Deletion</h2>
        <p>
          Users can delete their accounts and stored data at any time:
        </p>
        <ul>
          <li>Account deletion can be initiated from the app settings.</li>
          <li>Hidden files are removed upon user action and cannot be recovered.</li>
          <li>We do not retain any backup of user data.</li>
        </ul>
      </section>

      <section>
        <h2>Children's Privacy</h2>
        <p>
          The Calculator App is not intended for users under the age of 13. We do not knowingly collect
          any data from children.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted within the app.
          Continued use of the app after changes take effect means you accept the updated policy.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: contact.sushilpandey@gmail.com</li>
        </ul>
      </section>
    </ContentPage>
  );
}