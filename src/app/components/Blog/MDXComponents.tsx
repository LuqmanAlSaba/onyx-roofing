import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';
import { Check, Plus, Minus, Lightbulb, TriangleAlert } from 'lucide-react';

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

// Unordered list component with custom checkmark items
const UL = ({ children, listType = 'default' }: { children: React.ReactNode; listType?: string }) => (
  <ul className="list-none space-y-4">
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === 'li') {
        const { children: liChildren, ...props } = child.props as { children: React.ReactNode;[key: string]: unknown };

        // Choose icon and color based on list type
        let IconComponent = Check;
        let iconColor = 'text-[#40d6d1]';
        let bgColor = 'bg-[#40d6d1]/10';
        let borderColor = 'border-[#40d6d1]/20';

        if (listType === 'advantages') {
          IconComponent = Plus;
          iconColor = 'text-green-500';
          bgColor = 'bg-green-500/10';
          borderColor = 'border-green-500/20';
        } else if (listType === 'disadvantages') {
          IconComponent = Minus;
          iconColor = 'text-red-500';
          bgColor = 'bg-red-500/10';
          borderColor = 'border-red-500/20';
        } else if (listType === 'checklist') {
          IconComponent = Check;
          iconColor = 'text-[#40d6d1]';
          bgColor = 'bg-[#40d6d1]/10';
          borderColor = 'border-[#40d6d1]/20';
        } else {
          // Default neutral dot style
          return (
            <li {...props} className="flex items-start gap-4 text-lg md:text-xl text-white/80 leading-relaxed">
              <span className="flex-shrink-0 mt-2.5 w-2 h-2 rounded-full bg-[#40d6d1]" />
              <span>{liChildren}</span>
            </li>
          );
        }

        return (
          <li {...props} className="flex items-start gap-4 text-lg md:text-xl text-white/80 leading-relaxed">
            <span className={`flex-shrink-0 mt-1.5 w-6 h-6 rounded-full ${bgColor} flex items-center justify-center border ${borderColor}`}>
              <IconComponent className={`w-3.5 h-3.5 ${iconColor}`} strokeWidth={3} />
            </span>
            <span>{liChildren}</span>
          </li>
        );
      }
      return child;
    })}
  </ul>
);

// List Section component with container styling
const ListSection = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  // Determine icon type based on title (case-insensitive)
  const titleLower = title?.toLowerCase() || '';
  const isAdvantages = titleLower.includes('advantage') || titleLower.includes('feature');
  const isDisadvantages = titleLower.includes('disadvantage');
  const isChecklist = titleLower.includes('professional') || titleLower.includes('checklist') || titleLower.includes('inspection');
  const listType = isAdvantages ? 'advantages' : isDisadvantages ? 'disadvantages' : isChecklist ? 'checklist' : 'default';

  // Clone children and pass listType to UL components
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === UL) {
      return React.cloneElement(child as React.ReactElement<{ listType: string }>, { listType });
    }
    return child;
  });

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-white/8 shadow-lg shadow-black/20">
      <div className="flex">
        {/* Left accent bar */}
        <div className="w-1 flex-shrink-0 bg-gradient-to-b from-[#40d6d1] to-[#40d6d1]/30" />
        <div className="flex-1 p-6 sm:p-8 bg-white/[0.025]">
          {title && (
            <h3 className="text-xl font-semibold text-white mb-5 pb-4 border-b border-white/10">
              {title}
            </h3>
          )}
          <div className="space-y-4">
            {childrenWithProps}
          </div>
        </div>
      </div>
    </div>
  );
};

