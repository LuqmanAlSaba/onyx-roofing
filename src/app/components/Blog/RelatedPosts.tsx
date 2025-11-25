"use client";

import { motion } from "framer-motion";
import { BlogPost } from '@/lib/blog';
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  // Don't render if no related posts
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 border-t border-white/5">
      {/* Decorative glow effect */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#40d6d1]/3 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative mb-8 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">
          Related Posts
        </h2>
        <p className="text-white/60 text-sm">
          Continue reading about similar topics
        </p>
      </motion.div>

      {/* Related Posts Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            {...post}
          />
        ))}
      </div>
    </section>
  );
}
