'use client';

import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface BlogListingClientProps {
  posts: BlogPost[];
}

export default function BlogListingClient({ posts }: BlogListingClientProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (slug: string) => {
    setLoadedImages(prev => new Set(prev).add(slug));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
  };

  return (
    <div className="relative">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-16 pb-12 sm:pb-16">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          {...fadeInUp}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">
            Our Blog
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
            Expert roofing advice, maintenance tips, and industry insights for Louisville homeowners
          </p>
        </motion.div>

        {/* Blog Feed */}
        {posts.length === 0 ? (
          <motion.div
            className="text-center py-20"
            {...fadeInUp}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-xl text-white/60">
              No blog posts yet. Check back soon for expert roofing insights!
            </p>
          </motion.div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: index * 0.1,
                }}
                className="group"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="block bg-[#2a2d31]/30 backdrop-blur-sm border border-white/5 hover:border-[#40d6d1]/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/30 group-hover:scale-[1.01]"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Content - Left Side */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.categories.map((category) => (
                          <span
                            key={category}
                            className="px-3 py-1 text-xs bg-[#40d6d1]/10 text-[#40d6d1] rounded-full border border-[#40d6d1]/20"
                          >
                            {category}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl sm:text-3xl font-medium text-white group-hover:text-[#40d6d1] transition-colors duration-300 mb-3">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-white/70 text-base mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span className="font-medium">{post.author}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>

                    {/* Featured Image - Right Side */}
                    <div className="relative w-full md:w-96 h-64 md:h-auto overflow-hidden bg-[#1a1f1a] md:flex-shrink-0">
                      {/* Loading skeleton */}
                      {!loadedImages.has(post.slug) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2a2d31]/50 via-[#2a2d31]/30 to-[#2a2d31]/50 animate-pulse" />
                      )}
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                          loadedImages.has(post.slug) ? 'opacity-100' : 'opacity-0'
                        }`}
                        sizes="(max-width: 768px) 100vw, 384px"
                        onLoad={() => handleImageLoad(post.slug)}
                      />
                      {/* Gradient overlay on image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2a2d31]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
