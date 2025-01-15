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
          use, disclose, and safeguard your information when you use our mobile application.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <p>
          We collect information that you provide directly to us when you:
        </p>
        <ul>
          <li>Create an account</li>
          <li>Set up deal alerts</li>
          <li>Use our shopping features</li>
          <li>Contact our support team</li>
        </ul>
      </section>

      {/* Add more sections as needed */}
    </ContentPage>
  );
}