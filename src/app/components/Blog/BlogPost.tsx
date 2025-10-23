'use client';

import { MDXRemote } from 'next-mdx-remote/rsc';
import { mdxComponents } from './MDXComponents';
import { motion } from 'framer-motion';

interface BlogPostProps {
  content: string;
}

export default function BlogPost({ content }: BlogPostProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
    >
      {/* Divider */}
      <hr className="border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

      {/* MDX Content */}
      <div className="prose prose-invert max-w-none prose-headings:font-light prose-h2:text-[#40d6d1] prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-p:text-white/80 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-[#40d6d1] prose-a:no-underline hover:prose-a:underline prose-a:transition-all prose-strong:text-white prose-strong:font-medium prose-ul:text-white/80 prose-ol:text-white/80 prose-li:mb-2 prose-code:text-[#40d6d1] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-[#1a1f1a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:shadow-lg prose-blockquote:border-l-2 prose-blockquote:border-[#40d6d1] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-white/70 prose-img:rounded-lg prose-img:shadow-xl prose-img:transition-transform prose-img:duration-300 hover:prose-img:scale-[1.02]">
        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </motion.div>
  );
}
