import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from './MDXComponents';

interface BlogPostContentProps {
    content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
    return (
        <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                },
            }}
        />
    );
}
