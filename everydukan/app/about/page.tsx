// app/about/page.tsx
import { Metadata } from 'next';
import ContentPage from '../components/ContentPage';

export const metadata: Metadata = {
  title: 'About EveryDukan',
  description: 'Learn about EveryDukan and our mission to help you save on Indian D2C brands',
  openGraph: {
    title: 'About EveryDukan - Your Shopping Companion',
    description: 'Discover how EveryDukan helps you find the best deals on Indian D2C brands',
  },
};

export default function AboutUs() {
  return (
    <ContentPage
      title="About EveryDukan"
      lastUpdated="January 16, 2025"
    >
      <section>
        <h2>Our Mission</h2>
        <p>
          EveryDukan is on a mission to revolutionize how people shop from Indian D2C brands.
          We bring you the best deals, exclusive discounts, and smart shopping recommendations
          all in one place.
        </p>
      </section>

      <section>
        <h2>Our Story</h2>
        <p>
          Founded in 2025, EveryDukan emerged from a simple observation: shopping from
          multiple D2C brands shouldn't be complicated. We built a platform that makes
          it easy to discover and save on your favorite brands.
        </p>
      </section>

      {/* Add more sections as needed */}
    </ContentPage>
  );
}