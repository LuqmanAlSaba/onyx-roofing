import { Metadata } from 'next';
import {
  Camera,
  ChevronDown,
  ClipboardList,
  CloudHail,
  Droplets,
  FileText,
  Hammer,
  Phone,
  Receipt,
  ShieldCheck,
  Users,
  Wind,
} from 'lucide-react';
import Navigation from '@/app/components/Navigation';
import BlogPostClient from '@/app/components/Blog/BlogPostClient';

const pageUrl = 'https://www.onyxroofingpro.com/roof-insurance-claims';

export const metadata: Metadata = {
  title: 'Roof Insurance Claims Louisville, KY | Storm & Hail Damage | Onyx Roofing',
  description:
    'Hail or wind damage? Onyx Roofing documents your storm damage, meets your adjuster on site, and handles the rebuild. Free roof inspections in St. Matthews, Louisville, and across Kentucky.',
  keywords: [
    'roof insurance claim Louisville',
    'hail damage roof Kentucky',
    'storm damage roof insurance',
    'insurance roof replacement Louisville',
    'roof adjuster meeting',
    'wind damage roof claim',
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: 'Roof Insurance Claims | Onyx Roofing',
    description:
      'We document your storm damage, meet your adjuster on site, and handle the rebuild. Free roof inspections across Louisville and Kentucky.',
    url: pageUrl,
    siteName: 'Onyx Roofing',
    type: 'website',
    images: [{ url: '/onyx-roofing-og.png', width: 1200, height: 630, alt: 'Onyx Roofing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roof Insurance Claims | Onyx Roofing',
    description:
      'We document your storm damage, meet your adjuster on site, and handle the rebuild. Free roof inspections across Louisville and Kentucky.',
    images: ['/onyx-roofing-og.png'],
  },
};

const steps = [
  {
    icon: Camera,
    title: 'Free inspection',
    description:
      "We inspect your roof by ladder and drone and photograph everything: bruised or cracked shingles, lifted tabs, and dents in gutters, vents, and screens. If there's no real damage, we'll tell you, and you don't file.",
  },
  {
    icon: FileText,
    title: 'You file the claim',
    description:
      'If the damage is there, you call your insurance company to open a claim. It takes a few minutes. They assign an adjuster to come look at the roof.',
  },
  {
    icon: Users,
    title: 'Adjuster inspection',
    description:
      "We can be on the roof with your adjuster to show them the damage we documented, so nothing gets missed.",
  },
  {
    icon: ClipboardList,
    title: 'Review the scope',
    description:
      "Your insurer sends a scope of loss listing what they'll pay for. We walk you through it line by line and flag anything we think was left out, so you can take it back to your adjuster.",
  },
  {
    icon: Hammer,
    title: 'The build',
    description:
      'You pick your shingles and colors, we schedule the install, and we clean up when we finish. Your out-of-pocket cost on the covered work is your deductible.',
  },
  {
    icon: Receipt,
    title: 'Close it out',
    description:
      'We send the completion photos and final invoice your insurer needs to release any remaining payment, like recoverable depreciation.',
  },
];

const damageSigns = [
  {
    icon: CloudHail,
    title: 'Hail bruising',
    description: 'Dark spots where granules have been knocked off, exposing the asphalt underneath.',
  },
  {
    icon: Wind,
    title: 'Wind damage',
    description: 'Creased, lifted, or missing shingles where the seal has been broken.',
  },
  {
    icon: ShieldCheck,
    title: 'Dented metal',
    description: 'Dings in gutters, downspouts, vents, and AC units. A strong sign the roof was hit too.',
  },
  {
    icon: Droplets,
    title: 'Granules and leaks',
    description: 'Piles of granules at the downspouts, or new water stains on ceilings after a storm.',
  },
];

const testimonials = [
  {
    quote:
      'They worked with our insurance company to get our hail damage taken care of.',
    name: 'Jessica Siegel',
  },
  {
    quote:
      "From inspection, to selection to dealing with the insurance company, I couldn't ask for anything more.",
    name: 'Marc Reinicke',
  },
  {
    quote:
      'They inspected our roof after a storm. By ladder and drone... Our roof was okay - no action required - a relief.',
    name: 'Ben St Clair',
  },
];

const faqs = [
  {
    question: 'Will my homeowners insurance pay for a new roof?',
    answer:
      "It depends on what caused the damage. Most homeowners policies cover sudden damage from hail, wind, and falling trees. They generally don't cover wear and tear or an old roof reaching the end of its life. A free inspection tells you which one you're dealing with before you call your insurer.",
  },
  {
    question: 'How long do I have to file a roof damage claim?',
    answer:
      "Your policy sets the deadline. Many require claims within a year of the storm, and some are shorter. Check the \"duties after loss\" section of your policy, and don't wait. Damage that goes unrepaired can also turn into leaks your insurer may not cover.",
  },
  {
    question: 'Can you pay or waive my insurance deductible?',
    answer:
      "No. Kentucky law prohibits roofing contractors from paying, waiving, or rebating a homeowner's deductible. A contractor who offers to is breaking the law and putting your claim at risk. We'll always be upfront that your deductible is your responsibility.",
  },
  {
    question: 'Should I get an inspection before I call my insurance company?',
    answer:
      "We recommend it. An inspection shows whether there's real storm damage worth claiming, and it gives you photos to reference when you talk to your insurer. Our inspections are free, and if your roof is fine, we'll tell you.",
  },
  {
    question: 'Do you negotiate my claim with the insurance company?',
    answer:
      "No. Under Kentucky law, only you or a licensed public adjuster can negotiate your claim. What we do is document the damage, be there when the adjuster inspects, and explain the scope of loss so you know what's covered and what may have been missed.",
  },
  {
    question: 'What if the adjuster misses damage or denies my claim?',
    answer:
      'You can ask your insurer for a re-inspection, and our photos and notes give you evidence to support it. For larger disputes, you also have the option of hiring a licensed public adjuster or using the appraisal process in your policy.',
  },
  {
    question: 'What is recoverable depreciation?',
    answer:
      "Many policies pay in two parts. The first check covers the depreciated value of your roof, minus your deductible. Once the work is finished and your insurer receives the final invoice, they release the rest, called recoverable depreciation. We send that paperwork for you.",
  },
  {
    question: 'My roof is leaking right now. What should I do?',
    answer:
      'Call us at (502) 207-3007. We offer 24/7 emergency service and can make temporary repairs to stop further damage, which most policies expect you to do. Take photos of any interior damage before cleaning up, then open your claim.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Roof Insurance Claim Assistance',
  serviceType: 'Storm damage roof repair and replacement',
  url: pageUrl,
  areaServed: { '@type': 'State', name: 'Kentucky' },
  provider: {
    '@type': 'RoofingContractor',
    name: 'Onyx Roofing',
    url: 'https://www.onyxroofingpro.com',
    telephone: '+1-502-207-3007',
  },
};

export default function RoofInsuranceClaimsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <main
        className="min-h-screen bg-gradient-to-br from-[#192119] to-[#1a1f1a]"
        style={{
          border: '16px solid #1a1f1a',
          background: '#1a1f1a',
        }}
      >
        <div
          style={{ borderRadius: '32px 32px 0 0', minHeight: '100vh' }}
          className="bg-gradient-to-br from-[#192119] to-[#1a1f1a] relative overflow-hidden"
        >
          <Navigation variant="fixed" />

          {/* Hero */}
          <section className="relative max-w-4xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-12 text-center">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#40d6d1]/10 rounded-full blur-[120px]" />
            </div>
            <p className="relative text-sm uppercase tracking-[0.2em] text-[#40d6d1] mb-4">
              Storm & hail damage
            </p>
            <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6 tracking-tight leading-tight">
              Roof Insurance Claims in Louisville, KY
            </h1>
            <p className="relative text-lg sm:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-8">
              A storm claim shouldn&apos;t be a second job. We inspect and document the damage, meet your adjuster on
              site, and handle the rebuild, so you can get your roof fixed with as little back-and-forth as possible.
            </p>
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="#free-inspection"
                className="shimmer-effect inline-flex items-center px-6 py-3 bg-[#13a19c] hover:bg-[#0f7a76] text-white font-medium rounded-full transition-all duration-300"
              >
                Get a Free Storm Inspection
              </a>
              <a
                href="tel:5022073007"
                className="shimmer-effect inline-flex items-center gap-2 px-6 py-3 border border-[#40d6d1]/50 text-[#40d6d1] hover:bg-[#40d6d1] hover:text-white font-medium rounded-full transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Call (502) 207-3007
              </a>
            </div>
          </section>

          {/* Testimonials */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="p-6 rounded-lg bg-[#2a2d31]/30 border border-white/5"
                >
                  <div className="text-[#FBBF24] text-sm mb-3" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <blockquote className="text-white/80 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="text-sm text-white/50">{t.name}, Google review</figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Process */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2">
                How the <span className="font-normal text-[#40d6d1]">claim process</span> works
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                From the first inspection to the final check, here&apos;s what to expect.
              </p>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative p-6 rounded-lg bg-[#2a2d31]/30 border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#40d6d1]/10 flex items-center justify-center text-[#40d6d1]">
                      <step.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-white/40">Step {index + 1}</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Damage signs */}
          <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2">
                Signs your roof has <span className="font-normal text-[#40d6d1]">storm damage</span>
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                Most roof damage can&apos;t be seen from the ground. These are the clues worth checking after a storm.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {damageSigns.map((sign) => (
                <div key={sign.title} className="p-6 rounded-lg bg-[#2a2d31]/30 border border-white/5">
                  <sign.icon className="w-6 h-6 text-[#40d6d1] mb-4" aria-hidden="true" />
                  <h3 className="text-base font-medium text-white mb-2">{sign.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{sign.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Straight talk */}
          <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#40d6d1]/10 to-[#13938f]/10 border border-[#40d6d1]/20">
              <h2 className="text-2xl font-light text-white mb-4">
                Straight talk about <span className="font-normal text-[#40d6d1]">storm chasers</span>
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                After a big storm, out-of-town crews knock on doors promising a free roof. Be careful with anyone who
                offers to cover your deductible (that&apos;s illegal in Kentucky), pressures you to sign on the spot, or
                won&apos;t be around to honor a warranty.
              </p>
              <p className="text-white/70 leading-relaxed">
                We&apos;re a family-owned company based in St. Matthews. If your roof doesn&apos;t need work, we&apos;ll
                say so, and we&apos;ll still be here years from now if you ever need us.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2">
                Frequently asked <span className="font-normal text-[#40d6d1]">questions</span>
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg bg-[#2a2d31]/30 border border-white/5 open:border-[#40d6d1]/20"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 text-white font-medium [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base">{faq.question}</h3>
                    <ChevronDown
                      className="w-5 h-5 shrink-0 text-[#40d6d1] transition-transform duration-300 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="px-5 pb-5 -mt-1 text-white/70 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div id="free-inspection" className="max-w-4xl mx-auto px-4 sm:px-8 pb-16 scroll-mt-32">
            <BlogPostClient
              ctaTitle="Think you have storm damage?"
              ctaDescription="Get a free inspection before you call your insurance company. We'll document what we find and tell you honestly whether it's worth a claim."
              ctaButtonText="Schedule Free Inspection"
              initialService="Storm Damage"
            />
          </div>
        </div>
      </main>
    </>
  );
}
