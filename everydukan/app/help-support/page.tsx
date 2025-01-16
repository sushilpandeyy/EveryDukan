import { Metadata } from 'next';
import ContentPage from '../components/ContentPage';

export const metadata: Metadata = {
  title: 'Help & Support',
  description: 'Get help and support for your EveryDukan app experience',
  openGraph: {
    title: 'Help & Support - EveryDukan',
    description: 'Find answers to common questions and get support for EveryDukan',
  },
};

export default function HelpSupport() {
  return (
    <ContentPage
      title="Help & Support"
      lastUpdated="January 16, 2025"
    >
      <section>
        <h2>Getting Started</h2>
        <p>
          Welcome to EveryDukan's Help & Support Center. Here you'll find everything you need to make
          the most of your shopping experience. If you can't find what you're looking for, our support
          team is always ready to help.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <h3>Account Management</h3>
        <ul>
          <li>How do I create an account? Sign up using your email address or continue with Google/Facebook</li>
          <li>How can I reset my password? Use the "Forgot Password" link on the login screen</li>
          <li>How do I update my profile? Go to Settings {'>'} Profile to update your information</li>
          <li>Can I have multiple accounts? We recommend maintaining just one account per user</li>
        </ul>

        <h3>Shopping Features</h3>
        <ul>
          <li>How do deal alerts work? Set up preferences to receive notifications for deals you're interested in</li>
          <li>How can I save my favorite stores? Click the heart icon on any store page to save it</li>
          <li>Where do I find my saved deals? Access your saved items in the "Favorites" section</li>
          <li>How do I share deals with friends? Use the share button on any deal to send via messaging apps</li>
        </ul>
      </section>

      <section>
        <h2>Contact Support</h2>
        <p>
          Need additional help? Our support team is available:
        </p>
        <ul>
          <li>Email: contact.sushilpandey@gmail.com</li>
        </ul>
      </section>

      <section>
        <h2>App Troubleshooting</h2>
        <h3>Common Issues and Solutions</h3>
        <ul>
          <li>App Crashes: Clear cache and restart the app; ensure you have the latest version</li>
          <li>Login Problems: Check your internet connection and verify your credentials</li>
          <li>Missing Deals: Pull down to refresh the deals page for the latest updates</li>
          <li>Notification Issues: Check your device settings and ensure notifications are enabled</li>
        </ul>
      </section>

      <section>
        <h2>Feature Guides</h2>
        <h3>Deal Alerts</h3>
        <p>
          Get notified about the best deals:
        </p>
        <ul>
          <li>Set up personalized alerts based on categories, brands, or price ranges</li>
          <li>Customize notification frequency to avoid alert fatigue</li>
          <li>Use location-based alerts to find deals near you</li>
          <li>Save searches to create automatic deal alerts</li>
        </ul>

        <h3>Price Tracking</h3>
        <p>
          Monitor prices for your favorite items:
        </p>
        <ul>
          <li>Add items to your price watch list for automatic tracking</li>
          <li>Set target prices to get notified when prices drop</li>
          <li>View price history graphs for informed buying decisions</li>
          <li>Compare prices across different stores</li>
        </ul>
      </section>

      <section>
        <h2>Security Tips</h2>
        <p>
          Keep your account secure:
        </p>
        <ul>
          <li>Use a strong, unique password for your account</li>
          <li>Enable two-factor authentication for additional security</li>
          <li>Never share your login credentials with others</li>
          <li>Log out when using shared devices</li>
        </ul>
      </section>

      <section>
        <h2>Feedback & Suggestions</h2>
        <p>
          Help us improve EveryDukan:
        </p>
        <ul>
          <li>Submit feature requests through the app's feedback form</li>
          <li>Report bugs or issues to our technical team</li>
          <li>Participate in our user research programs</li>
          <li>Rate us on the App Store or Play Store</li>
        </ul>
      </section>

      <section>
        <h2>Business Partnerships</h2>
        <p>
          For business inquiries and partnerships:
        </p>
        <ul>
          <li>Email: partnerships@everydukan.com</li>
          <li>Visit our Business Portal: business.everydukan.com</li>
          <li>Schedule a demo: calendly.com/everydukan-demo</li>
        </ul>
      </section>

      <section>
        <h2>Legal Resources</h2>
        <p>
          Important legal information:
        </p>
        <ul>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Return Policy</li>
          <li>Community Guidelines</li>
        </ul>
      </section>
    </ContentPage>
  );
}