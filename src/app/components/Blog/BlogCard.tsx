'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

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
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="group h-full"
    >
      <Link href={`/blog/${slug}`} className="block h-full">
        <div className="h-full bg-[#2a2d31]/20 backdrop-blur-sm border border-white/5 hover:border-[#40d6d1]/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#40d6d1]/5 hover:-translate-y-2 flex flex-col group-hover:bg-[#2a2d31]/40">
          {/* Featured Image */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#1a1f1a]">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a2d31] via-[#3a3f45] to-[#2a2d31] animate-pulse" />
            )}
            <Image
              src={featuredImage}
              alt={title}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f1a] via-transparent to-transparent opacity-60" />

            {/* Categories Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {categories.slice(0, 2).map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 text-xs font-medium bg-black/50 backdrop-blur-md text-white border border-white/10 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 flex flex-col flex-grow relative">
            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
              <span className="font-medium text-[#40d6d1]">{author}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <time dateTime={date}>{formattedDate}</time>
            </div>

            {/* Title */}
            <h3 className="text-xl font-medium text-white group-hover:text-[#40d6d1] transition-colors duration-300 mb-3 line-clamp-2">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
              {excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
              <span className="text-xs text-white/40 font-light flex items-center gap-2">
                {readingTime}
              </span>
              <span className="text-sm text-[#40d6d1] flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Read Article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
