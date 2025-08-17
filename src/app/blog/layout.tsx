import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Kevin Saji',
  description: 'Thoughts, insights, and experiences from my journey in software development',
  openGraph: {
    title: 'Blog | Kevin Saji',
    description: 'Thoughts, insights, and experiences from my journey in software development',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
