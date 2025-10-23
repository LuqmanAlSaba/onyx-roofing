# Blog System Design Document

## Overview

The blog system will be built using Next.js 15's App Router with MDX for content management. The design prioritizes SEO optimization, beautiful aesthetics matching the existing site, and ease of content creation. The system will be file-based, requiring no database, making it simple to add new posts by creating markdown files.

## Architecture

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Content**: MDX (Markdown + JSX) for blog posts
- **Styling**: Tailwind CSS (existing setup)
- **Animations**: Framer Motion (existing)
- **Parsing**: `gray-matter` for frontmatter, `next-mdx-remote` or `@next/mdx` for rendering
- **Reading Time**: `reading-time` package for automatic calculation

### Directory Structure

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx                 # Blog listing page
│   │   ├── [slug]/
│   │   │   └── page.tsx             # Individual blog post page
│   │   └── layout.tsx               # Blog-specific layout (optional)
│   └── components/
│       └── Blog/
│           ├── BlogCard.tsx         # Post preview card
│           ├── BlogPost.tsx         # Full post display
│           ├── BlogHeader.tsx       # Post header with metadata
│           ├── CategoryFilter.tsx   # Category filtering UI
│           ├── RelatedPosts.tsx     # Related posts section
│           └── MDXComponents.tsx    # Custom MDX component overrides
├── lib/
│   └── blog.ts                      # Blog utility functions
└── content/
    └── blog/
        ├── example-post.mdx
        └── another-post.mdx
```

## Components and Interfaces

### 1. Blog Listing Page (`/app/blog/page.tsx`)

**Purpose**: Display all blog posts with filtering and search capabilities

**Key Features**:
- Grid layout of blog post cards (3 columns on desktop, 2 on tablet, 1 on mobile)
- Category filter buttons at the top
- Animated entrance using Framer Motion
- Matches hero section aesthetic with dark background and subtle glows

**Component Structure**:
```tsx
export default async function BlogPage() {
  const posts = await getAllPosts();
  
  return (
    <main className="bg-gradient-to-br from-[#192119] to-[#1a1f1a]">
      <BlogHeader />
      <CategoryFilter categories={getAllCategories(posts)} />
      <BlogGrid posts={posts} />
    </main>
  );
}
```

### 2. Blog Post Page (`/app/blog/[slug]/page.tsx`)

**Purpose**: Display individual blog post with full content

**Key Features**:
- Featured image hero section
- Post metadata (author, date, reading time, categories)
- Rich MDX content rendering
- Related posts section at bottom
- Back to blog navigation
- Social sharing buttons (optional)

**Component Structure**:
```tsx
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const relatedPosts = await getRelatedPosts(post);
  
  return (
    <article className="bg-gradient-to-br from-[#192119] to-[#1a1f1a]">
      <BlogHeader post={post} />
      <BlogContent content={post.content} />
      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}
