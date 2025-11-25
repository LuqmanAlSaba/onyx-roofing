'use client';

import { motion } from 'framer-motion';
import { BlogPost } from '@/lib/blog';
import BlogCard from '@/app/components/Blog/BlogCard';

interface BlogListingClientProps {
  posts: BlogPost[];
}

export default function BlogListingClient({ posts }: BlogListingClientProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
  };

  return (
    <div className="relative min-h-screen">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
        {/* Page Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          {...fadeInUp}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light text-white mb-6 tracking-tight">
            Our Blog
          </h1>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Expert roofing advice, maintenance tips, and industry insights for Kentucky homeowners
          </p>
        </motion.div>

        {/* Blog Feed */}
        {posts.length === 0 ? (
          <motion.div
            className="text-center py-32"
            {...fadeInUp}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-xl text-white/40 font-light">
              No blog posts yet. Check back soon for expert roofing insights!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                {...post}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
