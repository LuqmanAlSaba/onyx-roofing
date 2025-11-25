import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogMetadata {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  featuredImage: string;
  categories: string[];
  published?: boolean;
}

export interface BlogPost extends BlogMetadata {
  slug: string;
  content: string;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): string {
  const stats = readingTime(content);
  return stats.text;
}

/**
 * Parse MDX file and extract frontmatter
 */
async function parseMDXFile(filePath: string, slug: string): Promise<BlogPost> {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const metadata = data as BlogMetadata;
  const readTime = calculateReadingTime(content);

  return {
    slug,
    title: metadata.title,
    date: metadata.date,
    author: metadata.author,
    excerpt: metadata.excerpt,
    featuredImage: metadata.featuredImage,
    categories: metadata.categories || [],
    published: metadata.published ?? true, // Default to true if not specified
    content,
    readingTime: readTime,
  };
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const mdxFiles = fileNames.filter(
    (fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md')
  );

  const allPostsData = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      return parseMDXFile(fullPath, slug);
    })
  );

  // Filter out unpublished posts
  const publishedPosts = allPostsData.filter((post) => post.published !== false);

  // Sort posts by date (newest first)
  return publishedPosts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  // Try .mdx first, then .md
  let filePath = fullPath;
  if (!fs.existsSync(fullPath)) {
    const mdPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(mdPath)) {
      throw new Error(`Post not found: ${slug}`);
    }
    filePath = mdPath;
  }

  return parseMDXFile(filePath, slug);
}

/**
 * Get all unique categories from posts
 */
export function getAllCategories(posts: BlogPost[]): string[] {
  const categoriesSet = new Set<string>();

  posts.forEach((post) => {
    post.categories.forEach((category) => {
      categoriesSet.add(category);
    });
  });

  return Array.from(categoriesSet).sort();
}

/**
 * Get related posts based on shared categories
 */
export function getRelatedPosts(
  post: BlogPost,
  allPosts: BlogPost[],
  limit: number = 3
): BlogPost[] {
  // Filter out the current post
  const otherPosts = allPosts.filter((p) => p.slug !== post.slug);

  // Calculate relevance score based on shared categories
  const postsWithScores = otherPosts.map((otherPost) => {
    const sharedCategories = otherPost.categories.filter((category) =>
      post.categories.includes(category)
    );
    return {
      post: otherPost,
      score: sharedCategories.length,
    };
  });

  // Sort by score (most shared categories first), then by date
  postsWithScores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // If same score, sort by date (newest first)
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  // Take top N posts
  const relatedPosts = postsWithScores.slice(0, limit).map((item) => item.post);

  // If we don't have enough related posts, fill with recent posts
  if (relatedPosts.length < limit) {
    const recentPosts = otherPosts
      .filter((p) => !relatedPosts.includes(p))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit - relatedPosts.length);

    relatedPosts.push(...recentPosts);
  }

  return relatedPosts;
}