```

### 3. BlogCard Component

**Purpose**: Reusable card for displaying post previews

**Design**:
- Dark card with `bg-[#2a2d31]/30` and `backdrop-blur-sm`
- Border: `border-white/5` with hover state `border-[#40d6d1]/20`
- Featured image with aspect ratio 16:9
- Title in white with hover color `#40d6d1`
- Excerpt in `text-white/70`
- Metadata row: author, date, reading time
- Category pills with `bg-[#40d6d1]/10` and `text-[#40d6d1]`
- Hover animation: slight scale and shadow increase

```tsx
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
```

### 4. MDX Content Rendering

**Custom Component Overrides**:
- Headings: Styled with appropriate sizes and `text-[#40d6d1]` for h2
- Paragraphs: `text-white/80` with proper line height
- Links: `text-[#40d6d1]` with underline on hover
- Lists: Custom bullet styling with `text-[#40d6d1]`
- Code blocks: Dark theme with syntax highlighting
- Images: Responsive with rounded corners and shadow
- Blockquotes: Left border in `#40d6d1` with italic text

## Data Models

### Blog Post Frontmatter

```yaml
---
title: "How to Prepare Your Roof for Kentucky Storms"
date: "2024-10-15"
author: "Ibrahim Al-Saba"
excerpt: "Learn essential steps to protect your roof before storm season hits Louisville and surrounding areas."
featuredImage: "/blog/storm-preparation.jpg"
categories: ["Storm Damage", "Maintenance", "Louisville"]
---
```

### TypeScript Interfaces

```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  content: string;
  readingTime: string;
}

interface BlogMetadata {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
}
```

## Blog Utility Functions (`lib/blog.ts`)

### Core Functions

```typescript
// Get all blog posts sorted by date
export async function getAllPosts(): Promise<BlogPost[]>

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost>

// Get all unique categories
export function getAllCategories(posts: BlogPost[]): string[]

// Get related posts based on shared categories
export function getRelatedPosts(post: BlogPost, allPosts: BlogPost[], limit: number = 3): BlogPost[]

// Calculate reading time from content
export function calculateReadingTime(content: string): string

// Parse MDX file and extract frontmatter
async function parseMDXFile(filePath: string): Promise<BlogPost>
```

### Implementation Details

**getAllPosts**:
1. Read all `.mdx` files from `/content/blog`
2. Parse frontmatter and content for each file
3. Calculate reading time
4. Sort by date (newest first)
5. Return array of BlogPost objects

**getPostBySlug**:
1. Read specific MDX file matching slug
2. Parse frontmatter and content
3. Calculate reading time
4. Return BlogPost object
5. Throw 404 if not found

**getRelatedPosts**:
1. Filter posts sharing at least one category with current post
2. Sort by number of shared categories
3. Exclude current post
4. Take top N posts
5. Fill remaining slots with recent posts if needed

## SEO Implementation

### Meta Tags (per post)

```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  return {
    title: `${post.title} | Onyx Roofing Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}
```

### Structured Data (Article Schema)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "image": "featured-image-url",
  "datePublished": "2024-10-15",
  "dateModified": "2024-10-15",
  "author": {
    "@type": "Person",
    "name": "Ibrahim Al-Saba"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Onyx Roofing",
    "logo": {
      "@type": "ImageObject",
      "url": "logo-url"
    }
  },
  "description": "Post excerpt",
  "articleBody": "Full content"
}
```

### Sitemap Integration

