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
    <article className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdated}
        </p>
      </header>
      <div className="prose prose-amber max-w-none">
        {children}
      </div>
    </article>
  );
};

export default ContentPage;