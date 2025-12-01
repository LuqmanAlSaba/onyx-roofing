import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { ArrowLeft } from 'lucide-react';
import BlogHeader from '@/app/components/Blog/BlogHeader';
import BlogPost from '@/app/components/Blog/BlogPost';
import BlogPostContent from '@/app/components/Blog/BlogPostContent';
import RelatedPosts from '@/app/components/Blog/RelatedPosts';
import BlogPostClient from '@/app/components/Blog/BlogPostClient';

import Navigation from '@/app/components/Navigation';
import ReadingProgressBar from '@/app/components/Blog/ReadingProgressBar';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);

    return {
      title: `${post.title} | Onyx Roofing Blog`,
      description: post.excerpt,
      keywords: [...post.categories, 'roofing', 'Louisville', 'Kentucky'],
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        type: 'article',
        publishedTime: post.date,
        authors: [post.author],
        siteName: 'Onyx Roofing',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.featuredImage],
      },
      alternates: {
        canonical: `https://onyxroofingpro.com/blog/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Post Not Found | Onyx Roofing Blog',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  // Fetch all posts for related posts calculation
  const allPosts = await getAllPosts();
  const relatedPosts = getRelatedPosts(post, allPosts, 3);

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featuredImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Onyx Roofing',
      logo: {
        '@type': 'ImageObject',
        url: 'https://onyxroofingpro.com/onyx-roofing-logo.svg',
      },
    },
    description: post.excerpt,
    articleBody: post.content,
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main
        className="min-h-screen bg-gradient-to-br from-[#192119] to-[#1a1f1a]"
        style={{
          border: "16px solid #1a1f1a",
          background: "#1a1f1a",
        }}
      >
        <div style={{ borderRadius: "32px 32px 0 0", minHeight: "100vh" }} className="bg-gradient-to-br from-[#192119] to-[#1a1f1a] relative overflow-hidden">
          <ReadingProgressBar />
          <Navigation variant="fixed" />

          {/* Back to Blog Navigation */}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-8 pt-16 sm:pt-16 pb-8">
            <Link
              href="/blog"
              className="shimmer-effect inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2a2d31]/80 backdrop-blur-md border border-[#40d6d1]/30 text-[#40d6d1] hover:bg-[#40d6d1] hover:text-[#1a1f1a] hover:border-[#40d6d1] transition-all duration-300 group shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-light">Back to Blog</span>
            </Link>
          </div>

          {/* Featured Image Hero */}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-8 pb-8">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl shadow-black/40 group">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#192119]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Article Content */}
          <article className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
            <BlogHeader
              title={post.title}
              author={post.author}
              date={post.date}
              readingTime={post.readingTime}
              categories={post.categories}
            />

            <BlogPost>
              <BlogPostContent content={post.content} />
            </BlogPost>

            {/* Client component for form and CTA */}
            <BlogPostClient
              ctaTitle={slug === 'kentucky-winter-roof-prep' ? "Is Your Roof Winter-Ready?" : undefined}
              ctaDescription={slug === 'kentucky-winter-roof-prep' ? "Don't let the freeze-thaw cycle catch you off guard. Schedule a comprehensive winter roof inspection with Onyx Roofing today." : undefined}
              ctaButtonText={slug === 'kentucky-winter-roof-prep' ? "Schedule Inspection" : undefined}
            />
          </article>

          {/* Related Posts Section */}
          <RelatedPosts posts={relatedPosts} />
        </div>
      </main>
    </>
  );
}
