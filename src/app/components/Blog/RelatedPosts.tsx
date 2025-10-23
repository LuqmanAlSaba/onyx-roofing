"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";
import { useState } from "react";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (slug: string) => {
    setLoadedImages(prev => new Set(prev).add(slug));
  };

  // Don't render if no related posts
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="relative max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 border-t border-white/5">
      {/* Decorative glow effect */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#40d6d1]/3 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">
          Related Posts
        </h2>
        <p className="text-white/60 text-sm">
          Continue reading about similar topics
        </p>
      </motion.div>

      {/* Related Posts Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
            className="group"
          >
            <Link href={`/blog/${post.slug}`} className="block h-full">
              <div className="h-full bg-[#2a2d31]/30 backdrop-blur-sm border border-white/5 hover:border-[#40d6d1]/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/30 flex flex-col">
                {/* Thumbnail */}
                <div className="relative w-full aspect-video overflow-hidden bg-[#1a1f1a]">
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
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onLoad={() => handleImageLoad(post.slug)}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a2d31]/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-base font-medium text-white group-hover:text-[#40d6d1] transition-colors duration-300 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Reading Time */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <span className="text-xs text-white/60 font-light">
                      {post.readingTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
