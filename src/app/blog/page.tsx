import { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogListingClient from './BlogListingClient';
import Navigation from '@/app/components/Navigation';

export const metadata: Metadata = {
  title: 'Our Blog | Onyx Roofing - Roofing Tips & Insights',
  description: 'Expert roofing advice, maintenance tips, and industry insights from Onyx Roofing. Learn about roof care, storm preparation, and more for Louisville, KY homeowners.',
  keywords: [
    'roofing blog',
    'roof maintenance tips',
    'Louisville roofing advice',
    'storm damage prevention',
    'roof care Kentucky',
    'roofing industry insights',
  ],
  openGraph: {
    title: 'Our Blog | Onyx Roofing',
    description: 'Expert roofing advice, maintenance tips, and industry insights from Onyx Roofing.',
    url: 'https://onyxroofingpro.com/blog',
    siteName: 'Onyx Roofing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Blog | Onyx Roofing',
    description: 'Expert roofing advice, maintenance tips, and industry insights from Onyx Roofing.',
  },
  alternates: {
    canonical: 'https://onyxroofingpro.com/blog',
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-[#192119] to-[#1a1f1a]"
      style={{
        border: "16px solid #1a1f1a",
        background: "#1a1f1a",
      }}
    >
      <div style={{ borderRadius: "32px 32px 0 0", minHeight: "100vh" }} className="bg-gradient-to-br from-[#192119] to-[#1a1f1a] relative overflow-hidden">
        <Navigation variant="fixed" />
        <BlogListingClient posts={posts} />
      </div>
    </main>
  );
}
