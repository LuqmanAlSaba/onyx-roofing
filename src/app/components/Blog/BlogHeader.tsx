'use client';

import { Calendar, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import ShareButton from './ShareButton';

interface BlogHeaderProps {
  title: string;
  author: string;
  date: string;
  readingTime: string;
  categories: string[];
}

export default function BlogHeader({
  title,
  author,
  date,
  readingTime,
  categories,
}: BlogHeaderProps) {
  // Format date for display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.header
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6">
        {title}
      </h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={date}>{formattedDate}</time>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime}</span>
          </div>
        </div>

        <ShareButton title={title} />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <motion.span
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.2 + index * 0.05
              }}
              className="px-3 py-1 text-xs font-light bg-[#40d6d1]/10 text-[#40d6d1] rounded-full border border-[#40d6d1]/20 hover:bg-[#40d6d1]/20 transition-colors duration-200"
            >
              {category}
            </motion.span>
          ))}
        </div>
      )}
    </motion.header>
  );
}
