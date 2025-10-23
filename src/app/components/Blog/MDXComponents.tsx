import Image from 'next/image';
import Link from 'next/link';
import { MDXComponents } from 'mdx/types';

// Custom heading components with design system styling
const H1 = ({ children }: { children: React.ReactNode }) => (
  <h1 className="text-4xl md:text-5xl font-light text-white mb-6 mt-8">
    {children}
  </h1>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl md:text-4xl font-light text-[#40d6d1] mb-5 mt-8">
    {children}
  </h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl md:text-3xl font-light text-white mb-4 mt-6">
    {children}
  </h3>
);

const H4 = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xl md:text-2xl font-normal text-white mb-3 mt-5">
    {children}
  </h4>
);

const H5 = ({ children }: { children: React.ReactNode }) => (
  <h5 className="text-lg md:text-xl font-normal text-white mb-3 mt-4">
    {children}
  </h5>
);

const H6 = ({ children }: { children: React.ReactNode }) => (
  <h6 className="text-base md:text-lg font-medium text-white mb-2 mt-4">
    {children}
  </h6>
);

// Paragraph component
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base md:text-lg text-white/80 leading-relaxed mb-4">
    {children}
  </p>
);

// Link component with accent color
const A = ({ href, children }: { href?: string; children: React.ReactNode }) => {
  if (!href) return <>{children}</>;
  
  const isExternal = href.startsWith('http');
  
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#40d6d1] hover:text-[#13938f] underline decoration-[#40d6d1]/30 hover:decoration-[#40d6d1] transition-colors duration-200"
      >
        {children}
      </a>
    );
  }
  
  return (
    <Link
      href={href}
      className="text-[#40d6d1] hover:text-[#13938f] underline decoration-[#40d6d1]/30 hover:decoration-[#40d6d1] transition-colors duration-200"
    >
      {children}
    </Link>
  );
};

// Unordered list component
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-none space-y-2 mb-4 ml-6">
    {children}
  </ul>
);

// Ordered list component
const OL = ({ children }: { children: React.ReactNode }) => (
  <ol className="list-decimal list-inside space-y-2 mb-4 ml-6 text-white/80">
    {children}
  </ol>
);

// List item component with custom bullet
const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="text-base md:text-lg text-white/80 leading-relaxed relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:bg-[#40d6d1] before:rounded-full">
    {children}
  </li>
);

// Blockquote component
const Blockquote = ({ children }: { children: React.ReactNode }) => (
  <blockquote className="border-l-4 border-[#40d6d1] pl-6 py-2 my-6 italic text-white/70 bg-[#40d6d1]/5 rounded-r-lg">
    {children}
  </blockquote>
);

// Code block component
const Pre = ({ children }: { children: React.ReactNode }) => (
  <pre className="bg-[#1a1f1a] border border-white/10 rounded-lg p-4 overflow-x-auto mb-4 text-sm md:text-base">
    {children}
  </pre>
);

// Inline code component
const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="bg-[#1a1f1a] text-[#40d6d1] px-2 py-1 rounded text-sm font-mono border border-white/10">
    {children}
  </code>
);

// Image component with Next.js Image optimization
const Img = ({ src, alt }: { src?: string; alt?: string }) => {
  if (!src) return null;
  
  // Handle external images
  if (src.startsWith('http')) {
    return (
      <span className="block my-6 rounded-lg overflow-hidden shadow-lg shadow-black/20">
        <img
          src={src}
          alt={alt || ''}
          className="w-full h-auto"
        />
      </span>
    );
  }
  
  return (
    <span className="block my-6 rounded-lg overflow-hidden shadow-lg shadow-black/20">
      <Image
        src={src}
        alt={alt || ''}
        width={1200}
        height={675}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
    </span>
  );
};

// Horizontal rule
const HR = () => (
  <hr className="border-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />
);

// Strong (bold) text
const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="font-semibold text-white">
    {children}
  </strong>
);

// Emphasis (italic) text
const Em = ({ children }: { children: React.ReactNode }) => (
  <em className="italic text-white/90">
    {children}
  </em>
);

// Table components
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto my-6">
    <table className="min-w-full border border-white/10 rounded-lg overflow-hidden">
      {children}
    </table>
  </div>
);

const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-[#40d6d1]/10">
    {children}
  </thead>
);

const TBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-white/10">
    {children}
  </tbody>
);

const TR = ({ children }: { children: React.ReactNode }) => (
  <tr className="hover:bg-white/5 transition-colors">
    {children}
  </tr>
);

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-left text-sm font-medium text-[#40d6d1]">
    {children}
  </th>
);

const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 text-sm text-white/80">
    {children}
  </td>
);

// Export MDX components object
export const mdxComponents: MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  a: A,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  pre: Pre,
  code: Code,
  img: Img,
  hr: HR,
  strong: Strong,
  em: Em,
  table: Table,
  thead: THead,
  tbody: TBody,
  tr: TR,
  th: TH,
  td: TD,
};