// Advantages List component with green plus signs
const AdvantagesList = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  // Clone children and pass advantages listType to UL components
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === UL) {
      return React.cloneElement(child as React.ReactElement<{ listType: string }>, { listType: 'advantages' });
    }
    return child;
  });

  return (
    <div className="my-8 p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
      {title && (
        <h3 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {childrenWithProps}
      </div>
    </div>
  );
};

// Disadvantages List component with red minus signs
const DisadvantagesList = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  // Clone children and pass disadvantages listType to UL components
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === UL) {
      return React.cloneElement(child as React.ReactElement<{ listType: string }>, { listType: 'disadvantages' });
    }
    return child;
  });

  return (
    <div className="my-8 p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
      {title && (
        <h3 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {childrenWithProps}
      </div>
    </div>
  );
};

// Numbered List component
const NumberedList = ({ title, children }: { title?: string; children: React.ReactNode }) => {
  // Extract li elements from ul wrapper that MDX creates
  let items: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === UL) {
      items = React.Children.toArray((child.props as { children: React.ReactNode }).children);
    } else if (React.isValidElement(child) && child.type === 'li') {
      items.push(child);
    }
  });

  // Filter to only include li elements
  const liItems = items.filter((item) => React.isValidElement(item) && item.type === 'li');

  return (
    <div className="my-8 p-6 sm:p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
      {title && (
        <h3 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">
          {title}
        </h3>
      )}
      <div className="space-y-4">
        {liItems.map((item, index) => {
          if (React.isValidElement(item)) {
            const { children: liChildren, ...props } = item.props as { children: React.ReactNode;[key: string]: unknown };
            return (
              <div key={index} {...props} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#40d6d1] to-[#2cc2bd] flex items-center justify-center shadow-lg shadow-[#40d6d1]/20">
                  <span className="text-sm font-black text-black">{index + 1}</span>
                </div>
                <div className="flex-1 text-lg md:text-xl text-white/80 leading-relaxed pt-0.5">
                  {liChildren}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

// Ordered list component
const OL = ({ children }: { children: React.ReactNode }) => (
  <ol className="list-decimal list-inside space-y-2 ml-6 text-white/80 text-lg md:text-xl leading-relaxed">
    {children}
  </ol>
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

  const ImageContent = () => {
    if (src.startsWith('http')) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ''}
          className="w-full h-auto"
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={1200}
        height={675}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
    );
  };

  return (
    <figure className="my-10 group">
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
        <ImageContent />
      </div>
      {alt && (
        <figcaption className="text-center mt-4 text-white/50 text-sm font-light tracking-wide italic">
          {alt}
        </figcaption>
      )}
    </figure>
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
  <div className="overflow-x-auto my-12 rounded-xl border border-white/5 shadow-xl shadow-black/10 -mx-4 sm:mx-0">
    <div className="inline-block min-w-full align-middle">
      <table className="min-w-full divide-y divide-white/5 bg-white/[0.02] backdrop-blur-sm">
        {children}
      </table>
    </div>
  </div>
);

const THead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-white/[0.03]">
    {children}
  </thead>
);

const TBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-white/5 bg-transparent">
    {children}
  </tbody>
);

const TR = ({ children }: { children: React.ReactNode }) => (
  <tr className="hover:bg-white/[0.02] transition-colors duration-200 group">
    {children}
  </tr>
);

const TH = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#40d6d1] uppercase tracking-wider">
    {children}
  </th>
);

const TD = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 sm:px-6 py-4 text-sm md:text-base text-white/80 group-hover:text-white transition-colors">
    {children}
  </td>
);

// Image with Price component
const ImageWithPrice = ({ src, alt, price, priceDescription }: { src: string; alt?: string; price: string; priceDescription?: string }) => {
  if (!src) return null;

  const ImageContent = () => {
    if (src.startsWith('http')) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ''}
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={1200}
        height={675}
        className="w-full h-full object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
      />
    );
  };

  return (
    <figure className="mt-0 mb-12 group">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 w-full max-h-[500px]">
        {/* Image with gradient overlay */}
        <div className="relative">
          <ImageContent />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Price Tag Overlay */}
          <div className="absolute bottom-6 right-6 z-50">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-lg">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-[#40d6d1] uppercase tracking-widest mb-1">Estimated Cost</span>
                <div className="text-3xl font-medium text-white tracking-tight">
                  {price}
                </div>
                {priceDescription && (
                  <div className="text-xs text-white/60 font-medium mt-0.5">
                    {priceDescription}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {alt && (
        <figcaption className="text-center mt-4 text-white/50 text-sm font-light tracking-wide italic">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

// Recommendation Card Component
const RecommendationCard = ({ title, material, description }: { title: string; material: string; description: string }) => (
  <div className="group relative bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-xl p-6 transition-all duration-300">
    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 transition-colors">
      {title}
    </h3>
    <div className="flex items-baseline gap-2 mb-3">
      <span className="text-lg font-bold text-[#40d6d1]">{material}</span>
      <span className="text-white/40 font-light">—</span>
    </div>
    <p className="text-base text-white/70 leading-relaxed transition-colors">
      {description}
    </p>
  </div>
);

// Recommendation Grid Component
const RecommendationGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
    {children}
  </div>
);

// Cost Comparison Component for visualizing long-term value
const CostComparison = () => (
  <div className="my-12 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
      {/* Metal Roofing */}
      <div className="p-6 sm:p-8">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-[#40d6d1] mb-1">Standing Seam Metal</h4>
          <p className="text-sm text-white/50">50-year cost analysis · Lifespan: 40-70 years</p>
        </div>

        <div className="space-y-5 mb-6">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-white/70">Initial installation</div>
              <div className="text-xs text-white/40 mt-0.5">Year 0</div>
            </div>
            <span className="text-2xl font-bold text-white">$15,000</span>
          </div>

          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-white/70">Replacements needed</div>
              <div className="text-xs text-white/40 mt-0.5">No replacement within 50 years</div>
            </div>
            <span className="text-lg font-medium text-white/80">$0</span>
          </div>

          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-white/70">Maintenance</div>
              <div className="text-xs text-white/40 mt-0.5">~$100-200/year × 50 years</div>
            </div>
            <span className="text-lg font-medium text-white/80">~$7,500</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-white/60 uppercase tracking-wider">50-Year Total</span>
            <span className="text-3xl font-black text-[#40d6d1]">$22,500</span>
          </div>
        </div>
      </div>

      {/* Asphalt Shingles */}
      <div className="p-6 sm:p-8 bg-white/[0.01]">
        <div className="mb-6">
          <h4 className="text-xl font-semibold text-white mb-1">Asphalt Shingles</h4>
          <p className="text-sm text-white/50">50-year cost analysis · Lifespan: 20-25 years</p>
        </div>

        <div className="space-y-5 mb-6">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-white/70">Initial installation</div>
              <div className="text-xs text-white/40 mt-0.5">Year 0</div>
            </div>
            <span className="text-2xl font-bold text-white">$7,000</span>
          </div>

          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-white/70">Replacement</div>
              <div className="text-xs text-white/40 mt-0.5">Year 25</div>
            </div>
            <span className="text-lg font-medium text-white/80">$7,000</span>
          </div>

          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-white/70">Maintenance</div>
              <div className="text-xs text-white/40 mt-0.5">~$300-500/year × 50 years</div>
            </div>
            <span className="text-lg font-medium text-white/80">~$20,000</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium text-white/60 uppercase tracking-wider">50-Year Total</span>
            <span className="text-3xl font-black text-white">$34,000</span>
          </div>
        </div>
      </div>
    </div>

    {/* Verdict */}
    <div className="px-6 sm:px-8 py-4 bg-[#40d6d1]/5 border-t border-[#40d6d1]/20">
      <p className="text-sm text-white/70 text-center">
        <span className="font-semibold text-[#40d6d1]">Over a 50-year span, standing seam metal delivers the lowest total cost of ownership</span> — saving $11,500+ while providing superior durability
      </p>
    </div>
  </div>
);

// Material Comparison Component with visual ratings
const MaterialComparison = () => {
  const getRatingColor = (rating: string) => {
    if (rating === 'Excellent' || rating === 'Very Low') return 'bg-emerald-500';
    if (rating === 'Good' || rating === 'Low') return 'bg-blue-500';
    if (rating === 'Moderate' || rating === 'Medium') return 'bg-yellow-500';
    if (rating === 'Fair') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getRatingWidth = (rating: string) => {
    if (rating === 'Excellent') return 'w-full';
    if (rating === 'Good') return 'w-3/4';
    if (rating === 'Fair') return 'w-1/2';
    if (rating === 'Moderate') return 'w-2/3';
    if (rating === 'Medium') return 'w-2/3';
    if (rating === 'Low') return 'w-1/4';
    if (rating === 'Very Low') return 'w-1/6';
    return 'w-1/2';
  };

  const materials = [
    {
      name: 'Asphalt Shingles',
      lifespan: '20-30 years',
      windRating: 'Good',
      hailRating: 'Fair',
      energyEfficiency: 'Moderate',
      maintenance: 'Medium'
    },
    {
      name: 'Architectural Shingles',
      lifespan: '30-50 years',
      windRating: 'Excellent',
      hailRating: 'Good',
      energyEfficiency: 'Moderate',
      maintenance: 'Low'
    },
    {
      name: 'Metal',
      lifespan: '40-70 years',
      windRating: 'Excellent',
      hailRating: 'Good',
      energyEfficiency: 'Excellent',
      maintenance: 'Very Low'
    },
    {
      name: 'Tile',
      lifespan: '50-100 years',
      windRating: 'Excellent',
      hailRating: 'Excellent',
      energyEfficiency: 'Excellent',
      maintenance: 'Low'
    },
    {
      name: 'Slate',
      lifespan: '75-200 years',
      windRating: 'Excellent',
      hailRating: 'Excellent',
      energyEfficiency: 'Excellent',
      maintenance: 'Very Low'
    }
  ];

  const RatingBar = ({ label, rating }: { label: string; rating: string }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-sm text-white/80 font-medium">{rating}</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${getRatingWidth(rating)} ${getRatingColor(rating)} rounded-full transition-all duration-300`} />
      </div>
    </div>
  );

  return (
    <div className="my-12 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="max-w-[94vw] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {materials.map((material) => (
            <div
              key={material.name}
              className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-6"
            >
              <div className="mb-5">
                <h4 className="text-xl font-semibold text-white mb-1 truncate" title={material.name}>{material.name}</h4>
                <p className="text-base text-[#40d6d1]">{material.lifespan}</p>
              </div>

              <div>
                <RatingBar label="Wind Resistance" rating={material.windRating} />
                <RatingBar label="Hail Resistance" rating={material.hailRating} />
                <RatingBar label="Energy Efficiency" rating={material.energyEfficiency} />
                <RatingBar label="Maintenance" rating={material.maintenance} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-sm text-white/60">Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-sm text-white/60">Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-sm text-white/60">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span className="text-sm text-white/60">Fair</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cost component (stylized text)
const Cost = ({ value, description }: { value: string; description?: string }) => (
  <div className="text-lg md:text-xl text-white/90 my-4 font-medium">
    <span className="text-[#40d6d1] font-bold uppercase tracking-wider text-sm mr-3">Estimated Cost:</span>
    <span className="text-white">{value}</span>
    {description && <span className="text-white/60 ml-2 font-normal text-base">{description}</span>}
  </div>
);

// Expert Tip Component (Localized Insights)
const ExpertTip = ({ title = "Kentucky Roofing Insight", children }: { title?: string; children: React.ReactNode }) => (
  <div className="not-prose my-10 relative group">
    {/* Ambient glow */}
    <div className="absolute -inset-[2px] bg-gradient-to-r from-[#40d6d1]/50 via-[#40d6d1]/20 to-[#40d6d1]/50 rounded-2xl opacity-50 group-hover:opacity-80 transition duration-500 blur-[3px]" />
    <div className="relative bg-gradient-to-br from-[#0a1f1c] to-[#0d1a17] border border-[#40d6d1]/30 rounded-2xl p-6 sm:p-8">
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#40d6d1] to-[#2aada9] flex items-center justify-center shadow-lg shadow-[#40d6d1]/30 ring-1 ring-[#40d6d1]/20">
          <Lightbulb className="w-5 h-5 text-[#0a1f1c]" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#40d6d1] mb-2 uppercase tracking-widest">{title}</h4>
          <div className="text-white/85 leading-relaxed text-base md:text-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Weather Alert Component (Severe Storm Prep)
const WeatherAlert = ({ title = "Severe Weather Warning", date, children }: { title?: string; date?: string; children: React.ReactNode }) => (
  <div className="not-prose my-10 rounded-2xl bg-gradient-to-br from-red-950/60 via-amber-950/30 to-red-950/20 border border-red-500/30 p-6 sm:p-8 relative overflow-hidden shadow-lg shadow-red-950/20">
    {/* Top accent line */}
    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-500/0 via-red-500/60 to-red-500/0 rounded-t-2xl" />
    {/* Subtle background icon */}
    <div className="absolute -bottom-6 -right-6 opacity-[0.05]">
      <TriangleAlert className="w-48 h-48" />
    </div>
    <div className="relative z-10">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shadow-sm shadow-red-500/10">
          <TriangleAlert className="w-5 h-5 text-red-400" />
        </div>
        <div className="pt-0.5">
          <h4 className="text-base font-bold text-red-400 uppercase tracking-widest leading-tight">{title}</h4>
          {date && (
            <span className="text-xs font-medium text-red-400/60 mt-0.5 block">{date}</span>
          )}
        </div>
      </div>
      <div className="text-white/85 leading-relaxed text-base md:text-lg border-t border-red-500/15 pt-4">
        {children}
      </div>
    </div>
  </div>
);

// Timeline Checklist Component — single column, left-aligned vertical timeline
const TimelineChecklist = ({ children }: { children: React.ReactNode }) => {
  const items = React.Children.toArray(children);
  return (
    <div className="not-prose my-12">
      <div className="relative pl-14 sm:pl-16">
        {/* Vertical Line */}
        <div className="absolute left-[19px] sm:left-[23px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-[#40d6d1] via-[#40d6d1]/50 to-[#40d6d1]/10 rounded-full" />
        <div className="space-y-6">
          {items.map((child, index) =>
            React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<{ _step: number }>, { _step: index + 1 })
              : child
          )}
        </div>
      </div>
    </div>
  );
};

const TimelineStep = ({ _step, title, children }: { _step?: number; step?: number | string; title: string; children: React.ReactNode }) => (
  <div className="relative">
    {/* Number Badge — auto-numbered by parent */}
    <div className="absolute -left-14 sm:-left-16 top-3 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#40d6d1] flex items-center justify-center z-10 shadow-[0_0_18px_rgba(64,214,209,0.5)]">
      <span className="text-[#080e0d] font-black text-base sm:text-lg tabular-nums leading-none select-none">{_step}</span>
    </div>

    {/* Content Card */}
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.055] hover:border-[#40d6d1]/25 transition-all duration-300 group">
      <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-[#40d6d1]/90 transition-colors duration-300">{title}</h4>
      <div className="text-white/70 leading-relaxed text-base sm:text-lg">
        {children}
      </div>
    </div>
  </div>
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
  // li: LI, // Removed LI mapping
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
  ListSection,
  AdvantagesList,
  DisadvantagesList,
  NumberedList,
  Cost,
  CostComparison,
  MaterialComparison,
  ImageWithPrice,
  RecommendationCard,
  RecommendationGrid,
  ExpertTip,
  WeatherAlert,
  TimelineChecklist,
  TimelineStep,
};
