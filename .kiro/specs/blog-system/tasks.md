# Implementation Plan

- [x] 1. Install dependencies and create blog utilities
  - Install required npm packages: `gray-matter`, `reading-time`, and MDX support packages
  - Create `/content/blog` directory for blog post files
  - Create `/src/lib/blog.ts` with utility functions for reading and parsing blog posts
  - Implement `getAllPosts()`, `getPostBySlug()`, `getAllCategories()`, `getRelatedPosts()`, and `calculateReadingTime()` functions
  - _Requirements: 1.1, 4.2, 4.4_

- [x] 2. Create MDX components and styling
  - Create `/src/app/components/Blog/MDXComponents.tsx` with custom component overrides for headings, paragraphs, links, lists, code blocks, images, and blockquotes
  - Style each component to match the existing design system with `#40d6d1` accents and dark theme
  - Ensure responsive image handling with Next.js Image component
  - _Requirements: 2.2, 6.1, 6.3_

- [x] 3. Build blog listing page
  - Create `/src/app/blog/page.tsx` with blog listing layout
  - Implement grid layout (3 columns desktop, 2 tablet, 1 mobile)
  - Add page header with title "Our Blog" and subtitle
  - Fetch all posts using `getAllPosts()` and pass to client component
  - Add Framer Motion animations for page entrance
  - Generate metadata for SEO optimization
  - _Requirements: 1.1, 1.4, 6.1, 6.2, 6.6_

- [x] 4. Create BlogCard component
  - Create `/src/app/components/Blog/BlogCard.tsx` for post preview cards
  - Implement card design with featured image, title, excerpt, metadata, and category pills
  - Add hover animations (scale, shadow, color transitions)
  - Style with dark card background, subtle borders, and backdrop blur
  - Make component fully responsive
  - _Requirements: 1.2, 6.1, 6.2, 6.3_

- [ ] 5. Implement category filtering
  - Create `/src/app/components/Blog/CategoryFilter.tsx` component
  - Add filter buttons for each category plus "All" option
  - Implement client-side filtering logic
  - Style active filter state with `#40d6d1` accent
  - Update post count display when filters change
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 6. Build individual blog post page
  - Create `/src/app/blog/[slug]/page.tsx` for individual posts
  - Implement `generateStaticParams()` for static generation
  - Fetch post data using `getPostBySlug()`
  - Create post layout with featured image hero, metadata, and content area
  - Add "Back to Blog" navigation link
  - Generate dynamic metadata for SEO
  - _Requirements: 2.1, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4_

- [x] 7. Create blog post header and content components
  - Create `/src/app/components/Blog/BlogHeader.tsx` for post metadata display
  - Display title, author, date, reading time, and category pills
  - Create `/src/app/components/Blog/BlogPost.tsx` for rendering MDX content
  - Integrate MDXComponents for custom styling
  - Add proper typography and spacing
  - _Requirements: 2.2, 2.3, 2.4, 6.3_

- [x] 8. Implement related posts section
  - Create `/src/app/components/Blog/RelatedPosts.tsx` component
  - Fetch related posts using `getRelatedPosts()` function
  - Display up to 3 related posts with thumbnail, title, and excerpt
  - Add grid layout and hover effects
  - Include fallback to recent posts if insufficient related posts
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 9. Add blog navigation to site header
  - Update `/src/app/components/Hero.tsx` to include "Blog" in navigation array
  - Modify `handleNavClick` to handle blog navigation (regular link, not smooth scroll)
  - Add "Blog" to mobile hamburger menu
  - Ensure navigation works from all pages
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 10. Implement SEO and structured data
  - Add Article schema structured data to blog post pages
  - Ensure unique meta titles and descriptions for each post
  - Add Open Graph and Twitter Card tags
  - Include canonical URLs
  - Create or update sitemap to include blog posts
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 11. Create example blog posts
  - Create 3-4 example MDX files in `/content/blog/` directory
  - Include posts about Louisville roofing topics (storm preparation, roof materials, inspection tips)
  - Add featured images to `/public/blog/` directory
  - Ensure proper frontmatter with all required fields
  - Test various content types (headings, lists, images, links, code blocks)
  - _Requirements: 4.1, 4.2, 4.3, 4.5_

- [x] 12. Add visual effects and polish
  - Add subtle gradient overlays and glow effects to blog pages
  - Implement shimmer effects on CTA buttons
  - Add loading states for images
  - Ensure all animations use consistent easing curves
  - Test and refine responsive behavior across devices
  - _Requirements: 6.2, 6.4, 6.6_

- [ ]* 13. Error handling and edge cases
  - Implement 404 handling for invalid blog slugs
  - Add empty state for blog listing if no posts exist
  - Add empty state for category filter with no results
  - Provide fallback images for missing featured images
  - Test edge cases (long titles, special characters, missing metadata)
  - _Requirements: 1.1, 2.1, 7.5_
