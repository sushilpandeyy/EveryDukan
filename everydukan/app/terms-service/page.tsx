// app/terms-conditions/page.tsx
import { Metadata } from 'next';
import ContentPage from '../components/ContentPage';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using the EveryDukan app',
  openGraph: {
    title: 'Terms & Conditions - EveryDukan',
    description: 'Read our terms and conditions for using EveryDukan services',
  },
};

export default function TermsAndConditions() {
  return (
    <ContentPage
      title="Terms & Conditions"
      lastUpdated="January 16, 2025"
    >
      <section>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using EveryDukan, you accept and agree to be bound by the terms
          and provision of this agreement.
        </p>
      </section>

      <section>
        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of EveryDukan mobile
          application for personal, non-commercial transitory viewing only.
        </p>
      </section>

      {/* Add more sections as needed */}
    </ContentPage>
  );
}