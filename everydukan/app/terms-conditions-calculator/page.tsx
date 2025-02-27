import { Metadata } from 'next';
import ContentPage from '../components/ContentPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for Calculator Vault App - Understand your rights and responsibilities while using our app.',
  openGraph: {
    title: 'Terms & Conditions - Calculator Vault App',
    description: 'Read the terms and conditions governing the use of Calculator Vault App.',
  },
};

export default function TermsAndConditions() {
  return (
    <ContentPage
      title="Terms & Conditions"
      lastUpdated="February 27, 2025"
    >
      <section>
        <h2>Introduction</h2>
        <p>
          Welcome to Calculator Vault App. By accessing or using our application, you agree to be bound by these Terms and Conditions. If you do not agree with these terms, please refrain from using the app.
        </p>
      </section>

      <section>
        <h2>Eligibility</h2>
        <p>
          You must be at least 13 years old to use this app. If you are under 18, you may only use this app under parental supervision. By using this app, you confirm that you meet these eligibility requirements.
        </p>
      </section>

      <section>
        <h2>Use of the App</h2>
        <p>
          The Calculator Vault App is designed to securely store and manage private files, including photos and videos. You agree not to:
        </p>
        <ul>
          <li>Use the app for illegal, harmful, or unauthorized purposes.</li>
          <li>Violate any applicable laws or regulations.</li>
          <li>Store or distribute explicit, abusive, or unlawful content.</li>
          <li>Attempt to bypass security measures or access data that does not belong to you.</li>
          <li>Engage in fraudulent activities, hacking, or unauthorized access to the app or third-party systems.</li>
        </ul>
      </section>

      <section>
        <h2>Permissions and Data Usage</h2>
        <p>
          The app may require the following permissions to function properly:
        </p>
        <ul>
          <li><strong>Storage Access:</strong> To save and retrieve hidden files.</li>
          <li><strong>Camera Access:</strong> If you choose to capture photos or videos directly within the app.</li>
          <li><strong>Biometric Authentication:</strong> To enhance security using fingerprint or facial recognition.</li>
        </ul>
        <p>
          We do not collect or store personal data on external servers. All data remains on the user's device. For more details, please refer to our <a href="/privacy-policy-calculator">Privacy Policy</a>.
        </p>
      </section>

      <section>
        <h2>Security and Data Protection</h2>
        <p>
          We take security seriously and implement industry-standard encryption to protect user data. However, we cannot guarantee absolute security. Users are responsible for keeping their access credentials safe.
        </p>
      </section>

      <section>
        <h2>Third-Party Services</h2>
        <p>
          The Calculator Vault App may integrate third-party services such as Google AdMob for advertising and Google Sign-In for authentication. These services are subject to their respective terms and privacy policies.
        </p>
      </section>

      <section>
        <h2>Account and Data Deletion</h2>
        <p>
          Users can delete their accounts at any time. To remove all stored data, please submit a request using our <a href="https://forms.gle/TRaPvfMnuU28aR3C8" target="_blank">Account Deletion Request Form</a>. Deleting your account is irreversible, and we do not retain any backup of your data.
        </p>
      </section>

      <section>
        <h2>Compliance with Google Play Policies</h2>
        <p>
          Our app complies with Google Play Store policies, including content policies, data privacy policies, and security guidelines. We ensure that our app does not promote or distribute restricted content, malware, or deceptive functionality.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          We strive to provide a secure and reliable app, but we do not guarantee error-free functionality. We are not liable for any data loss, unauthorized access, or damage resulting from the use of our app. Users assume all risks associated with using the app.
        </p>
      </section>

      <section>
        <h2>Termination</h2>
        <p>
          We reserve the right to terminate or restrict access to the app if users violate these terms. Any attempt to misuse the app or breach security measures may result in permanent suspension.
        </p>
      </section>

      <section>
        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms and Conditions periodically. Any modifications will be posted within the app, and continued use of the app constitutes acceptance of the updated terms.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms and Conditions, please contact us at:
        </p>
        <ul>
          <li>Email: contact.sushilpandey@gmail.com</li>
        </ul>
      </section>
    </ContentPage>
  );
}
