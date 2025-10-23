"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  date: string;
  author: string;
  readingTime: string;
  categories: string[];
}

export default function BlogCard({
  title,
  excerpt,
  slug,
  featuredImage,
  date,
  author,
  readingTime,
  categories,
}: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link href={`/blog/${slug}`} className="block h-full">
        <div
          className="h-full bg-[#2a2d31]/30 backdrop-blur-sm border border-white/5 hover:border-[#40d6d1]/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/30 flex flex-col"
        >
          {/* Featured Image */}
          <div className="relative w-full aspect-video overflow-hidden bg-[#1a1f1a]">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a2d31]/50 via-[#2a2d31]/30 to-[#2a2d31]/50 animate-pulse" />
            )}
            <Image
              src={featuredImage}
              alt={title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />
            {/* Gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2a2d31]/60 to-transparent" />
          </div>

          {/* Card Content */}
          <div className="p-5 sm:p-6 flex flex-col flex-grow">
            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="inline-block px-3 py-1 text-xs font-medium bg-[#40d6d1]/10 text-[#40d6d1] rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-medium text-white group-hover:text-[#40d6d1] transition-colors duration-300 mb-3 line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
              {excerpt}
            </p>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-white/60 pt-4 border-t border-white/5">
              <span className="font-light">{author}</span>
              <span>•</span>
              <time dateTime={date}>{formattedDate}</time>
              <span>•</span>
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
