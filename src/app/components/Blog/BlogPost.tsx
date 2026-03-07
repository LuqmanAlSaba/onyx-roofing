'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface BlogPostProps {
  children: React.ReactNode;
}

export default function BlogPost({ children }: BlogPostProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Divider */}
      <hr className="border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

      {/* MDX Content Wrapper */}
      <div className="prose prose-invert max-w-none 
        prose-headings:font-light prose-headings:tracking-wide
        prose-h2:text-[#40d6d1] prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:mt-16 prose-h2:mb-8 
        prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-white/90
        prose-p:text-lg prose-p:md:text-xl prose-p:leading-loose prose-p:text-white/80 prose-p:mb-8 
        prose-a:text-[#40d6d1] prose-a:no-underline hover:prose-a:underline prose-a:transition-all 
        prose-strong:text-white prose-strong:font-medium 
        prose-ul:text-lg prose-ul:md:text-xl prose-ul:text-white/80 prose-ul:leading-loose prose-ul:my-8
        prose-ol:text-lg prose-ol:md:text-xl prose-ol:text-white/80 prose-ol:leading-loose prose-ol:my-8
        prose-li:mb-4 prose-li:pl-2
        prose-code:text-[#40d6d1] prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-normal prose-code:before:content-[''] prose-code:after:content-[''] 
        prose-pre:bg-[#1a1f1a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:shadow-2xl prose-pre:p-6
        prose-blockquote:border-l-4 prose-blockquote:border-[#40d6d1] prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-12 prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:text-white/70 prose-blockquote:bg-white/5 prose-blockquote:rounded-r-lg
        prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-12 prose-img:w-full">
        {children}
      </div>
    </motion.div>
  );
}