Update `/public/sitemap.xml` or use Next.js sitemap generation:

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts();
  
  const blogPosts = posts.map((post) => ({
    url: `https://onyxroofingpro.com/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  return [
    // ... existing pages
    ...blogPosts,
  ];
}
```

## Design System Integration

### Color Palette

- **Background**: `#192119`, `#1a1f1a`
- **Card Background**: `#2a2d31` with 30% opacity
- **Primary Accent**: `#40d6d1` (cyan/teal)
- **Secondary Accent**: `#13938f` (darker teal)
- **Text Primary**: `white`
- **Text Secondary**: `white/70` or `white/80`
- **Borders**: `white/5` default, `white/10` hover, `#40d6d1/20` active

### Typography

- **Font Family**: Inter (existing)
- **Headings**: Light to normal weight
- **Body**: Light weight (300-400)
- **Blog Post Title**: `text-3xl md:text-4xl font-light`
- **Card Title**: `text-xl font-medium`
- **Body Text**: `text-base text-white/80 leading-relaxed`

### Spacing & Layout

- **Container**: `max-w-7xl mx-auto px-4 sm:px-8`
- **Section Padding**: `py-12 sm:py-16`
- **Card Padding**: `p-5` or `p-6`
- **Grid Gap**: `gap-4` or `gap-6`

### Animations

All animations use Framer Motion with consistent easing:

```typescript
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
};

const cardHover = {
  whileHover: { scale: 1.02, y: -4 },
  transition: { duration: 0.2 }
};
```

### Visual Effects

- **Backdrop Blur**: `backdrop-blur-sm` on cards
- **Gradient Overlays**: Subtle radial gradients with `#40d6d1` and `#13938f`
- **Glow Effects**: Positioned absolutely with blur and low opacity
- **Shimmer Effect**: Reuse existing `.shimmer-effect` class on CTAs

## Navigation Integration

### Update Hero Component

Add "Blog" to navigation array:

```typescript
["Services", "Projects", "About", "Coverage", "Contact", "Blog"]
```

Handle blog navigation differently (no smooth scroll, regular navigation):

```typescript
const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
  if (targetId === 'blog') {
    // Let default navigation happen
    return;
  }
  
  // Existing smooth scroll logic for other sections
  e.preventDefault();
  // ...
};
```

### Mobile Menu

Add "Blog" to mobile menu items with same navigation handling.

## Content Management Workflow

### Adding a New Blog Post

1. Create new `.mdx` file in `/content/blog/` with kebab-case filename
2. Add frontmatter with all required fields
3. Write content using markdown syntax
4. Add featured image to `/public/blog/` directory
5. Commit and deploy - post appears automatically

### Example Post Template

```mdx
---
title: "Your Post Title Here"
date: "2024-10-23"
author: "Ibrahim Al-Saba"
excerpt: "A compelling 1-2 sentence summary that appears in previews and meta descriptions."
featuredImage: "/blog/your-image.jpg"
categories: ["Category1", "Category2"]
---

Your content starts here. Use standard markdown:

## Headings

Regular paragraphs with **bold** and *italic* text.

- Bullet points
- Work great

### Subheadings

[Links work too](https://example.com)

![Alt text for images](/blog/inline-image.jpg)

> Blockquotes for emphasis

```code blocks with syntax highlighting```
```

## Error Handling

### 404 Handling

- If slug doesn't match any post, return Next.js `notFound()`
- Display custom 404 page with link back to blog listing

### Empty States

- If no posts exist, show friendly message with CTA to check back later
- If category filter returns no results, show "No posts found" with option to clear filter

### Image Loading

- Use Next.js Image component with proper sizing
- Provide fallback placeholder for missing images
- Lazy load images below the fold

## Performance Optimization

### Static Generation

- Use `generateStaticParams` to pre-render all blog post pages at build time
- Blog listing page is also statically generated
- Revalidate on demand when new posts are added

### Image Optimization

- Store images in `/public/blog/` directory
- Use Next.js Image component with appropriate sizes
- Provide WebP format with fallbacks
- Lazy load images in blog listing

### Code Splitting

- MDX components are only loaded on blog pages
- Blog-specific utilities are tree-shaken from other pages

## Testing Strategy

### Manual Testing Checklist

1. **Blog Listing Page**
   - All posts display correctly
   - Category filters work
   - Responsive on mobile/tablet/desktop
   - Animations trigger properly
   - Links navigate correctly

2. **Blog Post Page**
   - Content renders with proper formatting
   - Images load and display correctly
   - Related posts appear
   - Back navigation works
   - Meta tags are correct (view source)

3. **Navigation**
   - Blog link appears in header
   - Blog link appears in mobile menu
   - Navigation works from all pages

4. **SEO**
   - Meta titles and descriptions are unique
   - Open Graph tags present
   - Structured data validates (Google Rich Results Test)
   - Sitemap includes blog posts

### Content Testing

1. Create test posts with various content types:
   - Long post with many sections
   - Short post with minimal content
   - Post with many images
   - Post with code blocks
   - Post with lists and blockquotes

2. Test edge cases:
   - Post with no categories
   - Post with very long title
   - Post with special characters in title
   - Post with missing featured image

## Future Enhancements (Out of Scope)

These features are not included in the initial implementation but could be added later:

- Search functionality
- Pagination for blog listing
- Author pages
- Tag system (separate from categories)
- Comments system
- Newsletter signup integration
- Social sharing buttons
- Table of contents for long posts
- Estimated reading progress indicator
- Dark/light mode toggle (currently dark only)
