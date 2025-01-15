// app/components/ContentPage.tsx
'use client';
import { FC } from 'react';

interface ContentPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const ContentPage: FC<ContentPageProps> = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="text-sm text-gray-500 border-b border-gray-200 pb-6">
              Last updated: {lastUpdated}
            </p>
          </header>

          {/* Content */}
          <div className="content-wrapper">
            <style jsx>{`
              .content-wrapper :global(h2) {
                font-size: 1.875rem;
                font-weight: 700;
                color: #111827;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }

              .content-wrapper :global(h3) {
                font-size: 1.5rem;
                font-weight: 600;
                color: #1f2937;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
              }

              .content-wrapper :global(p) {
                color: #4b5563;
                line-height: 1.75;
                margin-bottom: 1.25rem;
              }

              .content-wrapper :global(ul) {
                list-style-type: disc;
                margin-left: 1.5rem;
                margin-bottom: 1.25rem;
                color: #4b5563;
              }

              .content-wrapper :global(li) {
                margin-bottom: 0.5rem;
                line-height: 1.6;
              }

              .content-wrapper :global(section) {
                margin-bottom: 2.5rem;
              }

              .content-wrapper :global(a) {
                color: #f59e0b;
                text-decoration: underline;
                transition: color 0.2s ease;
              }

              .content-wrapper :global(a:hover) {
                color: #d97706;
              }

              .content-wrapper :global(strong) {
                font-weight: 600;
                color: #111827;
              }

              .content-wrapper :global(blockquote) {
                border-left: 4px solid #f59e0b;
                padding-left: 1rem;
                margin: 1.5rem 0;
                color: #6b7280;
                font-style: italic;
              }

              .content-wrapper :global(code) {
                background-color: #f3f4f6;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-family: var(--font-geist-mono);
                font-size: 0.875rem;
                color: #1f2937;
              }

              .content-wrapper :global(pre) {
                background-color: #f3f4f6;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1.5rem 0;
              }

              .content-wrapper :global(pre code) {
                background-color: transparent;
                padding: 0;
                font-size: 0.875rem;
                color: #1f2937;
              }

              .content-wrapper :global(table) {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
              }

              .content-wrapper :global(th) {
                background-color: #f3f4f6;
                padding: 0.75rem 1rem;
                text-align: left;
                font-weight: 600;
                color: #111827;
                border-bottom: 2px solid #e5e7eb;
              }

              .content-wrapper :global(td) {
                padding: 0.75rem 1rem;
                border-bottom: 1px solid #e5e7eb;
                color: #4b5563;
              }

              .content-wrapper :global(img) {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1.5rem 0;
              }

              @media (max-width: 640px) {
                .content-wrapper :global(h2) {
                  font-size: 1.5rem;
                }

                .content-wrapper :global(h3) {
                  font-size: 1.25rem;
                }

                .content-wrapper :global(p, li) {
                  font-size: 0.9375rem;
                }
              }
            `}</style>
            {children}
          </div>
        </article>
      </main>
    </div>
  );
};

export default ContentPage;