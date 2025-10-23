# Requirements Document

## Introduction

This document outlines the requirements for adding a blog system to the Onyx Roofing website. The blog will serve as a content marketing tool to improve SEO rankings for roofing-related searches in Louisville, Kentucky and surrounding areas. The blog must maintain the existing website's aesthetic while providing an intuitive content management experience.

## Glossary

- **Blog System**: The complete feature set including blog listing page, individual blog post pages, and content management
- **Blog Post**: An individual article with title, content, metadata, and optional featured image
- **Blog Listing Page**: The main blog index page displaying all published blog posts
- **Blog Post Page**: The individual page displaying a single blog post's full content
- **Frontmatter**: YAML metadata at the top of markdown files containing post information (title, date, author, etc.)
- **MDX**: Markdown with JSX support, allowing React components within markdown content
- **Featured Image**: The primary image displayed with a blog post on listing and detail pages
- **Category**: A classification tag for organizing blog posts by topic
- **Reading Time**: Estimated time to read a blog post, calculated from word count
- **Related Posts**: Suggested blog posts shown at the end of a post based on shared categories

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want to browse blog posts on a dedicated blog page, so that I can find helpful roofing information and learn about the company's expertise.

#### Acceptance Criteria

1. WHEN a user navigates to `/blog`, THE Blog System SHALL display a blog listing page with all published posts
2. THE Blog System SHALL display each blog post preview with title, excerpt, featured image, publication date, author, reading time, and categories
3. THE Blog System SHALL arrange blog posts in reverse chronological order (newest first)
4. THE Blog System SHALL match the existing website's dark theme aesthetic with `#192119` background and `#40d6d1` accent colors
5. WHEN a user clicks on a blog post preview, THE Blog System SHALL navigate to the individual blog post page

### Requirement 2

**User Story:** As a website visitor, I want to read full blog posts with rich formatting, so that I can get detailed information about roofing topics.

#### Acceptance Criteria

1. WHEN a user navigates to `/blog/[slug]`, THE Blog System SHALL display the full blog post content
2. THE Blog System SHALL render markdown content with proper formatting including headings, paragraphs, lists, links, images, and code blocks
3. THE Blog System SHALL display the featured image at the top of the post
4. THE Blog System SHALL display post metadata including title, author, publication date, reading time, and categories
5. THE Blog System SHALL include a "Back to Blog" navigation link

### Requirement 3

**User Story:** As a website visitor, I want to see related blog posts after reading an article, so that I can discover more relevant content.

#### Acceptance Criteria

1. WHEN a user scrolls to the end of a blog post, THE Blog System SHALL display a "Related Posts" section
2. THE Blog System SHALL show up to 3 related posts based on shared categories
3. IF fewer than 3 posts share categories, THEN THE Blog System SHALL fill remaining slots with recent posts
4. THE Blog System SHALL display each related post with thumbnail image, title, and excerpt
5. WHEN a user clicks a related post, THE Blog System SHALL navigate to that post's page

### Requirement 4

**User Story:** As a content manager, I want to create blog posts using markdown files, so that I can easily add and update content without touching code.

#### Acceptance Criteria

1. THE Blog System SHALL store blog posts as MDX files in a `/content/blog` directory
2. THE Blog System SHALL parse frontmatter metadata from each MDX file including title, date, author, excerpt, featuredImage, and categories
3. THE Blog System SHALL generate URL slugs from the MDX filename
4. THE Blog System SHALL calculate reading time automatically from post content
5. THE Blog System SHALL support standard markdown syntax and embedded React components

### Requirement 5

**User Story:** As a website visitor, I want the blog to be optimized for search engines, so that I can find helpful roofing content through Google searches.

#### Acceptance Criteria

1. THE Blog System SHALL generate unique meta titles and descriptions for each blog post page
2. THE Blog System SHALL include Open Graph tags for social media sharing
3. THE Blog System SHALL generate structured data (Article schema) for each blog post
4. THE Blog System SHALL include canonical URLs for all blog pages
5. THE Blog System SHALL generate a sitemap entry for each published blog post

### Requirement 6

**User Story:** As a website visitor, I want the blog to look beautiful and match the website's design, so that I have a consistent and premium experience.

#### Acceptance Criteria

1. THE Blog System SHALL use the existing color scheme with `#192119` / `#1a1f1a` backgrounds and `#40d6d1` accents
2. THE Blog System SHALL implement Framer Motion animations consistent with the existing site
3. THE Blog System SHALL use the Inter font family with light font weights
4. THE Blog System SHALL include subtle gradient overlays and blur effects matching the hero section
5. THE Blog System SHALL be fully responsive and mobile-optimized

### Requirement 7

**User Story:** As a website visitor, I want to filter blog posts by category, so that I can find content relevant to my specific interests.

#### Acceptance Criteria

1. THE Blog System SHALL display category filter buttons on the blog listing page
2. WHEN a user clicks a category filter, THE Blog System SHALL show only posts in that category
3. THE Blog System SHALL highlight the active category filter
4. THE Blog System SHALL include an "All" filter to show all posts
5. THE Blog System SHALL update the displayed post count when filters are applied

### Requirement 8

**User Story:** As a website owner, I want a navigation link to the blog in the main menu, so that visitors can easily discover the blog content.

#### Acceptance Criteria

1. THE Blog System SHALL add a "Blog" link to the main navigation menu in the Hero component
2. THE Blog System SHALL add a "Blog" link to the mobile hamburger menu
3. WHEN a user clicks the blog navigation link, THE Blog System SHALL navigate to `/blog`
4. THE Blog System SHALL highlight the blog link when the user is on a blog page
5. THE Blog System SHALL maintain smooth scroll behavior for other navigation links
